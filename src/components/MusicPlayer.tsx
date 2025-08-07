import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Pause, Play, Upload } from "lucide-react";

const MusicPlayer: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setFileName(file.name);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioEnded = () => setIsPlaying(false);

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
                className="hidden"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;