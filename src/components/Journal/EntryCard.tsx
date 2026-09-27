import React from 'react';
import { Calendar, FileText, Trash2, Edit3, Heart } from 'lucide-react';
import { JournalEntry } from '../../types';

interface EntryCardProps {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy':
      case 'excited':
      case 'proud':
        return '✨';
      case 'calm':
      case 'relieved':
        return '🌿';
      case 'sad':
      case 'worried':
        return '🌧️';
      case 'curious':
        return '💡';
      case 'tired':
        return '🌙';
      case 'frustrated':
        return '🔥';
      default:
        return '🐾';
    }
  };

  return (
    <div
      onClick={() => onSelect(entry)}
      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cozy-200/70 dark:border-darkbg-border hover:border-momo-peach/80 dark:hover:border-momo-peach/50 shadow-soft hover:shadow-cozy transition-all duration-300 cursor-pointer group flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-cozy-500 dark:text-gray-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {entry.moodHint && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cozy-100 dark:bg-darkbg text-cozy-700 dark:text-gray-300 border border-cozy-200/60 dark:border-darkbg-border">
                <span>{getMoodEmoji(entry.moodHint)}</span>
                <span className="capitalize">{entry.moodHint}</span>
              </span>
            )}

            {entry.characterReaction?.sound && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900">
                "{entry.characterReaction.sound}"
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-serif font-semibold text-cozy-950 dark:text-gray-100 group-hover:text-cozy-700 dark:group-hover:text-cozy-300 transition-colors line-clamp-1">
          {entry.title || 'Untitled Journal'}
        </h3>

        {/* Snippet */}
        <p className="text-sm text-cozy-600 dark:text-gray-400 font-light line-clamp-3 leading-relaxed">
          {entry.content}
        </p>
      </div>

      {/* Footer Tags & Actions */}
      <div className="pt-4 mt-4 border-t border-cozy-100 dark:border-darkbg-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-cozy-400 dark:text-gray-500 font-medium">
          <FileText className="w-3.5 h-3.5" />
          <span>{entry.wordCount || 0} words</span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className="p-1.5 rounded-lg text-cozy-500 hover:text-cozy-900 hover:bg-cozy-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-darkbg-hover transition-colors"
            title="Edit Entry"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className="p-1.5 rounded-lg text-cozy-400 hover:text-rose-600 hover:bg-rose-50 dark:text-gray-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
