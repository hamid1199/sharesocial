import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

type Props = {
  selectedId: string;
  onSelect: (type: PomodoroType) => void;
};

const PomodoroTypeSelector: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div className="w-full mb-6">
      <h2 className="text-lg font-bold mb-2 text-center">Choose a Pomodoro Type</h2>
      <div className="grid gap-4">
        {POMODORO_TYPES.map((type) => (
          <Card
            key={type.id}
            className={`transition-all border-2 ${
              selectedId === type.id
                ? "border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900"
                : "border-transparent hover:border-blue-300"
            }`}
          >
            <CardHeader className="flex flex-row items-center gap-3 py-2 px-4">
              <span className="text-2xl">{type.emoji}</span>
              <CardTitle className="text-base">{type.name}</CardTitle>
              <Button
                size="sm"
                variant={selectedId === type.id ? "default" : "outline"}
                className="ml-auto"
                onClick={() => onSelect(type)}
                aria-label={`Select ${type.name}`}
              >
                {selectedId === type.id ? "Selected" : "Select"}
              </Button>
            </CardHeader>
            <CardContent className="pt-0 pb-3 px-4">
              <div className="text-sm text-gray-700 dark:text-gray-200 mb-1">{type.description}</div>
              <ul className="text-xs space-y-1">
                <li>
                  <span className="text-green-600 dark:text-green-400 font-medium">✔️</span>{" "}
                  <span>{type.pros}</span>
                </li>
                <li>
                  <span className="text-red-500 font-medium">✖️</span>{" "}
                  <span>{type.cons}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PomodoroTypeSelector;