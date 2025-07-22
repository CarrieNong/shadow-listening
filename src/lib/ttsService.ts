// lib/ttsService.ts
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid';
import mammoth from 'mammoth';
import extract from 'pdf-extraction';

// Initialize Google Cloud Text-to-Speech Client
let googleTTSClient: TextToSpeechClient;
try {
  if (process.env.GOOGLE_CLOUD_TEXT_TO_SPEECH_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_TEXT_TO_SPEECH_CREDENTIALS);
    googleTTSClient = new TextToSpeechClient({ credentials });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    googleTTSClient = new TextToSpeechClient();
  } else {
    console.error("Google Cloud Text-to-Speech credentials not found. TTS will not function.");
  }
} catch (error) {
  console.error("Failed to initialize Google Cloud TTS client:", error);
}

// --- Helper function to get MIME type from file name ---
function getMimeTypeFromFileName(fileName: string): string | null {
  const parts = fileName.split('.');
  if (parts.length < 2) {
    return null;
  }
  const extension = parts.pop()?.toLowerCase();

  switch (extension) {
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'doc':
      return 'application/msword';
    case 'txt':
      return 'text/plain';
    case 'pdf':
      return 'application/pdf';
    default:
      return null;
  }
}

interface ConvertFileToSpeechOptions {
  fileId: string;
  fileName: string;
  fileUrl: string;
  userId?: string | null;   // *** CHANGED: Make userId optional and allow null ***
  voiceName?: string;
  languageCode?: string;
}

interface ConversionResult {
  audioUrl: string;
}

export async function convertFileToSpeech({
  fileId,
  fileName,
  fileUrl,
  userId = null, // *** CHANGED: Default userId to null if not provided ***
  voiceName = 'en-US-Standard-C',
  languageCode = 'en-US',
}: ConvertFileToSpeechOptions): Promise<ConversionResult> {
  let extractedText: string;
  const mimeType = getMimeTypeFromFileName(fileName);

  if (!mimeType) {
    throw new Error(`Unsupported file type for "${fileName}". Supported: .docx, .txt, .pdf.`);
  }

  console.log(`TTS Service: Downloading file from: ${fileUrl} (Name: ${fileName}, Inferred MIME: ${mimeType})`);
  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error(`TTS Service: Failed to download file: ${fileResponse.statusText}`);
  }
  const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

  console.log(`TTS Service: Extracting text from ${fileName}...`);
  switch (mimeType) {
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      const { value: docxText, messages: mammothMessages } = await mammoth.extractRawText({
        buffer: fileBuffer
      });
      if (mammothMessages.length > 0) {
        console.warn('TTS Service: Mammoth extraction warnings:', mammothMessages);
      }
      extractedText = docxText;
      break;
    case 'text/plain':
      extractedText = fileBuffer.toString('utf8');
      break;
    case 'application/pdf': // .pdf
      console.log('TTS Service: Extracting text from PDF using pdf-extraction...');
      try {
        // pdf-extraction directly takes a Buffer
        const data = await extract(fileBuffer);
        extractedText = data.text;
      } catch (pdfError: any) {
        console.error('TTS Service: PDF parsing error:', pdfError);
        throw new Error(`Failed to extract text from PDF: ${pdfError.message}.`);
      }
      break;
    case 'application/msword':
      throw new Error(`.doc (older Word) files are not directly supported for text extraction. Please convert "${fileName}" to .docx or PDF and re-upload.`);
    default:
      throw new Error(`Unsupported file type: "${fileName}". Supported types: .docx, .txt, .pdf.`);
  }

  if (!extractedText || !extractedText.trim()) {
    throw new Error('No readable text found in the document after extraction.');
  }

  const maxTextLength = 500000;
  const textToSendToTTS = extractedText.substring(0, maxTextLength);
  if (extractedText.length > maxTextLength) {
    console.warn(`TTS Service: Text truncated to ${maxTextLength} characters for TTS.`);
  }

  if (!googleTTSClient) {
    throw new Error("Google Cloud TTS client not initialized. Cannot perform text-to-speech conversion.");
  }
  console.log('TTS Service: Converting text to speech with Google Cloud TTS...');
  const [ttsResponse] = await googleTTSClient.synthesizeSpeech({
    input: { text: textToSendToTTS },
    voice: { languageCode: languageCode, name: voiceName },
    audioConfig: { audioEncoding: 'MP3' },
  });

  if (!ttsResponse.audioContent) {
    throw new Error('TTS Service: No audio content received from Google Cloud TTS.');
  }

  const audioBuffer = Buffer.from(ttsResponse.audioContent);

  const baseFileName = fileName.split('.').slice(0, -1).join('.');
  // Organize audio in 'tts/temp_or_anon/' or 'tts/null_user/' if userId is null
  const audioStoragePathPrefix = userId ? `tts/${userId}` : 'tts/anonymous';
  const audioFilename = `${audioStoragePathPrefix}/${baseFileName}-tts-${uuidv4()}.mp3`;
  const audioBucketName = 'audio-files';

  console.log('TTS Service: Uploading audio to Supabase Storage...');
  const { data: audioUploadData, error: audioUploadError } = await supabase.storage
    .from(audioBucketName)
    .upload(audioFilename, audioBuffer, {
      contentType: 'audio/mp3',
      upsert: false,
    });

  if (audioUploadError) {
    console.error('TTS Service: Supabase Audio Upload Error:', audioUploadError);
    throw new Error(`Failed to upload audio to storage: ${audioUploadError.message}`);
  }

  const { data: publicAudioUrlData } = supabase.storage
    .from(audioBucketName)
    .getPublicUrl(audioFilename);

  const publicAudioUrl = publicAudioUrlData.publicUrl;

  console.log('TTS Service: Storing speech recording metadata in database...');
  const { data: dbRecordData, error: dbRecordError } = await supabase
    .from('speech_recordings')
    .insert({
      user_id: userId, // Will be null
      original_file_id: fileId,
      original_file_url: fileUrl,
      original_file_name: fileName,
      extracted_text_preview: extractedText,
      audio_url: publicAudioUrl,
      voice_name: voiceName,
      language_code: languageCode,
    });

  if (dbRecordError) {
    console.error('TTS Service: Supabase Speech Record DB Insert Error:', dbRecordError);
  }

  return { audioUrl: publicAudioUrl };
}