import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save,
  Sparkles,
  Tag,
  Clock,
  FileText,
  Bold,
  Italic,
  List,
  Quote,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JournalEntry, CharacterEmotion } from '../../types';
import { useCharacter } from '../../character/CharacterContext';
import { useAuth } from '../../context/AuthContext';
import { getLiveTextReaction } from '../../services/api';

interface JournalEditorProps {
  initialEntry?: JournalEntry | null;
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }) => void;
  onOpenGemini: () => void;
  initialPrompt?: string;
}

const DRAFT_KEY_PREFIX = 'momo_journal_draft_';

export const JournalEditor: React.FC<JournalEditorProps> = ({
  initialEntry,
  onSave,
  onOpenGemini,
  initialPrompt,
}) => {
  const { user, idToken } = useAuth();
  const { triggerReaction, celebrate, setZone, setMovementMode, setTargetPosition } = useCharacter();

  const [title, setTitle] = useState(initialEntry?.title || '');
  const [content, setContent] = useState(initialEntry?.content || initialPrompt ? `Prompt: ${initialPrompt}\n\n` : '');
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || ['reflection']);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<CharacterEmotion>('neutral');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveBtnRef = useRef<HTMLButtonElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set character zone to editor
  useEffect(() => {
    setZone('JOURNAL_EDITOR');
    setMovementMode('FOLLOW_CURSOR');
  }, [setZone, setMovementMode]);

  // Load draft from local storage if no initialEntry
  useEffect(() => {
    if (!initialEntry && user?.uid) {
      const draftKey = DRAFT_KEY_PREFIX + user.uid;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.content || parsed.title) {
            setTitle(parsed.title || '');
            setContent(parsed.content || '');
            if (parsed.tags) setTags(parsed.tags);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, [initialEntry, user?.uid]);

  // Handle live word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Real-time subtle typing reaction (throttled)
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);

    // Auto-save draft locally
    if (user?.uid && !initialEntry) {
      localStorage.setItem(
        DRAFT_KEY_PREFIX + user.uid,
        JSON.stringify({ title, content: newText, tags, updatedAt: new Date().toISOString() })
      );
    }

    // Debounced lightweight reaction
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(async () => {
      if (newText.length > 25) {
        const reaction = await getLiveTextReaction({
          journalText: newText.slice(-300),
          idToken: idToken || undefined,
          userId: user?.uid,
        });

        if (reaction && reaction.emotion) {
          setCurrentMood(reaction.emotion);
          triggerReaction(reaction);
        }
      }
    }, 1500);
  };

  // Add tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (!tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Markdown formatting helpers
  const applyFormat = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);

    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    setContent(before + replacement + after);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  // Save entry
  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);

    // Move Momo toward Save button & celebrate
    if (saveBtnRef.current) {
      const rect = saveBtnRef.current.getBoundingClientRect();
      setTargetPosition({ x: rect.left - 50, y: rect.top - 20 });
    }

    try {
      await onSave({
        id: initialEntry?.id,
        title: title.trim() || 'Untitled Journal',
        content,
        wordCount,
        tags,
        moodHint: currentMood,
        characterState: 'CELEBRATING',
      });

      // Clear draft
      if (user?.uid && !initialEntry) {
        localStorage.removeItem(DRAFT_KEY_PREFIX + user.uid);
      }

      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Trigger Confetti effect
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FFB89E', '#FFAAA6', '#FFECA1', '#D8EEDF'],
      });

      // Trigger Momo Celebration
      celebrate();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      data-momo-zone="journal-editor"
      className="max-w-4xl mx-auto space-y-4 pb-16"
    >
      {/* Editor Card */}
      <div className="bg-white dark:bg-darkbg-card rounded-3xl border border-cozy-200/80 dark:border-darkbg-border shadow-soft relative overflow-hidden transition-all">
        
        {/* Top Action Bar */}
        <div className="px-6 py-3.5 border-b border-cozy-100 dark:border-darkbg-border flex flex-wrap items-center justify-between gap-3 bg-cozy-50/50 dark:bg-darkbg/40">
          
          {/* Formatting Shortcuts */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => applyFormat('**', '**')}
              className="p-1.5 rounded-lg text-cozy-600 dark:text-gray-400 hover:bg-cozy-200/60 dark:hover:bg-darkbg-hover transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('*', '*')}
              className="p-1.5 rounded-lg text-cozy-600 dark:text-gray-400 hover:bg-cozy-200/60 dark:hover:bg-darkbg-hover transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('> ')}
              className="p-1.5 rounded-lg text-cozy-600 dark:text-gray-400 hover:bg-cozy-200/60 dark:hover:bg-darkbg-hover transition-colors"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('- ')}
              className="p-1.5 rounded-lg text-cozy-600 dark:text-gray-400 hover:bg-cozy-200/60 dark:hover:bg-darkbg-hover transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Stats & Gemini Button */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-cozy-500 dark:text-gray-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>

            {lastSavedTime && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Saved {lastSavedTime}
              </span>
            )}

            <button
              onClick={onOpenGemini}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Talk to Gemini</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="p-6 sm:p-8 space-y-4 journal-paper">
          
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of this moment…"
            className="w-full text-2xl sm:text-3xl font-serif font-semibold text-cozy-950 dark:text-white placeholder:text-cozy-300 dark:placeholder:text-gray-600 bg-transparent border-none outline-none focus:ring-0"
          />

          {/* Large Comfortable Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder="Write whatever is on your mind… thoughts, gratitude, worries, or small quiet observations. Momo is here with you."
            rows={14}
            className="w-full text-base sm:text-lg leading-relaxed text-cozy-900 dark:text-gray-200 placeholder:text-cozy-300 dark:placeholder:text-gray-600 bg-transparent border-none outline-none resize-none focus:ring-0 font-sans"
          />

          {/* Tags Bar */}
          <div className="pt-4 border-t border-cozy-100 dark:border-darkbg-border flex flex-wrap items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-cozy-400 dark:text-gray-500" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cozy-100 dark:bg-darkbg text-cozy-700 dark:text-gray-300 border border-cozy-200 dark:border-darkbg-border"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-cozy-400 hover:text-cozy-700 dark:hover:text-white ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag + Enter"
              className="text-xs text-cozy-700 dark:text-gray-300 bg-transparent outline-none placeholder:text-cozy-400 dark:placeholder:text-gray-600 w-28"
            />
          </div>
        </div>

        {/* Bottom Save Footer */}
        <div className="px-6 py-4 border-t border-cozy-100 dark:border-darkbg-border bg-cozy-50/40 dark:bg-darkbg/30 flex items-center justify-between">
          <div className="text-xs text-cozy-500 dark:text-gray-400 italic">
            "Your thoughts are safe, private, and yours alone."
          </div>

          <div className="flex items-center gap-3">
            <button
              ref={saveBtnRef}
              data-momo-zone="save-button"
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-cozy-950 hover:bg-cozy-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-cozy-950 text-sm font-semibold shadow-soft-lg hover:shadow-cozy hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving…' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
