import IdleSprite from '../assets/character/Idle.png';
import DrculaSprite from '../assets/character/drculacat.png';
import Box3Sprite from '../assets/character/Box3.png';
import FurnituresSprite from '../assets/character/Furnitures.png';
import { CharacterState, CharacterEmotion } from '../types';

export { IdleSprite, DrculaSprite, Box3Sprite, FurnituresSprite };

export interface FrameConfig {
  sheet: string;
  totalSheetFrames: number;
  frames: number[]; // zero-based indices of frames in the sheet
  frameWidth: number; // usually 32
  frameHeight: number; // usually 32
  durationMs: number; // milliseconds per frame
  loop: boolean;
  bounceY?: number[]; // subtle vertical pixel/percent bounce per frame
  rotateDeg?: number[]; // subtle rotation per frame
  soundCue?: string;
  fallbackState?: CharacterState;
}

export const SPRITE_FRAME_SIZE = 32;

/**
 * Manifest defining the precise frame layouts for each character state.
 * Built directly from the CatPackFree sprite sheets:
 * - Idle.png: 10 frames (320x32)
 * - drculacat.png: 6 frames (192x32)
 * - Box3.png: 4 frames (128x32)
 */
export const CHARACTER_ANIMATIONS: Record<CharacterState, FrameConfig> = {
  IDLE: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 3, 2, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 220,
    loop: true,
    bounceY: [0, -1, -2, -1, 0, 0],
  },
  LOOKING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [4, 5, 6, 5, 4],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 250,
    loop: true,
  },
  CURIOUS: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [4, 5, 6, 5],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 200,
    loop: true,
    rotateDeg: [0, 4, 6, 4],
  },
  THINKING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [4, 5, 4, 5],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 350,
    loop: true,
    rotateDeg: [-3, -5, -3, 0],
  },
  WALKING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    // Walking fallback using step alternation + vertical gait bobbing
    frames: [0, 1, 2, 3],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 120,
    loop: true,
    bounceY: [0, -4, 0, -4],
    rotateDeg: [-2, 2, -2, 2],
  },
  RUNNING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 3],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 80,
    loop: true,
    bounceY: [0, -7, 0, -7],
    rotateDeg: [-4, 4, -4, 4],
  },
  SITTING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 0],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 400,
    loop: true,
    bounceY: [2, 1, 2],
  },
  SWINGING_FEET: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 200,
    loop: true,
    bounceY: [2, 0, 2, 0],
    rotateDeg: [-3, 3, -3, 3],
  },
  LYING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [7, 8, 9, 8],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 450,
    loop: true,
    bounceY: [4, 4, 5, 4],
  },
  SLEEPING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [8, 9, 8, 9],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 650,
    loop: true,
    bounceY: [4, 5, 4, 5],
  },
  WAKING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [8, 7, 4, 0],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 180,
    loop: false,
    soundCue: 'oh!',
  },
  STRETCHING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [7, 8, 7, 0, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 240,
    loop: false,
  },
  HAPPY: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 3, 2, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 140,
    loop: true,
    bounceY: [0, -6, -8, -6, 0, 0],
    rotateDeg: [-3, 3, -3, 3, 0, 0],
  },
  EXCITED: {
    sheet: DrculaSprite,
    totalSheetFrames: 6,
    frames: [0, 1, 2, 3, 4, 5],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 110,
    loop: true,
    bounceY: [0, -8, -12, -8, -4, 0],
  },
  CELEBRATING: {
    sheet: DrculaSprite,
    totalSheetFrames: 6,
    frames: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 100,
    loop: true,
    bounceY: [0, -10, -16, -18, -12, -4, 0, -6, -10, -4, 0],
    rotateDeg: [0, -6, 6, -8, 8, 0],
    soundCue: 'YAY!',
  },
  DRACULA: {
    sheet: DrculaSprite,
    totalSheetFrames: 6,
    frames: [0, 1, 2, 3, 4, 5],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 130,
    loop: true,
    bounceY: [0, -4, -6, -4, 0, 0],
  },
  BOX_HIDE: {
    sheet: Box3Sprite,
    totalSheetFrames: 4,
    frames: [0, 1, 2, 3, 2, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 240,
    loop: true,
  },
  SAD: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 0, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 400,
    loop: true,
    bounceY: [2, 3, 2, 3],
  },
  WORRIED: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [4, 5, 4, 5],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 160,
    loop: true,
    rotateDeg: [-4, 4, -4, 4],
  },
  SURPRISED: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [4, 5, 6, 5],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 100,
    loop: false,
    bounceY: [-8, -12, -8, -4],
  },
  FRUSTRATED: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 100,
    loop: true,
    bounceY: [0, -2, 0, -2],
    rotateDeg: [-6, 6, -6, 6],
  },
  CALM: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 1],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 300,
    loop: true,
  },
  PROUD: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 3],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 180,
    loop: true,
    bounceY: [0, -4, -6, -2],
  },
  TIRED: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [7, 8, 7, 8],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 500,
    loop: true,
    bounceY: [3, 4, 3, 4],
  },
  CLIMBING: {
    sheet: IdleSprite,
    totalSheetFrames: 10,
    frames: [0, 1, 2, 3],
    frameWidth: SPRITE_FRAME_SIZE,
    frameHeight: SPRITE_FRAME_SIZE,
    durationMs: 140,
    loop: true,
    bounceY: [0, -6, 0, -6],
    rotateDeg: [-5, 5, -5, 5],
  },
};

/**
 * Maps Gemini emotions to primary character reactions
 */
export function getAnimationForEmotion(emotion: CharacterEmotion): CharacterState {
  switch (emotion) {
    case 'happy':
      return 'HAPPY';
    case 'excited':
      return 'EXCITED';
    case 'proud':
      return 'PROUD';
    case 'sad':
      return 'SAD';
    case 'worried':
      return 'WORRIED';
    case 'surprised':
      return 'SURPRISED';
    case 'frustrated':
      return 'FRUSTRATED';
    case 'curious':
    case 'confused':
      return 'CURIOUS';
    case 'tired':
      return 'TIRED';
    case 'calm':
    case 'relieved':
      return 'CALM';
    default:
      return 'IDLE';
  }
}
