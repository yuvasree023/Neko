import React from 'react';
import { Flame, FileText, Feather, Heart } from 'lucide-react';

interface StreakSummaryProps {
  stats: {
    totalEntries: number;
    totalWords: number;
    streak: number;
    avgWordsPerEntry: number;
  };
}

export const StreakSummary: React.FC<StreakSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Streak */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-darkbg-card border border-cozy-200/60 dark:border-darkbg-border shadow-soft flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Flame className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="text-xl font-bold text-cozy-950 dark:text-white leading-none">
            {stats.streak} {stats.streak === 1 ? 'day' : 'days'}
          </div>
          <div className="text-xs text-cozy-500 dark:text-gray-400 font-medium mt-1">
            Writing streak
          </div>
        </div>
      </div>

      {/* Total Entries */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-darkbg-card border border-cozy-200/60 dark:border-darkbg-border shadow-soft flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-cozy-950 dark:text-white leading-none">
            {stats.totalEntries}
          </div>
          <div className="text-xs text-cozy-500 dark:text-gray-400 font-medium mt-1">
            Total entries
          </div>
        </div>
      </div>

      {/* Words Written */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-darkbg-card border border-cozy-200/60 dark:border-darkbg-border shadow-soft flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Feather className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xl font-bold text-cozy-950 dark:text-white leading-none">
            {stats.totalWords.toLocaleString()}
          </div>
          <div className="text-xs text-cozy-500 dark:text-gray-400 font-medium mt-1">
            Words written
          </div>
        </div>
      </div>

      {/* Companion Mood */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-darkbg-card border border-cozy-200/60 dark:border-darkbg-border shadow-soft flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="text-xl font-bold text-cozy-950 dark:text-white leading-none">
            Happy 🐾
          </div>
          <div className="text-xs text-cozy-500 dark:text-gray-400 font-medium mt-1">
            Momo's state
          </div>
        </div>
      </div>
    </div>
  );
};
