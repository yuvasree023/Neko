import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Bot, User, Trash2 } from 'lucide-react';
import { GeminiMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCharacter } from '../../character/CharacterContext';
import { askGeminiAssistant } from '../../services/api';

interface GeminiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentJournalText?: string;
}

const QUICK_PROMPTS = [
  'I had a terrible day.',
  'Help me organize my thoughts.',
  "I don't know what I'm feeling.",
  "Summarize today's reflection.",
];

export const GeminiAssistantDrawer: React.FC<GeminiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentJournalText = '',
}) => {
  const { user, idToken } = useAuth();
  const { triggerReaction, setZone, setMovementMode, setTargetPosition } = useCharacter();

  const [messages, setMessages] = useState<GeminiMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there. I'm here if you'd like to talk through your thoughts, find clarity, or just share how your day went. How are you feeling right now?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Position Momo near drawer when opened
  useEffect(() => {
    if (isOpen) {
      setZone('GEMINI_PANEL');
      // Position Momo near bottom left of drawer
      setTargetPosition({
        x: Math.max(60, window.innerWidth - 440),
        y: Math.min(window.innerHeight - 160, 480),
      });
      triggerReaction({
        emotion: 'curious',
        action: 'think',
        sound: 'hmm?',
        intensity: 0.5,
      });
    }
  }, [isOpen, setZone, setTargetPosition, triggerReaction]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: GeminiMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const response = await askGeminiAssistant({
        journalText: currentJournalText,
        userPrompt: textToSend,
        conversationHistory: messages,
        idToken: idToken || undefined,
        userId: user?.uid,
      });

      const assistantMessage: GeminiMessage = {
        id: 'model-' + Date.now(),
        role: 'model',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reaction: response.character,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Sync character with response
      if (response.character) {
        triggerReaction(response.character);
      }
    } catch (error) {
      console.error('Gemini error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: 'model-err-' + Date.now(),
          role: 'model',
          text: "Momo's little brain got a bit tired! Please try sending your thought again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      triggerReaction({
        emotion: 'tired',
        action: 'sit',
        sound: 'uh-oh...',
        intensity: 0.4,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        role: 'model',
        text: "Clean slate! What would you like to reflect on?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white dark:bg-darkbg-card border-l border-cozy-200 dark:border-darkbg-border shadow-cozy flex flex-col animate-slide-left">
      
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-cozy-100 dark:border-darkbg-border flex items-center justify-between bg-cozy-50/70 dark:bg-darkbg/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-sm text-cozy-950 dark:text-white">
              Gemini Companion
            </h3>
            <p className="text-[11px] text-cozy-500 dark:text-gray-400 font-light">
              Gentle reflection & thought partner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-cozy-400 hover:text-cozy-700 dark:hover:text-gray-200 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cozy-400 hover:text-cozy-700 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cozy-900 dark:bg-white text-white dark:text-cozy-950 rounded-br-none'
                    : 'bg-cozy-100/80 dark:bg-darkbg text-cozy-900 dark:text-gray-200 border border-cozy-200/50 dark:border-darkbg-border rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-cozy-400 dark:text-gray-500 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cozy-500 dark:text-gray-400 italic">
            <span className="animate-spin text-sm">✨</span>
            <span>Momo & Gemini are thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-cozy-100 dark:border-darkbg-border bg-cozy-50/30 dark:bg-darkbg/30">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-darkbg border border-cozy-200 dark:border-darkbg-border text-cozy-700 dark:text-gray-300 hover:bg-cozy-100 dark:hover:bg-darkbg-hover whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-cozy-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a reflection or question…"
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-cozy-50 dark:bg-darkbg border border-cozy-200 dark:border-darkbg-border text-cozy-900 dark:text-gray-100 placeholder:text-cozy-400 dark:placeholder:text-gray-500 outline-none focus:border-cozy-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-xl bg-cozy-900 hover:bg-cozy-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-cozy-950 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
