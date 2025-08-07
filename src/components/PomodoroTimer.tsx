import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const POMODORO_MINUTES = 25;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const PomodoroTimer: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer
  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Pause timer
  const handlePause = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(POMODORO_MINUTES * 60);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="max-w-sm mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Pomodoro Focus Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <span className="text-6xl font-mono font-bold tracking-widest">
            {formatTime(secondsLeft)}
          </span>
          <div className="flex gap-2">
            <Button onClick={handleStart} disabled={isRunning || secondsLeft === 0}>
              Start
            </Button>
            <Button variant="secondary" onClick={handlePause} disabled={!isRunning}>
              Pause
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {secondsLeft === 0
              ? "Time's up! Take a break."
              : isRunning
              ? "Stay focused!"
              : "Ready to start?"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;