import React from 'react';
import { X, Calendar, FileText, Edit3, Trash2, Tag, Sparkles } from 'lucide-react';
import { JournalEntry } from '../../types';

interface EntryModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({
  entry,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!entry) return null;

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl max-h-[88vh] bg-white dark:bg-darkbg-card rounded-3xl border border-cozy-200 dark:border-darkbg-border shadow-cozy flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-cozy-100 dark:border-darkbg-border flex items-center justify-between bg-cozy-50/50 dark:bg-darkbg/40">
          <div className="flex items-center gap-2 text-xs text-cozy-500 dark:text-gray-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(entry);
              }}
              className="p-2 rounded-xl text-cozy-600 hover:text-cozy-900 hover:bg-cozy-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-darkbg-hover transition-colors"
              title="Edit Entry"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onDelete(entry.id);
                onClose();
              }}
              className="p-2 rounded-xl text-cozy-400 hover:text-rose-600 hover:bg-rose-50 dark:text-gray-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
              title="Delete Entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-cozy-400 hover:text-cozy-700 hover:bg-cozy-100 dark:hover:bg-darkbg-hover dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 journal-paper">
          
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-cozy-950 dark:text-white">
            {entry.title || 'Untitled Journal'}
          </h2>

          {/* Character Reaction Highlight from this session */}
          {entry.characterReaction && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🐾</span>
                <span className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                  Momo felt <span className="font-semibold capitalize">{entry.characterReaction.emotion}</span> with you
                </span>
              </div>
              {entry.characterReaction.sound && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  "{entry.characterReaction.sound}"
                </span>
              )}
            </div>
          )}

          {/* Content */}
          <div className="text-cozy-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap font-sans font-light">
            {entry.content}
          </div>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="pt-4 border-t border-cozy-100 dark:border-darkbg-border flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cozy-100 dark:bg-darkbg text-cozy-700 dark:text-gray-300 border border-cozy-200 dark:border-darkbg-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cozy-100 dark:border-darkbg-border bg-cozy-50/30 dark:bg-darkbg/30 flex items-center justify-between text-xs text-cozy-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {entry.wordCount || 0} words
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
