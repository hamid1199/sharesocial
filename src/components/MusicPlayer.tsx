import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Pause, Play, Upload, SkipForward, SkipBack, Repeat, Shuffle, StopCircle } from "lucide-react";

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

type Mode = "normal" | "repeat" | "shuffle";

interface Track {
  url: string;
  name: string;
  file: File;
}

const MusicPlayer: React.FC = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [mode, setMode] = useState<Mode>("normal");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Handle file selection (multiple)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const tracks: Track[] = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file,
      }));
      setPlaylist(tracks);
      setCurrentIndex(0);
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

  // Stop logic
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Next/Prev logic
  const handleNext = () => {
    if (playlist.length === 0) return;
    if (mode === "shuffle") {
      let next;
      do {
        next = Math.floor(Math.random() * playlist.length);
      } while (playlist.length > 1 && next === currentIndex);
      setCurrentIndex(next);
    } else {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
    setCurrentTime(0);
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    if (mode === "shuffle") {
      let prev;
      do {
        prev = Math.floor(Math.random() * playlist.length);
      } while (playlist.length > 1 && prev === currentIndex);
      setCurrentIndex(prev);
    } else {
      setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
    setCurrentTime(0);
  };

  // Mode toggle
  const handleModeToggle = () => {
    setMode((prev) =>
      prev === "normal" ? "repeat" : prev === "repeat" ? "shuffle" : "normal"
    );
  };

  // When audio metadata loads, set duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // When audio ends, handle next/loop logic
  const handleAudioEnded = () => {
    if (mode === "repeat") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setCurrentTime(0);
    } else if (playlist.length > 0) {
      if (mode === "shuffle") {
        handleNext();
      } else {
        if (currentIndex < playlist.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setIsPlaying(false);
          setCurrentTime(duration);
        }
      }
    }
  };

  // Update current time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [playlist, currentIndex]);

  // When currentIndex changes, reset time and play if was playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);
      if (isPlaying) {
        setTimeout(() => {
          audioRef.current?.play();
        }, 100);
      }
    }
    // eslint-disable-next-line
  }, [currentIndex]);

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

  // Mode icon and label
  const modeIcon =
    mode === "repeat" ? <Repeat className="w-5 h-5" /> :
    mode === "shuffle" ? <Shuffle className="w-5 h-5" /> :
    <Music className="w-5 h-5" />;
  const modeLabel =
    mode === "repeat" ? "Repeat" :
    mode === "shuffle" ? "Shuffle" : "Normal";

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
          {/* Playlist */}
          {playlist.length > 0 && (
            <div className="w-full max-h-32 overflow-y-auto mb-2">
              <ul className="divide-y divide-blue-100 dark:divide-slate-700">
                {playlist.map((track, idx) => (
                  <li
                    key={track.url}
                    className={`flex items-center px-2 py-1 cursor-pointer rounded ${
                      idx === currentIndex
                        ? "bg-blue-100 dark:bg-blue-900 font-semibold text-blue-700 dark:text-blue-200"
                        : "hover:bg-blue-50 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    <span className="truncate">{track.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Play/Pause/Prev/Next/Stop/Mode controls */}
          <div className="flex items-center justify-center gap-3 w-full">
            <Button
              onClick={handlePrev}
              disabled={playlist.length === 0}
              variant="ghost"
              size="icon"
              aria-label="Previous"
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button
              onClick={handlePlayPause}
              disabled={playlist.length === 0}
              variant="default"
              size="icon"
              className="w-14 h-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white text-2xl flex items-center justify-center"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <Button
              onClick={handleStop}
              disabled={playlist.length === 0}
              variant="ghost"
              size="icon"
              aria-label="Stop"
            >
              <StopCircle className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleNext}
              disabled={playlist.length === 0}
              variant="ghost"
              size="icon"
              aria-label="Next"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleModeToggle}
              variant={mode === "normal" ? "outline" : "secondary"}
              size="icon"
              aria-label={modeLabel}
              title={modeLabel}
            >
              {modeIcon}
            </Button>
          </div>
          {/* Audio element */}
          {playlist.length > 0 && (
            <audio
              ref={audioRef}
              src={playlist[currentIndex]?.url}
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
              onEnded={handleAudioEnded}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />
          )}
          {/* Progress bar and time info */}
          {playlist.length > 0 && (
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
              multiple
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
                <span className="font-medium">{playlist.length > 0 ? "Change Music" : "Select Music"}</span>
              </label>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;