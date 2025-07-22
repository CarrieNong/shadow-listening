import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    const { data, error } = await supabase
        .from('speech_recordings')
        .select('id, title, file_name,original_text, audio_url,created_at,extracted_text_preview')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
