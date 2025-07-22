"use client"
import React, { useState,useEffect } from "react";
import { useParams } from 'next/navigation'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";
import { supabase } from '@/lib/supabase'
import AudioPlayer from "./components/AudioPlayer";

export default function DetailPage() {
  const params = useParams();
  const id = params.id;
  const [speech, setSpeech] = useState(null)
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.4);
  const [currentTime, setCurrentTime] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const duration = 60; // seconds, mock

  useEffect(() => {
    if (id) {
      supabase
        .from('speech_recordings')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) console.error(error)
          else setSpeech(data)
        })
    }
  }, [id])

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-extrabold flex-1">{speech?.original_file_name}</h1>
        <nav className="flex gap-8 items-center text-base font-medium">
          <Link href="/home" className="hover:underline">Home</Link>
          <Link href="/list" className="hover:underline">My Library</Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-pink-300 flex items-center justify-center overflow-hidden ml-4">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-8 py-8 gap-8">
        <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0">
          {/* Original Text */}
          <div className="flex-1 bg-background rounded-lg p-6 shadow-sm flex flex-col min-h-0">
            <div className="text-base text-foreground whitespace-pre-line leading-relaxed overflow-scroll max-h-[500px]">
              {speech?.extracted_text_preview}
            </div>
          </div>
          {/* Textarea for writing and Proofread button */}
          <div className="flex-1 bg-background rounded-lg p-6 shadow-sm flex flex-col min-h-0">
            <textarea
              className="w-full h-full min-h-[300px] max-h-[500px] resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none mb-4"
              placeholder="Listen and write here..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <Button className="w-full" size="lg">proofread</Button>
          </div>
        </div>

        {/* Audio Player - Centered and Beautified */}
        <AudioPlayer src={speech?.audio_url} />
      </main>
    </div>
  );
} 