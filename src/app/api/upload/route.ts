// app/api/upload/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

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
  const { error: insertError } = await supabase
    .from('files')
    .insert([{ file_name: file.name, url: fileUrl }])

  if (insertError) {
    console.error('Database insert error:', insertError.message)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Upload success', url: fileUrl })
}
