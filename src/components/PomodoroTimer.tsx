import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STANDARD_POMODORO_MINUTES = 25;
const STANDARD_BREAK_MINUTES = 5;

type Mode = "focus" | "break";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const PomodoroTimer: React.FC = () => {
  // Customizable durations
  const [focusMinutes, setFocusMinutes] = useState(STANDARD_POMODORO_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(STANDARD_BREAK_MINUTES);

  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  // Update timer when durations change and not running
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(mode === "focus" ? focusMinutes * 60 : breakMinutes * 60);
    }
    // eslint-disable-next-line
  }, [focusMinutes, breakMinutes, mode]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => setNotificationPermission(perm));
    }
  }, []);

  // Notify and vibrate when timer finishes
  useEffect(() => {
    if (secondsLeft === 0) {
      if (notificationPermission === "granted") {
        if (mode === "focus") {
          new Notification("Pomodoro Finished!", {
            body: "Time's up! Take a break.",
            icon: "/favicon.ico",
          });
        } else {
          new Notification("Break Finished!", {
            body: "Break is over! Time to focus.",
            icon: "/favicon.ico",
          });
        }
      }
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300]);
      }
      // Increment Pomodoro count after each focus session
      if (mode === "focus") {
        setPomodoroCount((count) => count + 1);
      }
    }
    // eslint-disable-next-line
  }, [secondsLeft, notificationPermission, mode]);

  // Notify when session starts
  useEffect(() => {
    if (notificationPermission === "granted") {
      if (mode === "break") {
        new Notification("Break Started!", {
          body: "Enjoy your break!",
          icon: "/favicon.ico",
        });
      }
      if (mode === "focus") {
        new Notification("Focus Session Started!", {
          body: "Stay focused and productive!",
          icon: "/favicon.ico",
        });
      }
    }
    // eslint-disable-next-line
  }, [mode]);

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
    setSecondsLeft(mode === "focus" ? focusMinutes * 60 : breakMinutes * 60);
  };

  // Switch session (focus <-> break)
  const handleSwitchSession = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (mode === "focus") {
      setMode("break");
      setSecondsLeft(breakMinutes * 60);
    } else {
      setMode("focus");
      setSecondsLeft(focusMinutes * 60);
    }
  };

  // Set standard times
  const handleStandardTimes = () => {
    setFocusMinutes(STANDARD_POMODORO_MINUTES);
    setBreakMinutes(STANDARD_BREAK_MINUTES);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Progress bar calculation
  const totalSeconds = mode === "focus" ? focusMinutes * 60 : breakMinutes * 60;
  const progressPercent = 100 - (secondsLeft / totalSeconds) * 100;

  // Color cues for mode
  const modeColor =
    mode === "focus"
      ? "bg-primary text-primary-foreground"
      : "bg-green-500 text-white";

  const progressBarColor =
    mode === "focus"
      ? "bg-primary"
      : "bg-green-500";

  // Disable editing while running
  const inputDisabled = isRunning || secondsLeft !== (mode === "focus" ? focusMinutes * 60 : breakMinutes * 60);

  return (
    <Card className="max-w-sm mx-auto shadow-lg w-full">
      <CardHeader>
        <CardTitle>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${modeColor}`}
            aria-label={mode === "focus" ? "Focus mode" : "Break mode"}
          >
            {mode === "focus" ? "Focus" : "Break"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col items-center gap-2 mb-4"
          onSubmit={e => e.preventDefault()}
        >
          <div className="flex gap-2 w-full">
            <div className="flex flex-col items-center flex-1">
              <label htmlFor="focus-minutes" className="text-xs text-muted-foreground mb-1">
                Focus (min)
              </label>
              <Input
                id="focus-minutes"
                type="number"
                min={1}
                max={120}
                value={focusMinutes}
                onChange={e => setFocusMinutes(Math.max(1, Math.min(120, Number(e.target.value))))}
                disabled={!inputDisabled || mode !== "focus"}
                className="w-16 text-center"
              />
            </div>
            <div className="flex flex-col items-center flex-1">
              <label htmlFor="break-minutes" className="text-xs text-muted-foreground mb-1">
                Break (min)
              </label>
              <Input
                id="break-minutes"
                type="number"
                min={1}
                max={60}
                value={breakMinutes}
                onChange={e => setBreakMinutes(Math.max(1, Math.min(60, Number(e.target.value))))}
                disabled={!inputDisabled || mode !== "break"}
                className="w-16 text-center"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStandardTimes}
            disabled={!inputDisabled}
            className="mt-1"
          >
            Reset to Standard
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-4 w-full">
          <span
            className="text-6xl font-mono font-bold tracking-widest"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(secondsLeft)}
          </span>
          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${progressPercent}%` }}
              aria-label="Progress bar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleStart} disabled={isRunning || secondsLeft === 0} aria-label="Start timer">
              Start
            </Button>
            <Button variant="secondary" onClick={handlePause} disabled={!isRunning} aria-label="Pause timer">
              Pause
            </Button>
            <Button variant="destructive" onClick={handleReset} aria-label="Reset timer">
              Reset
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            {secondsLeft === 0 && (
              <Button variant="outline" onClick={handleSwitchSession} aria-label="Switch session">
                {mode === "focus" ? "Start Break" : "Start Focus"}
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {secondsLeft === 0
              ? mode === "focus"
                ? "Pomodoro finished! Start your break."
                : "Break finished! Start your next focus session."
              : isRunning
              ? mode === "focus"
                ? "Stay focused!"
                : "Enjoy your break!"
              : mode === "focus"
              ? "Ready to start your Pomodoro?"
              : "Ready to start your break?"}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Pomodoros completed: <span className="font-semibold">{pomodoroCount}</span>
          </div>
          {notificationPermission === "denied" && (
            <div className="text-xs text-red-500 mt-2">
              Notifications are blocked. Enable them in your browser for alerts.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;