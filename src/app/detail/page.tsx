"use client"
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";

const originalText = `In the vibrant summer of 1922, Nick Carraway, a Yale graduate, moves to West Egg, Long Island, seeking a career in the bond business. His modest cottage is overshadowed by the opulent mansion of Jay Gatsby, a mysterious millionaire known for his lavish parties. Across the bay in East Egg, Nick visits his cousin Daisy Buchanan and her wealthy, imposing husband, Tom. There, he meets Jordan Baker, a cynical professional golfer, with whom he becomes romantically involved. Nick soon learns of Tom's affair with Myrtle Wilson, a working-class woman from the Valley of Ashes, a desolate area between West Egg and New York City. Myrtle's husband, George Wilson, runs a failing auto repair shop and is oblivious to the affair. Gatsby eventually invites Nick to one of his extravagant parties, where Nick encounters Jordan, who reveals that Gatsby is deeply in love with Daisy and throws these parties in hopes of attracting her attention. Nick facilitates a reunion between Gatsby and Daisy, and they begin an affair. Gatsby's past is shrouded in mystery, but it is gradually revealed that he was born into poverty and amassed his fortune through illegal activities to win Daisy's love. During a tense confrontation in New York City, Tom exposes Gatsby's illicit dealings, shattering Daisy's illusions about him. As they drive back to Long Island, Daisy, at the wheel of Gatsby's car, accidentally hits and kills Myrtle Wilson. Gatsby takes the blame to protect Daisy, further solidifying his devotion. George`;

export default function DetailPage() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.4);
  const [currentTime, setCurrentTime] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const duration = 60; // seconds, mock

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-extrabold flex-1">The Great Gatsby</h1>
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
            <div className="text-base text-foreground whitespace-pre-line leading-relaxed overflow-auto h-full">
              {originalText}
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
        <div className="flex flex-col items-center justify-center w-full mt-8">
          <div className="flex items-center gap-4 w-full max-w-2xl mb-2">
            <span className="text-sm font-medium min-w-[70px] text-center">{`${Math.floor(currentTime/60)}:${(currentTime%60).toString().padStart(2,"0")} / 1:00`}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={e => setCurrentTime(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
          </div>
          <div className="flex items-center gap-6 bg-background rounded-full px-8 py-4 shadow border mt-2">
            <span className="font-semibold text-base">{speed.toFixed(1)}X</span>
            <Button variant="ghost" size="icon" aria-label="backward" onClick={() => setCurrentTime(t => Math.max(0, t-10))} className="rounded-full hover:bg-blue-100">
              <FaBackward />
            </Button>
            <Button variant="ghost" size="icon" aria-label="play-pause" onClick={() => setPlaying(p => !p)} className="rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md text-xl">
              {playing ? <FaPause /> : <FaPlay />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="forward" onClick={() => setCurrentTime(t => Math.min(duration, t+10))} className="rounded-full hover:bg-blue-100">
              <FaForward />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSpeed(s => s === 1.4 ? 1.0 : 1.4)} className="ml-2">
              {speed === 1.4 ? "1.0X" : "1.4X"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 