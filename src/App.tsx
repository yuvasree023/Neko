import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { HomeView } from './components/Home/HomeView';
import { JournalEditor } from './components/Journal/JournalEditor';
import { EntryList } from './components/Journal/EntryList';
import { EntryModal } from './components/Journal/EntryModal';
import { SettingsView } from './components/Settings/SettingsView';
import { GeminiAssistantDrawer } from './components/Gemini/GeminiAssistantDrawer';
import { AuthModal } from './components/Auth/AuthModal';
import { MomoEngine } from './character/MomoEngine';
import { useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';
import { useCharacter } from './character/CharacterContext';
import {
  fetchUserEntries,
  saveUserEntry,
  deleteUserEntry,
  calculateJournalStats,
} from './services/journalStorage';
import { JournalEntry } from './types';

import { CharacterDebugPanel } from './character/CharacterDebugPanel';

export const App: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { setZone } = useCharacter();

  const [activeTab, setActiveTab] = useState<'home' | 'editor' | 'entries' | 'settings'>('home');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEditingEntry, setActiveEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedViewingEntry, setSelectedViewingEntry] = useState<JournalEntry | null>(null);
  const [initialPromptForEditor, setInitialPromptForEditor] = useState<string | undefined>();
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);

  // Load entries when user changes
  const loadEntries = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoadingEntries(true);
    try {
      const data = await fetchUserEntries(user.uid);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
    } finally {
      setIsLoadingEntries(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Update UI zone when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'home':
        setZone('HOME');
        break;
      case 'editor':
        setZone('JOURNAL_EDITOR');
        break;
      case 'entries':
        setZone('RECENT_ENTRIES');
        break;
      case 'settings':
        setZone('SETTINGS');
        break;
    }
  }, [activeTab, setZone]);

  // Handle saving an entry
  const handleSaveEntry = async (
    entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }
  ) => {
    if (!user?.uid) return;

    const now = new Date().toISOString();
    const entryId = entryData.id || `entry-${Date.now()}`;

    const newEntry: JournalEntry = {
      ...entryData,
      id: entryId,
      userId: user.uid,
      createdAt: entryData.id ? (activeEditingEntry?.createdAt || now) : now,
      updatedAt: now,
    };

    await saveUserEntry(user.uid, newEntry);
    await loadEntries();
    setActiveEditingEntry(null);
    setInitialPromptForEditor(undefined);
  };

  // Handle editing entry
  const handleEditEntry = (entry: JournalEntry) => {
    setActiveEditingEntry(entry);
    setSelectedViewingEntry(null);
    setActiveTab('editor');
  };

  // Handle deleting entry
  const handleDeleteEntry = async (id: string) => {
    if (!user?.uid) return;
    if (window.confirm('Are you sure you want to delete this reflection?')) {
      await deleteUserEntry(user.uid, id);
      await loadEntries();
      if (selectedViewingEntry?.id === id) {
        setSelectedViewingEntry(null);
      }
    }
  };

  // Handle daily prompt click
  const handleUsePrompt = (prompt: string) => {
    setActiveEditingEntry(null);
    setInitialPromptForEditor(prompt);
    setActiveTab('editor');
  };

  // Handle new entry click
  const handleNewEntry = () => {
    setActiveEditingEntry(null);
    setInitialPromptForEditor(undefined);
    setActiveTab('editor');
  };

  const stats = calculateJournalStats(entries);

  return (
    <div className="min-h-screen bg-cozy-50 dark:bg-darkbg text-cozy-950 dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Momo Companion Engine (Rendered Globally across all pages) */}
      <MomoEngine settings={settings} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGemini={() => setIsGeminiOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeView
            entries={entries}
            stats={stats}
            onNewEntry={handleNewEntry}
            onUsePrompt={handleUsePrompt}
            onSelectEntry={(entry) => setSelectedViewingEntry(entry)}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onViewAllEntries={() => setActiveTab('entries')}
          />
        )}

        {activeTab === 'editor' && (
          <JournalEditor
            initialEntry={activeEditingEntry}
            initialPrompt={initialPromptForEditor}
            onSave={handleSaveEntry}
            onOpenGemini={() => setIsGeminiOpen(true)}
          />
        )}

        {activeTab === 'entries' && (
          <EntryList
            entries={entries}
            onSelectEntry={(entry) => setSelectedViewingEntry(entry)}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onNewEntry={handleNewEntry}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            entries={entries}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Entry Viewer / Detail Modal */}
      <EntryModal
        entry={selectedViewingEntry}
        onClose={() => setSelectedViewingEntry(null)}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
      />

      {/* Gemini Conversational Assistant Drawer */}
      <GeminiAssistantDrawer
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        currentJournalText={activeEditingEntry?.content || ''}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Character Debug Panel — dev mode only */}
      {import.meta.env.DEV && <CharacterDebugPanel />}
    </div>
  );
};

export default App;
