import { MadeWithDyad } from "@/components/made-with-dyad";
import PomodoroTimer from "@/components/PomodoroTimer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <PomodoroTimer />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;