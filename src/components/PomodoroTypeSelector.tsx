import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PomodoroType } from "./PomodoroTypeSelector";

type Props = {
  selectedId: string | null;
  onSelect: (type: PomodoroType) => void;
  types: PomodoroType[];
};

const PomodoroTypeSelector: React.FC<Props> = ({ selectedId, onSelect, types }) => {
  return (
    <div className="w-full mb-6">
      <h2 className="text-lg font-bold mb-4 text-center">Choose a Pomodoro Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {types.map((type) => (
          <Card
            key={type.id}
            className={`transition-all border-2 flex flex-col h-full ${
              selectedId === type.id
                ? "border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900"
                : "border-transparent hover:border-blue-300"
            }`}
          >
            <CardHeader className="flex flex-row items-center gap-3 py-2 px-4">
              <span className="text-2xl">{type.emoji}</span>
              <CardTitle className="text-base">{type.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 pt-0 pb-3 px-4">
              <div className="text-sm text-gray-700 dark:text-gray-200 mb-1">{type.description}</div>
              <ul className="text-xs space-y-1 mb-2">
                <li>
                  <span className="text-green-600 dark:text-green-400 font-medium">✔️</span>{" "}
                  <span>{type.pros}</span>
                </li>
                <li>
                  <span className="text-red-500 font-medium">✖️</span>{" "}
                  <span>{type.cons}</span>
                </li>
              </ul>
              <Button
                size="sm"
                variant={selectedId === type.id ? "default" : "outline"}
                className="mt-auto"
                onClick={() => onSelect(type)}
                aria-label={`Select ${type.name}`}
                tabIndex={0}
              >
                {selectedId === type.id ? "Selected" : "Select"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PomodoroTypeSelector;