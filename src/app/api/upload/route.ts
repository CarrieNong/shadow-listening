// app/api/upload/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid';
import { convertFileToSpeech } from '@/lib/ttsService';

export async function POST(req: Request) {
  let fileStoragePath: string | null = null;
  let originalFileDbId: string | null = null;
  const userId: string | null = null;
  const formData = await req.formData()
  const voiceName = formData.get('voiceName') as string || 'en-US-Standard-C';
  const languageCode = formData.get('languageCode') as string || 'en-US';
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  const originalFileName = file.name;
  const mimeType = file.type;
  fileStoragePath = `uploads/temp_or_anon/${uuidv4()}-${originalFileName}`;

  const fileName = `${Date.now()}_${file.name}`

  // 1. 上传到 Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('documents')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Storage upload error:', uploadError.message)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${fileName}`

  // 2. 写入数据库
  const { data: fileDbData, error: insertError } = await supabase
    .from('files')
    .insert([{ file_name: file.name, url: fileUrl }])
    .select('id')
    .single();

  if (insertError) {
    console.error('Database insert error:', insertError.message)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }
  originalFileDbId = fileDbData.id;

  // return NextResponse.json({ message: 'Upload success', url: fileUrl })
  // 3. Call the external TTS Service utility
  console.log('Upload Route: Delegating to TTS service...');
  const conversionResult = await convertFileToSpeech({
    fileId: originalFileDbId,
    fileName: originalFileName,
    fileUrl: fileUrl,
    userId: userId, // Pass null userId
    voiceName: voiceName,
    languageCode: languageCode,
  });

  console.log('Upload Route: TTS conversion complete.');
  return NextResponse.json({
    message: 'File uploaded and converted to speech successfully!',
    fileUrl: fileUrl,
    audioUrl: conversionResult.audioUrl,
    originalFileId: originalFileDbId,
  }, { status: 200 });
}
