import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  CharacterState,
  CharacterEmotion,
  CharacterAction,
  CharacterReaction,
  MovementMode,
  UIZone,
  AnimationPriority,
} from '../types';

interface CharacterContextType {
  state: CharacterState;
  emotion: CharacterEmotion;
  bubbleText: string | null;
  currentZone: UIZone;
  movementMode: MovementMode;
  targetPosition: { x: number; y: number } | null;
  facing: 'left' | 'right';
  currentPriority: AnimationPriority;
  triggerReaction: (reaction: Partial<CharacterReaction>) => void;
  triggerSpeech: (text: string, duration?: number) => void;
  setState: (state: CharacterState, priority?: AnimationPriority) => void;
  setEmotion: (emotion: CharacterEmotion) => void;
  setZone: (zone: UIZone) => void;
  setMovementMode: (mode: MovementMode) => void;
  setTargetPosition: (pos: { x: number; y: number } | null) => void;
  setFacing: (facing: 'left' | 'right') => void;
  wakeUp: () => void;
  celebrate: () => void;
  hideInBox: () => void;
  becomeDracula: () => void;
  restAtHome: () => void;
}

const PRIORITY_LEVELS: Record<AnimationPriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setStateInternal] = useState<CharacterState>('IDLE');
  const [emotion, setEmotion] = useState<CharacterEmotion>('neutral');
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [currentZone, setCurrentZone] = useState<UIZone>('HOME');
  const [movementMode, setMovementMode] = useState<MovementMode>('FOLLOW_CURSOR');
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [currentPriority, setCurrentPriority] = useState<AnimationPriority>('LOW');

  const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastReactionTimeRef = useRef<number>(0);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const priorityRef = useRef<AnimationPriority>('LOW');

  const triggerSpeech = useCallback((text: string, duration = 2800) => {
    // Truncate to maximum 4 words as required by Section 18
    const words = text.trim().split(/\s+/);
    const shortText = words.slice(0, 4).join(' ');

    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    setBubbleText(shortText);
    bubbleTimeoutRef.current = setTimeout(() => {
      setBubbleText(null);
    }, duration);
  }, []);

  const setState = useCallback((newState: CharacterState, priority: AnimationPriority = 'MEDIUM') => {
    const currentLvl = PRIORITY_LEVELS[priorityRef.current];
    const newLvl = PRIORITY_LEVELS[priority];

    // Check if new priority can override current state
    if (newLvl >= currentLvl || currentLvl <= PRIORITY_LEVELS.MEDIUM) {
      priorityRef.current = priority;
      setCurrentPriority(priority);
      setStateInternal(newState);

      // High priority states automatically return to idle after duration
      if (priority === 'VERY_HIGH' || priority === 'HIGH') {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          priorityRef.current = 'LOW';
          setCurrentPriority('LOW');
          setStateInternal('IDLE');
        }, 3600);
      }
    }
  }, []);

  const triggerReaction = useCallback(
    (reaction: Partial<CharacterReaction>) => {
      const now = Date.now();
      // Enforce 4s cooldown on speech bubble
      const canSpeak = now - lastReactionTimeRef.current > 4000;

      if (reaction.emotion) {
        setEmotion(reaction.emotion);
      }

      const priority: AnimationPriority =
        reaction.priority ||
        (reaction.action === 'celebrate' || reaction.emotion === 'surprised'
          ? 'VERY_HIGH'
          : reaction.emotion === 'happy' || reaction.emotion === 'excited' || reaction.emotion === 'sad'
          ? 'HIGH'
          : 'MEDIUM');

      // Map action to state
      if (reaction.action) {
        switch (reaction.action) {
          case 'celebrate':
            setState('CELEBRATING', priority);
            break;
          case 'dracula':
            setState('DRACULA', priority);
            break;
          case 'box_hide':
            setState('BOX_HIDE', priority);
            break;
          case 'sit':
            setState('SITTING', priority);
            break;
          case 'swing_feet':
            setState('SWINGING_FEET', priority);
            break;
          case 'lie':
            setState('LYING', priority);
            break;
          case 'sleep':
            setState('SLEEPING', priority);
            break;
          case 'wake':
            setState('WAKING', priority);
            break;
          case 'stretch':
            setState('STRETCHING', priority);
            break;
          case 'think':
            setState('THINKING', priority);
            break;
          case 'walk':
            setState('WALKING', priority);
            break;
          case 'climb':
            setState('CLIMBING', priority);
            break;
          case 'look':
            setState('LOOKING', priority);
            break;
          default:
            setState('IDLE', priority);
        }
      } else if (reaction.emotion) {
        switch (reaction.emotion) {
          case 'happy':
            setState('HAPPY', priority);
            break;
          case 'excited':
            setState('EXCITED', priority);
            break;
          case 'sad':
            setState('SAD', priority);
            break;
          case 'worried':
            setState('WORRIED', priority);
            break;
          case 'surprised':
            setState('SURPRISED', priority);
            break;
          case 'frustrated':
            setState('FRUSTRATED', priority);
            break;
          case 'curious':
            setState('CURIOUS', priority);
            break;
          case 'tired':
            setState('TIRED', priority);
            break;
          case 'calm':
          case 'relieved':
            setState('CALM', priority);
            break;
          case 'proud':
            setState('PROUD', priority);
            break;
          default:
            setState('IDLE', priority);
        }
      }

      if (reaction.sound && canSpeak) {
        triggerSpeech(reaction.sound, 2800);
        lastReactionTimeRef.current = now;
      }
    },
    [setState, triggerSpeech]
  );

  const wakeUp = useCallback(() => {
    if (state === 'SLEEPING' || state === 'LYING' || state === 'SITTING') {
      priorityRef.current = 'MEDIUM';
      setCurrentPriority('MEDIUM');
      setStateInternal('WAKING');
      setEmotion('curious');
      triggerSpeech('oh!', 1800);
      setTimeout(() => {
        setStateInternal('IDLE');
        priorityRef.current = 'LOW';
        setCurrentPriority('LOW');
      }, 700);
    }
  }, [state, triggerSpeech]);

  const celebrate = useCallback(() => {
    priorityRef.current = 'VERY_HIGH';
    setCurrentPriority('VERY_HIGH');
    setStateInternal('CELEBRATING');
    setEmotion('excited');
    triggerSpeech('YAY!!', 3500);

    setTimeout(() => {
      setStateInternal('HAPPY');
      setTimeout(() => {
        setStateInternal('IDLE');
        priorityRef.current = 'LOW';
        setCurrentPriority('LOW');
      }, 3000);
    }, 2800);
  }, [triggerSpeech]);

  const hideInBox = useCallback(() => {
    priorityRef.current = 'HIGH';
    setCurrentPriority('HIGH');
    setStateInternal('BOX_HIDE');
    setEmotion('curious');
    triggerSpeech('box!', 2000);
  }, [triggerSpeech]);

  const becomeDracula = useCallback(() => {
    priorityRef.current = 'VERY_HIGH';
    setCurrentPriority('VERY_HIGH');
    setStateInternal('DRACULA');
    setEmotion('excited');
    triggerSpeech('rawr!', 2200);
  }, [triggerSpeech]);

  const restAtHome = useCallback(() => {
    setMovementMode('RETURN_HOME');
    setCurrentZone('CAT_HOME');
    setStateInternal('IDLE');
    priorityRef.current = 'LOW';
    setCurrentPriority('LOW');
  }, []);

  return (
    <CharacterContext.Provider
      value={{
        state,
        emotion,
        bubbleText,
        currentZone,
        movementMode,
        targetPosition,
        facing,
        currentPriority,
        triggerReaction,
        triggerSpeech,
        setState,
        setEmotion,
        setZone: setCurrentZone,
        setMovementMode,
        setTargetPosition,
        setFacing,
        wakeUp,
        celebrate,
        hideInBox,
        becomeDracula,
        restAtHome,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
