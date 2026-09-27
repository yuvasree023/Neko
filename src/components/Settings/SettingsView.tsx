import React from 'react';
import {
  User,
  Palette,
  Bot,
  Sliders,
  Shield,
  LogOut,
  Sparkles,
  Heart,
  Volume2,
  Eye,
  Activity,
  Download,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useCharacter } from '../../character/CharacterContext';
import { JournalEntry } from '../../types';

interface SettingsViewProps {
  entries: JournalEntry[];
  onOpenAuth: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  entries,
  onOpenAuth,
}) => {
  const { user, logout, isDemoMode, loginAsDemo } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { triggerSpeech, setEmotion, setState } = useCharacter();

  const handleExportJournal = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `momo-journal-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerSpeech('Saved!', 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-cozy-950 dark:text-white">
          Settings & Preferences
        </h2>
        <p className="text-sm text-cozy-600 dark:text-gray-400 font-light">
          Customize Momo's behavior, appearance, and manage your private account.
        </p>
      </div>

      {/* Account Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cozy-200/80 dark:border-darkbg-border shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-cozy-900 dark:text-gray-100">
          <User className="w-4 h-4 text-cozy-600 dark:text-gray-400" />
          <span>Account & Profile</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-momo-peach/40 text-cozy-950 flex items-center justify-center font-bold text-lg">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="font-semibold text-cozy-950 dark:text-white">
                {user?.displayName || 'Journaler'}
              </div>
              <div className="text-xs text-cozy-500 dark:text-gray-400">
                {user?.email || 'Guest user'}
              </div>
              {isDemoMode && (
                <span className="inline-block mt-1 text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md font-medium">
                  Instant Demo Mode (Local Isolation)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDemoMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginAsDemo('Taylor')}
                  className="px-3 py-1.5 rounded-xl bg-cozy-100 dark:bg-darkbg text-cozy-700 dark:text-gray-300 text-xs font-medium hover:bg-cozy-200"
                >
                  Switch User (Taylor)
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-xl bg-cozy-900 text-white dark:bg-white dark:text-cozy-950 text-xs font-semibold hover:opacity-90"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Momo Companion Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cozy-200/80 dark:border-darkbg-border shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-cozy-900 dark:text-gray-100">
            <span className="text-base">🐾</span>
            <span>Momo Companion Controls</span>
          </div>
          <button
            onClick={() => {
              setEmotion('excited');
              setState('CELEBRATING');
              triggerSpeech('yayyy!', 2500);
            }}
            className="text-xs text-momo-peach dark:text-amber-300 font-semibold hover:underline"
          >
            Test Reaction
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Companion Mode Selection */}
          <div className="p-4 rounded-2xl bg-cozy-50 dark:bg-darkbg border border-cozy-200/60 dark:border-darkbg-border space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-cozy-800 dark:text-gray-200">
              Companion Presence
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'full', label: 'Full Companion', desc: 'Roams & interacts freely' },
                { id: 'minimal', label: 'Minimal Companion', desc: 'Cozy bottom-right perch' },
                { id: 'hidden', label: 'Hide Companion', desc: 'Off' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => updateSettings({ companionMode: mode.id as any })}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    settings.companionMode === mode.id
                      ? 'bg-white dark:bg-darkbg-card border-cozy-900 dark:border-white shadow-sm'
                      : 'border-transparent text-cozy-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-darkbg-card'
                  }`}
                >
                  <div className="text-xs font-bold text-cozy-950 dark:text-white">
                    {mode.label}
                  </div>
                  <div className="text-[10px] text-cozy-500 dark:text-gray-400 mt-0.5">
                    {mode.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="p-4 rounded-2xl bg-cozy-50 dark:bg-darkbg border border-cozy-200/60 dark:border-darkbg-border flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-cozy-800 dark:text-gray-200">
                Companion Size
              </div>
              <div className="text-[11px] text-cozy-500 dark:text-gray-400">
                Scale Momo on your screen
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-darkbg-card p-1 rounded-xl border border-cozy-200 dark:border-darkbg-border">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateSettings({ companionSize: s })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase ${
                    settings.companionSize === s
                      ? 'bg-cozy-900 text-white dark:bg-white dark:text-cozy-950'
                      : 'text-cozy-600 dark:text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Cursor Following Toggle */}
          <div className="p-4 rounded-2xl bg-cozy-50 dark:bg-darkbg border border-cozy-200/60 dark:border-darkbg-border flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-cozy-800 dark:text-gray-200">
                Follow Cursor Naturally
              </div>
              <div className="text-[11px] text-cozy-500 dark:text-gray-400">
                Follows mouse with soft inertia
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.followCursor}
              onChange={(e) => updateSettings({ followCursor: e.target.checked })}
              className="w-4 h-4 accent-cozy-900 rounded cursor-pointer"
            />
          </div>

          {/* Idle Animations Toggle */}
          <div className="p-4 rounded-2xl bg-cozy-50 dark:bg-darkbg border border-cozy-200/60 dark:border-darkbg-border flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-cozy-800 dark:text-gray-200">
                Idle Animation Stages
              </div>
              <div className="text-[11px] text-cozy-500 dark:text-gray-400">
                Look around → sit → lie down → sleep
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.idleAnimations}
              onChange={(e) => updateSettings({ idleAnimations: e.target.checked })}
              className="w-4 h-4 accent-cozy-900 rounded cursor-pointer"
            />
          </div>

          {/* Text/Speech Bubbles Toggle */}
          <div className="p-4 rounded-2xl bg-cozy-50 dark:bg-darkbg border border-cozy-200/60 dark:border-darkbg-border flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-cozy-800 dark:text-gray-200">
                Speech Bubbles ("yay!", "hmm...")
              </div>
              <div className="text-[11px] text-cozy-500 dark:text-gray-400">
                Short 1–4 word reactive speech bubbles
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.textReactions}
              onChange={(e) => updateSettings({ textReactions: e.target.checked })}
              className="w-4 h-4 accent-cozy-900 rounded cursor-pointer"
            />
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-4 rounded-2xl bg-cozy-50 dark:bg-darkbg border border-cozy-200/60 dark:border-darkbg-border flex items-center justify-between sm:col-span-2">
            <div>
              <div className="text-xs font-semibold text-cozy-800 dark:text-gray-200">
                Reduced Motion (Accessibility)
              </div>
              <div className="text-[11px] text-cozy-500 dark:text-gray-400">
                Disables rapid walking translations and keeps Momo gently anchored
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-cozy-900 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cozy-200/80 dark:border-darkbg-border shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-cozy-900 dark:text-gray-100">
          <Palette className="w-4 h-4 text-cozy-600 dark:text-gray-400" />
          <span>Appearance</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'bg-cozy-50 border-cozy-900 shadow-sm'
                : 'border-cozy-200 hover:bg-cozy-50/50'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              ☀️
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-cozy-950">Warm Light Mode</div>
              <div className="text-[10px] text-cozy-500">Soft cream paper feel</div>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-darkbg border-white shadow-sm'
                : 'border-darkbg-border hover:bg-darkbg/50'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-300 flex items-center justify-center font-bold">
              🌙
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Cozy Charcoal Dark</div>
              <div className="text-[10px] text-gray-400">Gentle on evening eyes</div>
            </div>
          </button>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cozy-200/80 dark:border-darkbg-border shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-cozy-900 dark:text-gray-100">
          <Shield className="w-4 h-4 text-cozy-600 dark:text-gray-400" />
          <span>Privacy & Journal Data</span>
        </div>

        <p className="text-xs text-cozy-600 dark:text-gray-400 leading-relaxed font-light">
          Your entries are strictly isolated under your authenticated UID boundary. No data is shared with third parties or used for model training without consent.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJournal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Journal Backup (JSON)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
