import { MadeWithDyad } from "@/components/made-with-dyad";
import PomodoroTimer from "@/components/PomodoroTimer";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <PomodoroTimer />
        <MusicPlayer />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;