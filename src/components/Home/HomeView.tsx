import React from 'react';
import { PlusCircle, ArrowRight, BookOpen, PenTool } from 'lucide-react';
import { JournalEntry } from '../../types';
import { GreetingHeader } from './GreetingHeader';
import { StreakSummary } from './StreakSummary';
import { DailyPrompt } from './DailyPrompt';
import { EntryCard } from '../Journal/EntryCard';

interface HomeViewProps {
  entries: JournalEntry[];
  stats: {
    totalEntries: number;
    totalWords: number;
    streak: number;
    avgWordsPerEntry: number;
  };
  onNewEntry: () => void;
  onUsePrompt: (prompt: string) => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onViewAllEntries: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  entries,
  stats,
  onNewEntry,
  onUsePrompt,
  onSelectEntry,
  onEditEntry,
  onDeleteEntry,
  onViewAllEntries,
}) => {
  const recentEntries = entries.slice(0, 4);

  return (
    <div
      data-momo-zone="home"
      className="max-w-5xl mx-auto space-y-7 pb-20"
    >
      {/* Top Greeting & New Entry CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <GreetingHeader />

        <button
          onClick={onNewEntry}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cozy-950 hover:bg-cozy-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-cozy-950 text-sm font-semibold shadow-soft-lg hover:shadow-cozy hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto"
        >
          <PenTool className="w-4 h-4" />
          <span>Write Journal</span>
        </button>
      </div>

      {/* Streak & Stats */}
      <StreakSummary stats={stats} />

      {/* Daily Prompt */}
      <DailyPrompt onUsePrompt={onUsePrompt} />

      {/* Recent Reflections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-semibold text-cozy-950 dark:text-white">
              Recent Reflections
            </h2>
            <p className="text-xs text-cozy-500 dark:text-gray-400 font-light">
              Your latest journal thoughts & Momo's reactions
            </p>
          </div>

          {entries.length > 0 && (
            <button
              onClick={onViewAllEntries}
              className="text-xs font-semibold text-cozy-700 dark:text-gray-300 hover:text-cozy-950 dark:hover:text-white flex items-center gap-1 transition-colors group"
            >
              <span>View all ({entries.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onSelect={onSelectEntry}
                onEdit={onEditEntry}
                onDelete={onDeleteEntry}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl bg-white/70 dark:bg-darkbg-card/50 border border-dashed border-cozy-200 dark:border-darkbg-border space-y-3">
            <span className="text-3xl">📖</span>
            <div className="font-serif text-base text-cozy-900 dark:text-gray-100 font-medium">
              No journal entries yet
            </div>
            <p className="text-xs text-cozy-500 dark:text-gray-400 max-w-sm mx-auto">
              Start by writing your first journal entry. Momo will be right there with you!
            </p>
            <button
              onClick={onNewEntry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cozy-900 text-white dark:bg-white dark:text-cozy-950 text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Begin Journaling</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
