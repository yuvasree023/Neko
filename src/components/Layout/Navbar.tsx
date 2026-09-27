import React from 'react';
import { BookOpen, PenTool, Sparkles, Settings as SettingsIcon, LogOut, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCharacter } from '../../character/CharacterContext';

interface NavbarProps {
  activeTab: 'home' | 'editor' | 'entries' | 'settings';
  setActiveTab: (tab: 'home' | 'editor' | 'entries' | 'settings') => void;
  onOpenGemini: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGemini,
}) => {
  const { user, logout, isDemoMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { state, emotion } = useCharacter();

  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'editor', label: 'Journal', icon: PenTool },
    { id: 'entries', label: 'Entries', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-cozy-200/60 dark:border-darkbg-border cozy-glass transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-momo-peach to-momo-blush flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-lg">🐾</span>
          </div>
          <div>
            <span className="font-serif font-semibold text-lg tracking-tight text-cozy-950 dark:text-gray-100">
              Momo
            </span>
            <span className="text-xs ml-1.5 font-medium px-2 py-0.5 rounded-full bg-cozy-100 dark:bg-darkbg-card text-cozy-600 dark:text-gray-400 border border-cozy-200 dark:border-darkbg-border">
              journal
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden sm:flex items-center gap-1 bg-cozy-100/70 dark:bg-darkbg-card p-1 rounded-2xl border border-cozy-200/60 dark:border-darkbg-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-darkbg shadow-sm text-cozy-950 dark:text-white'
                    : 'text-cozy-600 dark:text-gray-400 hover:text-cozy-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Talk to Gemini CTA */}
          <button
            onClick={onOpenGemini}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-950/40 dark:to-rose-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/70 dark:border-amber-800/40 hover:shadow-sm hover:scale-[1.02] transition-all"
            title="Open Gemini AI Companion"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden md:inline">Ask Gemini</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-cozy-600 dark:text-gray-400 hover:bg-cozy-100 dark:hover:bg-darkbg-card transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Badge */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-cozy-200 dark:border-darkbg-border">
              <div 
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cozy-100 dark:bg-darkbg-card border border-cozy-200/60 dark:border-darkbg-border cursor-pointer hover:bg-cozy-200/50 transition-colors"
                title={`Logged in as ${user.displayName || user.email}`}
              >
                <div className="w-5 h-5 rounded-full bg-momo-peach/50 flex items-center justify-center text-xs font-bold text-cozy-900">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-cozy-800 dark:text-gray-300 max-w-[80px] truncate">
                  {user.displayName || 'Alex'}
                </span>
                {isDemoMode && (
                  <span className="text-[10px] bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                    Demo
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden flex items-center justify-around border-t border-cozy-200 dark:border-darkbg-border bg-white/90 dark:bg-darkbg-card/90 py-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium py-1 px-3 rounded-lg ${
                isActive
                  ? 'text-cozy-950 dark:text-white font-semibold'
                  : 'text-cozy-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
