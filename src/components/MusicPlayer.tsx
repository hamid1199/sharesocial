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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Seek when user clicks progress bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
    const seekTime = percent * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Keep isPlaying in sync with audio element
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);

  // Progress bar percent
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="max-w-sm mx-auto mt-6 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          <label className="w-full flex flex-col items-center">
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
              className="w-full flex items-center gap-2"
            >
              <label htmlFor="music-upload" className="cursor-pointer w-full flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" />
                {fileName ? "Change Music" : "Select Music"}
              </label>
            </Button>
          </label>
          {fileName && (
            <div className="w-full text-center text-sm text-muted-foreground truncate">
              {fileName}
            </div>
          )}
          <div className="flex items-center gap-2 w-full justify-center">
            <Button
              onClick={handlePlayPause}
              disabled={!audioUrl}
              variant="secondary"
              size="icon"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
            <div className="w-full flex flex-col gap-1">
              <div
                className="w-full h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                onClick={handleSeek}
                aria-label="Music progress bar"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;