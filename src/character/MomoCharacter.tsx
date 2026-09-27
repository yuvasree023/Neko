import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CharacterState, CharacterEmotion } from '../types';

interface MomoCharacterProps {
  state: CharacterState;
  emotion: CharacterEmotion;
  lookAngle?: number; // radians or degrees for pupil direction
  isMoving?: boolean;
  facingDirection?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  isClimbing?: boolean;
  isSleeping?: boolean;
  onClick?: () => void;
}

export const MomoCharacter: React.FC<MomoCharacterProps> = ({
  state,
  emotion,
  lookAngle = 0,
  isMoving = false,
  facingDirection = 'right',
  size = 'md',
  isClimbing = false,
  isSleeping = false,
  onClick,
}) => {
  // Dimensions based on size setting
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;
  const width = 80 * scale;
  const height = 80 * scale;

  // Eye pupil offset based on look angle
  const pupilOffset = useMemo(() => {
    if (state === 'SLEEPING' || isSleeping) return { x: 0, y: 0 };
    const maxOffset = 3.5;
    return {
      x: Math.cos(lookAngle) * maxOffset,
      y: Math.sin(lookAngle) * maxOffset,
    };
  }, [lookAngle, state, isSleeping]);

  // Color accents based on emotion
  const moodColor = useMemo(() => {
    switch (emotion) {
      case 'happy':
      case 'excited':
      case 'proud':
        return '#FFB89E'; // Warm peach
      case 'sad':
      case 'worried':
      case 'tired':
        return '#B4D2E7'; // Soft blue
      case 'frustrated':
        return '#FF9AA2'; // Coral pink
      case 'curious':
      case 'surprised':
        return '#FFEAA7'; // Soft yellow
      case 'calm':
      case 'relieved':
        return '#C8E6C9'; // Soft sage
      default:
        return '#FFB89E';
    }
  }, [emotion]);

  // Animation variants for body bounce / idle
  const bodyVariants = {
    IDLE: {
      y: [0, -3, 0],
      scaleY: [1, 1.02, 1],
      transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
    },
    WALKING: {
      y: [0, -6, 0],
      rotate: facingDirection === 'right' ? [0, 4, -4, 0] : [0, -4, 4, 0],
      transition: { duration: 0.45, repeat: Infinity, ease: 'easeInOut' },
    },
    RUNNING: {
      y: [0, -10, 0],
      rotate: facingDirection === 'right' ? [2, 8, -6, 2] : [-2, -8, 6, -2],
      transition: { duration: 0.28, repeat: Infinity, ease: 'easeInOut' },
    },
    SITTING: {
      y: 2,
      scaleY: 0.94,
      scaleX: 1.05,
      transition: { duration: 0.3 },
    },
    LYING: {
      y: 6,
      scaleY: 0.78,
      scaleX: 1.15,
      transition: { duration: 0.4 },
    },
    SLEEPING: {
      y: [6, 7, 6],
      scaleY: [0.75, 0.78, 0.75],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    },
    CLIMBING: {
      y: [0, -5, 0],
      rotate: [0, 6, -6, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    THINKING: {
      rotate: [0, -4, -4, 0],
      y: [0, -2, 0],
      transition: { duration: 2, repeat: Infinity },
    },
    CELEBRATING: {
      y: [0, -18, 0],
      scale: [1, 1.12, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    HAPPY: {
      y: [0, -8, 0],
      scaleY: [1, 1.08, 1],
      transition: { duration: 0.6, repeat: Infinity },
    },
    EXCITED: {
      y: [0, -12, 0],
      rotate: [0, 8, -8, 0],
      transition: { duration: 0.35, repeat: Infinity },
    },
    TIRED: {
      y: 4,
      scaleY: 0.88,
      transition: { duration: 0.5 },
    },
    SAD: {
      y: 2,
      scaleY: 0.92,
      transition: { duration: 0.5 },
    },
    WORRIED: {
      x: [-1, 1, -1],
      transition: { duration: 0.15, repeat: Infinity },
    },
    SURPRISED: {
      y: -6,
      scale: 1.08,
      transition: { duration: 0.2 },
    },
    FRUSTRATED: {
      x: [-2, 2, -2],
      y: [0, -2, 0],
      transition: { duration: 0.2, repeat: Infinity },
    },
    CALM: {
      y: [0, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    CURIOUS: {
      rotate: facingDirection === 'right' ? 8 : -8,
      y: [0, -3, 0],
      transition: { duration: 1.5, repeat: Infinity },
    },
  };

  const currentVariant = state in bodyVariants ? state : 'IDLE';

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer select-none transition-transform duration-200"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scaleX(${facingDirection === 'left' ? -1 : 1})`,
      }}
      title="Momo is here with you 🐾"
    >
      {/* Floating particles for certain emotions */}
      {state === 'SLEEPING' && (
        <div className="absolute -top-6 right-2 flex flex-col items-center pointer-events-none">
          <span className="text-xs font-bold text-indigo-400 dark:text-indigo-300 animate-sleeping-zzz select-none">
            z
          </span>
          <span
            className="text-sm font-bold text-indigo-400 dark:text-indigo-300 animate-sleeping-zzz select-none"
            style={{ animationDelay: '0.8s' }}
          >
            Z
          </span>
          <span
            className="text-base font-bold text-indigo-400 dark:text-indigo-300 animate-sleeping-zzz select-none"
            style={{ animationDelay: '1.6s' }}
          >
            Z
          </span>
        </div>
      )}

      {state === 'CELEBRATING' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1">
          <span className="animate-ping text-xs text-yellow-400">✨</span>
          <span className="animate-bounce text-xs text-pink-400">🎉</span>
          <span className="animate-ping text-xs text-amber-300" style={{ animationDelay: '0.2s' }}>
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
        <div className="absolute -top-5 right-2 pointer-events-none animate-pulse">
          <span className="text-xs font-bold text-amber-500">💭</span>
        </div>
      )}

      {/* Main Momo Character SVG Vector Graphic */}
      <motion.div
        variants={bodyVariants}
        animate={currentVariant}
        className="w-full h-full relative"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-md overflow-visible"
        >
          {/* Shadow underneath */}
          <ellipse
            cx="50"
            cy="88"
            rx={state === 'SLEEPING' || state === 'LYING' ? '36' : '26'}
            ry="6"
            fill="rgba(0, 0, 0, 0.12)"
          />

          {/* Tail */}
          <motion.path
            d="M 22 68 Q 12 62 16 52 Q 22 55 24 64"
            fill="#FFF5EB"
            stroke="#533D2D"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              rotate: state === 'CELEBRATING' || state === 'EXCITED' ? [-15, 25, -15] : [-4, 6, -4],
              originX: '24px',
              originY: '68px',
            }}
            transition={{
              repeat: Infinity,
              duration: state === 'EXCITED' ? 0.3 : 1.8,
              ease: 'easeInOut',
            }}
          />

          {/* Left Ear */}
          <motion.path
            d="M 30 32 C 22 15 36 10 42 26 Z"
            fill="#FFF5EB"
            stroke="#533D2D"
            strokeWidth="2.5"
            strokeLinejoin="round"
            animate={{
              rotate: state === 'WORRIED' ? [-6, 6, -6] : [0, -3, 0],
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          {/* Left Ear Inner Pink */}
          <path
            d="M 32 29 C 27 19 35 16 39 26 Z"
            fill={moodColor}
            opacity="0.8"
          />

          {/* Right Ear */}
          <motion.path
            d="M 70 32 C 78 15 64 10 58 26 Z"
            fill="#FFF5EB"
            stroke="#533D2D"
            strokeWidth="2.5"
            strokeLinejoin="round"
            animate={{
              rotate: state === 'WORRIED' ? [6, -6, 6] : [0, 3, 0],
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          {/* Right Ear Inner Pink */}
          <path
            d="M 68 29 C 73 19 65 16 61 26 Z"
            fill={moodColor}
            opacity="0.8"
          />

          {/* Body / Head - Soft Cozy Plush Shape */}
          <rect
            x="22"
            y="26"
            width="56"
            height="56"
            rx="28"
            fill="#FFF8F0"
            stroke="#533D2D"
            strokeWidth="3"
          />

          {/* Cozy Tummy Highlight */}
          <ellipse
            cx="50"
            cy="62"
            rx="18"
            ry="15"
            fill="#FFF0E0"
          />

          {/* Cheeks (Blush) */}
          <circle
            cx="32"
            cy="56"
            r={state === 'EXCITED' || state === 'HAPPY' ? '5.5' : '4.5'}
            fill="#FFAAA6"
            opacity="0.75"
          />
          <circle
            cx="68"
            cy="56"
            r={state === 'EXCITED' || state === 'HAPPY' ? '5.5' : '4.5'}
            fill="#FFAAA6"
            opacity="0.75"
          />

          {/* Left Eye */}
          {state === 'SLEEPING' || isSleeping ? (
            // Sleepy closed eye curve (ᴗ)
            <path
              d="M 34 49 Q 40 54 46 49"
              stroke="#533D2D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : state === 'HAPPY' || state === 'CELEBRATING' || state === 'EXCITED' ? (
            // Happy closed eye curve (⌒)
            <path
              d="M 34 50 Q 40 43 46 50"
              stroke="#533D2D"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : state === 'SAD' || state === 'TIRED' ? (
            // Sad / sleepy droop
            <path
              d="M 34 47 Q 40 52 46 48"
              stroke="#533D2D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Open Eye with tracking pupil
            <g>
              <ellipse cx="40" cy="48" rx="5" ry="6" fill="#FFFFFF" stroke="#533D2D" strokeWidth="1.5" />
              <circle
                cx={40 + pupilOffset.x}
                cy={48 + pupilOffset.y}
                r="3.2"
                fill="#3E342F"
              />
              <circle
                cx={39 + pupilOffset.x * 0.7}
                cy={46 + pupilOffset.y * 0.7}
                r="1.2"
                fill="#FFFFFF"
              />
            </g>
          )}

          {/* Right Eye */}
          {state === 'SLEEPING' || isSleeping ? (
            <path
              d="M 54 49 Q 60 54 66 49"
              stroke="#533D2D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : state === 'HAPPY' || state === 'CELEBRATING' || state === 'EXCITED' ? (
            <path
              d="M 54 50 Q 60 43 66 50"
              stroke="#533D2D"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : state === 'SAD' || state === 'TIRED' ? (
            <path
              d="M 54 48 Q 60 52 66 47"
              stroke="#533D2D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <g>
              <ellipse cx="60" cy="48" rx="5" ry="6" fill="#FFFFFF" stroke="#533D2D" strokeWidth="1.5" />
              <circle
                cx={60 + pupilOffset.x}
                cy={48 + pupilOffset.y}
                r="3.2"
                fill="#3E342F"
              />
              <circle
                cx={59 + pupilOffset.x * 0.7}
                cy={46 + pupilOffset.y * 0.7}
                r="1.2"
                fill="#FFFFFF"
              />
            </g>
          )}

          {/* Tiny Nose */}
          <polygon
            points="48,53 52,53 50,55"
            fill="#533D2D"
          />

          {/* Mouth */}
          {state === 'CELEBRATING' || state === 'EXCITED' || state === 'HAPPY' ? (
            // Open smiling mouth (ᗢ)
            <path
              d="M 46 56 Q 50 63 54 56 Z"
              fill="#FF8A80"
              stroke="#533D2D"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ) : state === 'SURPRISED' ? (
            // Small round surprised mouth (o)
            <ellipse
              cx="50"
              cy="58"
              rx="3"
              ry="4"
              fill="#FF8A80"
              stroke="#533D2D"
              strokeWidth="2"
            />
          ) : state === 'SAD' || state === 'WORRIED' ? (
            // Slight downward mouth (︵)
            <path
              d="M 46 59 Q 50 56 54 59"
              stroke="#533D2D"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : state === 'SLEEPING' ? (
            // Relaxed tiny mouth line
            <path
              d="M 48 57 Q 50 58 52 57"
              stroke="#533D2D"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Cute cat mouth (ω)
            <path
              d="M 45 56 Q 48 59 50 56 Q 52 59 55 56"
              stroke="#533D2D"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Tiny Paws / Feet */}
          {state !== 'SLEEPING' && state !== 'LYING' && (
            <>
              {/* Left Paw */}
              <ellipse
                cx="38"
                cy="81"
                rx="6"
                ry="4"
                fill="#FFF5EB"
                stroke="#533D2D"
                strokeWidth="2"
              />
              {/* Right Paw */}
              <ellipse
                cx="62"
                cy="81"
                rx="6"
                ry="4"
                fill="#FFF5EB"
                stroke="#533D2D"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
