import { MadeWithDyad } from "@/components/made-with-dyad";
import PomodoroTimer from "@/components/PomodoroTimer";
import MusicPlayer from "@/components/MusicPlayer";
import React, { useState } from "react";
import PomodoroTypeSelector from "@/components/PomodoroTypeSelector";
import { useAuth } from "@/components/AuthProvider";
import AuthForm from "@/components/AuthForm";
import SignOutButton from "@/components/SignOutButton";
import ProfileButton from "@/components/ProfileButton";

// Pomodoro types data
export type PomodoroType = {
  id: string;
  emoji: string;
  name: string;
  focus: number;
  break: number;
  longBreak?: number;
  cyclesBeforeLongBreak?: number;
  description: string;
  pros: string;
  cons: string;
};

export const POMODORO_TYPES: PomodoroType[] = [
  {
    id: "classic",
    emoji: "🟥",
    name: "Classic Pomodoro (25/5)",
    focus: 25,
    break: 5,
    longBreak: 15,
    cyclesBeforeLongBreak: 4,
    description: "25 minutes of fully focused study, 5 minutes of short break. After 4 Pomodoros, take a longer break (15–30 minutes).",
    pros: "Great for most people, especially beginners",
    cons: "Might not be enough for deep-focus tasks",
  },
  {
    id: "long",
    emoji: "🟨",
    name: "Long Pomodoro (50/10)",
    focus: 50,
    break: 10,
    longBreak: 20,
    cyclesBeforeLongBreak: 2,
    description: "50 minutes of focused study, 10 minutes of break.",
    pros: "Ideal for those who can concentrate for longer periods",
    cons: "Can be hard for those new to time management",
  },
  {
    id: "short",
    emoji: "🟩",
    name: "Short Pomodoro (15/5 or 20/5)",
    focus: 15,
    break: 5,
    longBreak: 10,
    cyclesBeforeLongBreak: 4,
    description: "15 to 20 minutes of study, 5 minutes of break.",
    pros: "Perfect for people with short attention spans or beginners",
    cons: "May not be enough for deep work",
  },
  {
    id: "flexible",
    emoji: "🟦",
    name: "Flexible Pomodoro",
    focus: 30,
    break: 10,
    longBreak: 15,
    cyclesBeforeLongBreak: 3,
    description: "Set your focus time based on your energy and task (e.g., 30 or 45 minutes). Adjust breaks accordingly (5 to 15 minutes).",
    pros: "Great for experienced users who know their rhythms",
    cons: "Requires self-discipline and awareness",
  },
  {
    id: "double",
    emoji: "🟪",
    name: "Double Pomodoro (2x25/10)",
    focus: 25,
    break: 0,
    longBreak: 10,
    cyclesBeforeLongBreak: 2,
    description: "Two Pomodoros back-to-back (2 × 25 minutes), then take a 10-minute break.",
    pros: "Helps maintain longer focus sessions, great for math or coding",
    cons: "Can be tiring without shorter breaks in between",
  },
  {
    id: "reverse",
    emoji: "🟫",
    name: "Reverse Pomodoro",
    focus: 5,
    break: 25,
    longBreak: 25,
    cyclesBeforeLongBreak: 1,
    description: "5 minutes of work + 25 minutes of rest. Designed to overcome procrastination or mental resistance.",
    pros: "Useful for getting started when motivation is low",
    cons: "Limited use — mainly for kickstarting tasks",
  },
];

const Index = () => {
  const { user, loading } = useAuth();
  const [selectedType, setSelectedType] = useState<PomodoroType | null>(null);

  // Back to type selection
  const handleBack = () => setSelectedType(null);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2">
        <AuthForm />
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2 relative">
      <ProfileButton />
      <SignOutButton />
      <div className="w-full max-w-2xl">
        {!selectedType ? (
          <PomodoroTypeSelector
            selectedId={null}
            onSelect={setSelectedType}
            types={POMODORO_TYPES}
          />
        ) : (
          <div className="w-full flex flex-col items-center">
            <button
              onClick={handleBack}
              className="mb-4 self-start px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors"
              aria-label="Back to type selection"
            >
              ← Back
            </button>
            <PomodoroTimer pomodoroType={selectedType} />
            <div className="mt-6 w-full">
              <MusicPlayer />
            </div>
          </div>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;