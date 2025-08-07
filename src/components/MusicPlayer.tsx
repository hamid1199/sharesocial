import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Pause, Play, Upload } from "lucide-react";

function formatTime(sec: number) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const MusicPlayer: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Update current time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [audioUrl]);

  // Reset time and duration on new file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setFileName(file.name);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  // Play/pause logic
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // When audio metadata loads, set duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // When audio ends, reset play state
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
  };

  // Seek when user clicks or drags progress bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
    const seekTime = percent * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Drag thumb
  const handleThumbDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsSeeking(true);
    handleSeek(e);
    const onMove = (moveEvent: MouseEvent) => {
      if (!progressBarRef.current || !audioRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const moveX = moveEvent.clientX - rect.left;
      const percent = Math.min(Math.max(moveX / rect.width, 0), 1);
      const seekTime = percent * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    };
    const onUp = () => {
      setIsSeeking(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Keep isPlaying in sync with audio element
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);

  // Progress bar percent
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="max-w-sm mx-auto mt-6 w-full shadow-xl rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Music className="w-6 h-6 text-blue-500" />
          <span className="tracking-wide">Music Player</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {/* File name */}
          {fileName && (
            <div className="w-full text-center text-base font-semibold text-blue-700 dark:text-blue-300 truncate mb-2">
              {fileName}
            </div>
          )}
          {/* Play/Pause button */}
          <div className="flex items-center justify-center w-full">
            <Button
              onClick={handlePlayPause}
              disabled={!audioUrl}
              variant="default"
              size="icon"
              className="w-16 h-16 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white text-3xl flex items-center justify-center"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9" />}
            </Button>
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={handleAudioPlay}
                onPause={handleAudioPause}
                onEnded={handleAudioEnded}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
              />
            )}
          </div>
          {/* Progress bar and time info */}
          {audioUrl && (
            <div className="w-full flex flex-col gap-2 mt-2">
              <div
                ref={progressBarRef}
                className="relative w-full h-3 bg-blue-100 dark:bg-slate-700 rounded-full overflow-hidden cursor-pointer group"
                onClick={handleSeek}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: `calc(${progressPercent}% - 10px)`,
                    transition: isSeeking ? "none" : "left 0.2s",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white border-2 border-blue-500 shadow-md cursor-pointer group-hover:scale-110 transition-transform"
                    onMouseDown={handleThumbDrag}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-blue-700 dark:text-blue-200 font-mono mt-1 px-1">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
          {/* Select/Change Music button at the bottom */}
          <label className="w-full flex flex-col items-center mt-2">
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="music-upload"
            />
            <Button
              asChild
              variant="outline"
              className="w-full flex items-center gap-2 rounded-lg border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <label htmlFor="music-upload" className="cursor-pointer w-full flex items-center justify-center py-2">
                <Upload className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{fileName ? "Change Music" : "Select Music"}</span>
              </label>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;