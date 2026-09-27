import React, { useState } from 'react';
import { Sparkles, RefreshCw, PenLine } from 'lucide-react';

const PROMPTS = [
  'What is one small, quiet moment from today that made you feel peaceful?',
  'What is something you struggled with recently, and what did you learn from it?',
  'If you could send a gentle note of reassurance to yourself this morning, what would it say?',
  'Who or what brought an unexpected smile to your face today?',
  'What is a thought or feeling that you have been holding onto that you can safely release here?',
  'Describe the sights, sounds, and scents around you right now.',
];

interface DailyPromptProps {
  onUsePrompt: (promptText: string) => void;
}

export const DailyPrompt: React.FC<DailyPromptProps> = ({ onUsePrompt }) => {
  const [promptIndex, setPromptIndex] = useState(0);

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
  };

  const currentPrompt = PROMPTS[promptIndex];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-darkbg-card dark:via-darkbg-card dark:to-amber-950/20 border border-amber-200/60 dark:border-darkbg-border shadow-soft relative overflow-hidden group">
      {/* Decorative subtle background icon */}
      <div className="absolute right-4 bottom-2 text-amber-200/30 dark:text-amber-900/20 text-7xl select-none pointer-events-none font-serif">
        ”
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Reflection Prompt</span>
          </div>
          <p className="font-serif text-lg text-cozy-900 dark:text-gray-100 italic leading-relaxed">
            "{currentPrompt}"
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleNextPrompt}
            className="p-2.5 rounded-xl border border-cozy-200 dark:border-darkbg-border hover:bg-white dark:hover:bg-darkbg text-cozy-600 dark:text-gray-400 transition-all hover:rotate-180 duration-300"
            title="Get another prompt"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUsePrompt(currentPrompt)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cozy-900 hover:bg-cozy-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-cozy-950 text-xs font-semibold shadow-sm hover:shadow transition-all"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write about this</span>
          </button>
        </div>
      </div>
    </div>
  );
};
