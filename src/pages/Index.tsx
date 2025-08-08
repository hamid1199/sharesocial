import { MadeWithDyad } from "@/components/made-with-dyad";
import PomodoroTimer from "@/components/PomodoroTimer";
import MusicPlayer from "@/components/MusicPlayer";
import PomodoroTypeSelector, { POMODORO_TYPES, PomodoroType } from "@/components/PomodoroTypeSelector";
import React, { useState } from "react";

const Index = () => {
  const [selectedType, setSelectedType] = useState<PomodoroType>(POMODORO_TYPES[0]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <PomodoroTypeSelector
          selectedId={selectedType.id}
          onSelect={setSelectedType}
        />
        <PomodoroTimer pomodoroType={selectedType} />
        <MusicPlayer />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;