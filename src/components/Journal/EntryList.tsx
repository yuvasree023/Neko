import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, PlusCircle, BookOpen } from 'lucide-react';
import { JournalEntry, CharacterEmotion } from '../../types';
import { EntryCard } from './EntryCard';

interface EntryListProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntry: () => void;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  onSelectEntry,
  onEditEntry,
  onDeleteEntry,
  onNewEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        const matchesSearch =
          (entry.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (entry.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesMood =
          selectedMood === 'all' || entry.moodHint === selectedMood;

        return matchesSearch && matchesMood;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [entries, searchQuery, selectedMood, sortOrder]);

  const moods: { id: string; label: string; emoji: string }[] = [
    { id: 'all', label: 'All Moods', emoji: '✨' },
    { id: 'happy', label: 'Happy', emoji: '🌸' },
    { id: 'calm', label: 'Calm', emoji: '🌿' },
    { id: 'excited', label: 'Excited', emoji: '🎉' },
    { id: 'sad', label: 'Reflective', emoji: '🌧️' },
    { id: 'tired', label: 'Tired', emoji: '🌙' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-cozy-950 dark:text-white">
            Past Reflections
          </h2>
          <p className="text-sm text-cozy-600 dark:text-gray-400 font-light">
            Revisit your thoughts and observe your emotional journey.
          </p>
        </div>

        <button
          onClick={onNewEntry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cozy-900 hover:bg-cozy-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-cozy-950 text-xs font-semibold shadow-soft hover:shadow transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cozy-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, thoughts, or #tags…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-darkbg-card border border-cozy-200/80 dark:border-darkbg-border text-sm text-cozy-900 dark:text-gray-100 placeholder:text-cozy-400 dark:placeholder:text-gray-500 outline-none focus:border-cozy-400 shadow-soft"
          />
        </div>

        {/* Mood Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedMood === m.id
                  ? 'bg-cozy-900 dark:bg-white text-white dark:text-cozy-950 shadow-sm'
                  : 'bg-white dark:bg-darkbg-card text-cozy-700 dark:text-gray-300 border border-cozy-200/60 dark:border-darkbg-border hover:bg-cozy-100'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Sort Button */}
        <button
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="p-2.5 rounded-2xl bg-white dark:bg-darkbg-card border border-cozy-200/60 dark:border-darkbg-border text-cozy-600 dark:text-gray-400 hover:bg-cozy-100 text-xs font-medium flex items-center gap-1.5 self-end md:self-auto"
          title="Toggle sort order"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="hidden sm:inline capitalize">{sortOrder}</span>
        </button>
      </div>

      {/* Entry Grid */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredEntries.map((entry) => (
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
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-darkbg-card/40 border border-dashed border-cozy-200 dark:border-darkbg-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-cozy-100 dark:bg-darkbg mx-auto flex items-center justify-center text-xl">
            🐾
          </div>
          <h3 className="font-serif text-lg font-medium text-cozy-950 dark:text-white">
            {searchQuery ? 'No matching entries found' : 'Your journal is peaceful and waiting'}
          </h3>
          <p className="text-sm text-cozy-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try changing your search terms or resetting the mood filters.'
              : 'Write down your first thought or quiet reflection to begin.'}
          </p>
          {!searchQuery && (
            <button
              onClick={onNewEntry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cozy-900 text-white dark:bg-white dark:text-cozy-950 text-xs font-semibold mt-2"
            >
              Write First Entry
            </button>
          )}
        </div>
      )}
    </div>
  );
};
