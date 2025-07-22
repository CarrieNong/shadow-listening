"use client"
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewMaterialModal } from "./components/NewMaterialModal";

type FileItem = {
  id: string, original_file_name: string, audio_url: string, created_at: string, extracted_text_preview: string,status:string
};

export default function ListPage() {
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/get-audio-list')
      .then(res => res.json())
      .then(setFileList);
  }, []);

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col py-8 px-6">
        <Link href="/home" className="flex items-center gap-3 mb-10 hover:underline">
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center font-bold text-lg">TSL</div>
          <div className="font-semibold text-lg leading-tight">The Shadow Listening</div>
        </Link>
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2">
            <span className="i-lucide-home" /> Home
          </Button>
          <Button variant="ghost" className="justify-start gap-2 bg-muted text-foreground font-semibold">
            <span className="i-lucide-file-text" /> My Materials
          </Button>
        </nav>
        <div className="mt-auto">
          <Button className="w-full mt-10" onClick={() => setModalOpen(true)}>New Material</Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-12 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold">My Materials</h1>
          <Button variant="outline" onClick={() => setModalOpen(true)}>New Material</Button>
        </div>
        <div className="mb-6">
          <Input placeholder="Search" className="w-full max-w-xl" />
        </div>
        <div className="bg-background rounded-xl border overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Last Edited</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fileList.map((m, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-3 px-4">
                    <Link href="/detail" className="text-blue-600 hover:underline cursor-pointer">{m.original_file_name}</Link>
                  </td>
                  <td className="py-3 px-4 text-blue-500">{m.created_at}</td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Link key="Edit" href="/detail" className="text-blue-600 hover:underline cursor-pointer">
                      <Button variant="outline"
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button  variant="ghost"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal for New Material */}
      <NewMaterialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        fileInputRef={fileInputRef}
      />
    </div>
  );
} 