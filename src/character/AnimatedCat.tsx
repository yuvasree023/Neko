import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CharacterState, CharacterEmotion } from '../types';
import { useCatController } from './useCatController';

export interface AnimatedCatProps {
  state: CharacterState;
  emotion: CharacterEmotion;
  facingDirection?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  isMoving?: boolean;
  bubbleText?: string | null;
  onClick?: () => void;
  onAnimationComplete?: (state: CharacterState) => void;
  speedMultiplier?: number;
}

export const AnimatedCat: React.FC<AnimatedCatProps> = ({
  state,
  emotion,
  facingDirection = 'right',
  size = 'md',
  isMoving = false,
  bubbleText,
  onClick,
  onAnimationComplete,
  speedMultiplier = 1,
}) => {
  const { config, sheetFrameNumber, bounceY, rotateDeg } = useCatController({
    state,
    emotion,
    facing: facingDirection,
    onAnimationComplete,
    speedMultiplier,
  });

  // Display size in pixels (preserves 1:1 pixel art aspect ratio)
  const displaySize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 54;
      case 'lg':
        return 96;
      case 'md':
      default:
        return 72;
    }
  }, [size]);

  // Sprite sheet calculations:
  // Sheet is 1 row with N horizontal frames of 32x32.
  // We use background-position and background-size in % or px.
  const totalFrames = config.totalSheetFrames;
  // If totalFrames = 10, total width is 10 * 100% of displaySize = 1000%
  const backgroundSizePercent = `${totalFrames * 100}% 100%`;
  // background-position-x in percentage: (frameIndex / (totalFrames - 1)) * 100%
  const bgPositionPercent = totalFrames > 1 ? `${(sheetFrameNumber / (totalFrames - 1)) * 100}% 0%` : '0% 0%';

  return (
    <div
      onClick={onClick}
      className="relative select-none cursor-pointer group"
      style={{
        width: `${displaySize}px`,
        height: `${displaySize}px`,
      }}
      title="Momo the journal cat 🐾 (Click to interact)"
    >
      {/* Speech Bubble */}
      {bubbleText && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all">
          <div className="relative px-3 py-1.5 bg-white dark:bg-darkbg-card text-cozy-950 dark:text-gray-100 text-xs font-semibold rounded-2xl shadow-xl border border-cozy-200 dark:border-darkbg-border whitespace-nowrap flex items-center gap-1.5 animate-bounce-subtle">
            <span>{bubbleText}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-darkbg-card border-r border-b border-cozy-200 dark:border-darkbg-border rotate-45" />
          </div>
        </div>
      )}

      {/* Floating Particles for Special States */}
      {state === 'SLEEPING' && (
        <div className="absolute -top-7 right-1 flex flex-col items-center pointer-events-none">
          <span className="text-xs font-bold text-indigo-400 dark:text-indigo-300 animate-sleeping-zzz select-none">
            z
          </span>
          <span
            className="text-sm font-bold text-indigo-400 dark:text-indigo-300 animate-sleeping-zzz select-none"
            style={{ animationDelay: '0.9s' }}
          >
            Z
          </span>
          <span
            className="text-base font-bold text-indigo-400 dark:text-indigo-300 animate-sleeping-zzz select-none"
            style={{ animationDelay: '1.8s' }}
          >
            Z
          </span>
        </div>
      )}

      {(state === 'CELEBRATING' || state === 'EXCITED') && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1 items-center">
          <span className="animate-ping text-xs text-yellow-400">✨</span>
          <span className="animate-bounce text-xs text-pink-400">🎉</span>
          <span className="animate-ping text-xs text-amber-300" style={{ animationDelay: '0.3s' }}>
            ⭐
          </span>
        </div>
      )}

      {emotion === 'happy' && state !== 'CELEBRATING' && (
        <div className="absolute -top-3 right-0 pointer-events-none animate-float">
          <span className="text-xs text-pink-400">🌸</span>
        </div>
      )}

      {state === 'THINKING' && (
        <div className="absolute -top-5 right-1 pointer-events-none animate-pulse">
          <span className="text-xs font-bold text-amber-500">💭</span>
        </div>
      )}

      {/* Shadow Underneath */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/15 dark:bg-black/35 pointer-events-none transition-all duration-200"
        style={{
          width: state === 'SLEEPING' || state === 'LYING' ? `${displaySize * 0.85}px` : `${displaySize * 0.65}px`,
          height: `${displaySize * 0.16}px`,
          transform: `translateX(-50%) translateY(${bounceY * 0.3}px)`,
        }}
      />

      {/* Sprite Canvas / Box */}
      <motion.div
        className="w-full h-full relative"
        style={{
          backgroundImage: `url(${config.sheet})`,
          backgroundPosition: bgPositionPercent,
          backgroundSize: backgroundSizePercent,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          transform: `scaleX(${facingDirection === 'left' ? -1 : 1}) translateY(${bounceY}px) rotate(${rotateDeg}deg)`,
          transformOrigin: 'bottom center',
          transition: isMoving ? 'none' : 'transform 0.1s ease-out',
        }}
      />
    </div>
  );
};
