import React, { useState } from 'react';
import { useCharacter } from './CharacterContext';
import { CharacterState, CharacterEmotion } from '../types';

export const CharacterDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    state,
    emotion,
    bubbleText,
    currentZone,
    movementMode,
    targetPosition,
    facing,
    currentPriority,
    setState,
    setEmotion,
    triggerSpeech,
    celebrate,
    hideInBox,
    becomeDracula,
    wakeUp,
    restAtHome,
  } = useCharacter();

  const handleStateClick = (s: CharacterState, e: CharacterEmotion = 'neutral', sound?: string) => {
    setEmotion(e);
    setState(s, 'HIGH');
    if (sound) {
      triggerSpeech(sound, 2500);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-auto font-mono text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 rounded-full bg-cozy-900/90 dark:bg-darkbg-card/90 text-white dark:text-gray-200 border border-cozy-700/50 shadow-lg hover:bg-cozy-800 transition-all flex items-center gap-1.5 backdrop-blur-sm"
          title="Open Momo Character Debug Panel"
        >
          <span className="text-sm">🐾</span>
          <span>Cat Debug</span>
        </button>
      ) : (
        <div className="w-80 p-4 rounded-2xl bg-white/95 dark:bg-darkbg-card/95 backdrop-blur-md border border-cozy-200 dark:border-darkbg-border shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-cozy-200 dark:border-darkbg-border pb-2">
            <div className="flex items-center gap-2 font-bold text-cozy-900 dark:text-white">
              <span>🐱 Cat Controller Debug</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cozy-400 hover:text-cozy-700 dark:hover:text-white font-bold px-1.5"
            >
              ✕
            </button>
          </div>

          {/* Live State Inspector */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-cozy-50 dark:bg-darkbg p-2.5 rounded-xl border border-cozy-200/50 dark:border-darkbg-border">
            <div>
              <span className="text-cozy-500 dark:text-gray-400">State: </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{state}</span>
            </div>
            <div>
              <span className="text-cozy-500 dark:text-gray-400">Emotion: </span>
              <span className="font-bold text-pink-600 dark:text-pink-400">{emotion}</span>
            </div>
            <div>
              <span className="text-cozy-500 dark:text-gray-400">Facing: </span>
              <span className="font-semibold text-cozy-800 dark:text-gray-200">{facing}</span>
            </div>
            <div>
              <span className="text-cozy-500 dark:text-gray-400">Priority: </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentPriority}</span>
            </div>
            <div>
              <span className="text-cozy-500 dark:text-gray-400">Zone: </span>
              <span className="font-semibold text-cozy-800 dark:text-gray-200">{currentZone}</span>
            </div>
            <div>
              <span className="text-cozy-500 dark:text-gray-400">Bubble: </span>
              <span className="italic text-cozy-700 dark:text-gray-300 truncate">
                {bubbleText || '—'}
              </span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-cozy-400 dark:text-gray-400">
              Trigger Animation / Emotion
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleStateClick('IDLE', 'neutral')}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Idle
              </button>
              <button
                onClick={() => handleStateClick('WALKING', 'neutral')}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Walk
              </button>
              <button
                onClick={() => handleStateClick('SITTING', 'calm')}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Sit
              </button>
              <button
                onClick={() => handleStateClick('SWINGING_FEET', 'happy')}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Swing Feet
              </button>
              <button
                onClick={() => handleStateClick('LYING', 'tired')}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Lie Down
              </button>
              <button
                onClick={() => handleStateClick('SLEEPING', 'tired')}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Sleep 💤
              </button>
              <button
                onClick={wakeUp}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Wake Up
              </button>
              <button
                onClick={() => handleStateClick('THINKING', 'curious', 'hmm...')}
                className="px-2 py-1 rounded-lg bg-cozy-100 hover:bg-cozy-200 dark:bg-darkbg dark:hover:bg-darkbg-hover text-cozy-800 dark:text-gray-200 text-center"
              >
                Think
              </button>
              <button
                onClick={() => handleStateClick('HAPPY', 'happy', 'yay!')}
                className="px-2 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 text-center"
              >
                Happy
              </button>
              <button
                onClick={() => handleStateClick('SAD', 'sad', 'aww...')}
                className="px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-center"
              >
                Sad
              </button>
              <button
                onClick={() => handleStateClick('SURPRISED', 'surprised', 'oh!')}
                className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-center"
              >
                Surprised
              </button>
              <button
                onClick={celebrate}
                className="px-2 py-1 rounded-lg bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900/60 text-yellow-900 dark:text-yellow-200 font-bold text-center"
              >
                Celebrate! 🎉
              </button>
              <button
                onClick={hideInBox}
                className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-center"
              >
                Box 📦
              </button>
              <button
                onClick={becomeDracula}
                className="px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-center"
              >
                Dracula 🧛
              </button>
              <button
                onClick={restAtHome}
                className="px-2 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-center"
              >
                Go Home 🏠
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
