import { useState, useEffect, useRef } from 'react';
import { CharacterState, CharacterEmotion } from '../types';
import { CHARACTER_ANIMATIONS, FrameConfig } from './spriteManifest';

export interface CatControllerOptions {
  state: CharacterState;
  emotion?: CharacterEmotion;
  facing?: 'left' | 'right';
  onAnimationComplete?: (completedState: CharacterState) => void;
  speedMultiplier?: number;
}

export interface CatControllerState {
  config: FrameConfig;
  currentFrameIndex: number; // 0..N index inside config.frames
  sheetFrameNumber: number; // actual frame column on sprite sheet (0..totalSheetFrames-1)
  bounceY: number;
  rotateDeg: number;
  facing: 'left' | 'right';
}

/**
 * Controller hook managing sprite-sheet frame advancement,
 * duration tracking, looping, and one-shot completion.
 */
export function useCatController({
  state,
  facing = 'right',
  onAnimationComplete,
  speedMultiplier = 1,
}: CatControllerOptions): CatControllerState {
  const config = CHARACTER_ANIMATIONS[state] || CHARACTER_ANIMATIONS.IDLE;
  const [frameStep, setFrameStep] = useState(0);
  const frameStepRef = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Reset frame sequence when animation state changes
  useEffect(() => {
    frameStepRef.current = 0;
    setFrameStep(0);
  }, [state]);

  useEffect(() => {
    const totalSteps = config.frames.length;
    if (totalSteps <= 1) return;

    const intervalTime = Math.max(30, config.durationMs / Math.max(0.1, speedMultiplier));

    const timer = setInterval(() => {
      const nextStep = frameStepRef.current + 1;

      if (nextStep >= totalSteps) {
        if (config.loop) {
          frameStepRef.current = 0;
          setFrameStep(0);
        } else {
          // One-shot completed
          if (onAnimationComplete) {
            onAnimationComplete(stateRef.current);
          }
        }
      } else {
        frameStepRef.current = nextStep;
        setFrameStep(nextStep);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [config, speedMultiplier, onAnimationComplete]);

  const activeStep = Math.min(frameStep, config.frames.length - 1);
  const sheetFrameNumber = config.frames[activeStep] ?? 0;
  const bounceY = config.bounceY ? config.bounceY[activeStep % config.bounceY.length] : 0;
  const rotateDeg = config.rotateDeg ? config.rotateDeg[activeStep % config.rotateDeg.length] : 0;

  return {
    config,
    currentFrameIndex: activeStep,
    sheetFrameNumber,
    bounceY,
    rotateDeg,
    facing,
  };
}
