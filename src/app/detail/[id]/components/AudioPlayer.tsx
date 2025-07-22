"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";

interface AudioPlayerProps {
  src?: string;
}

const formatTime = (time: number) =>
  `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, "0")}`;

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1.0);

  // 播放/暂停
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // 快进/快退
  const handleSeek = (amount: number) => {
    if (!audioRef.current) return;
    let newTime = Math.max(0, Math.min(audioRef.current.currentTime + amount, duration));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 拖动进度条
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
    setCurrentTime(value);
  };

  // 倍速
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // 监听音频事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", () => setPlaying(true));
      audio.removeEventListener("pause", () => setPlaying(false));
    };
  }, []);

  useEffect(() => {
    setCurrentTime(0);
    setPlaying(false);
  }, [src]);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-8">
      <audio
        ref={audioRef}
        src={src || ""}
        preload="auto"
        style={{ display: "none" }}
      />
      <div className="flex items-center gap-4 w-full max-w-2xl mb-2">
        <span className="text-sm font-medium min-w-[70px] text-center">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSliderChange}
          className="flex-1 accent-blue-500"
        />
      </div>
      <div className="flex items-center gap-6 bg-background rounded-full px-8 py-4 shadow border mt-2">
        <span className="font-semibold text-base">{speed.toFixed(1)}X</span>
        <Button variant="ghost" size="icon" aria-label="backward" onClick={() => handleSeek(-10)} className="rounded-full hover:bg-blue-100">
          <FaBackward />
        </Button>
        <Button variant="ghost" size="icon" aria-label="play-pause" onClick={handlePlayPause} className="rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md text-xl">
          {playing ? <FaPause /> : <FaPlay />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="forward" onClick={() => handleSeek(10)} className="rounded-full hover:bg-blue-100">
          <FaForward />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSpeed(s => s === 1.4 ? 1.0 : 1.4)} className="ml-2">
          {speed === 1.4 ? "1.0X" : "1.4X"}
        </Button>
      </div>
    </div>
  );
}