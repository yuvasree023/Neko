import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCharacter } from './CharacterContext';
import { AnimatedCat } from './AnimatedCat';
import { UserSettings } from '../types';

interface MomoEngineProps {
  settings: UserSettings;
}

export const MomoEngine: React.FC<MomoEngineProps> = ({ settings }) => {
  const {
    state,
    emotion,
    bubbleText,
    movementMode,
    targetPosition,
    facing,
    setState,
    setEmotion,
    setFacing,
    wakeUp,
    triggerSpeech,
  } = useCharacter();

  // Screen coordinates
  const [pos, setPos] = useState({ x: 120, y: 350 });
  const [isMoving, setIsMoving] = useState(false);

  // High-frequency animation refs (avoiding React re-renders on mousemove)
  const posRef = useRef({ x: 120, y: 350 });
  const targetPosRef = useRef({ x: 120, y: 350 });
  const mousePosRef = useRef({ x: 300, y: 300 });
  const lastActivityRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number>(0);
  const wanderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMouseNoticeTime = useRef<number>(0);
  const isChasingCursorRef = useRef<boolean>(false);

  // Safe area helper for bottom-right home
  const getHomePosition = useCallback(() => {
    const marginX = 140;
    const marginY = 140;
    return {
      x: Math.max(60, window.innerWidth - marginX),
      y: Math.max(100, window.innerHeight - marginY),
    };
  }, []);

  // Initialize home starting position
  useEffect(() => {
    const home = getHomePosition();
    posRef.current = home;
    targetPosRef.current = home;
    setPos(home);
  }, [getHomePosition]);

  // Handle user activity (cursor movement, keydown, touch)
  const handleUserActivity = useCallback(
    (e?: MouseEvent | KeyboardEvent | TouchEvent) => {
      lastActivityRef.current = Date.now();

      if (e && 'clientX' in e) {
        mousePosRef.current = { x: e.clientX, y: e.clientY };

        // Natural cursor following logic with hesitation & offset
        if (
          settings.followCursor &&
          movementMode === 'FOLLOW_CURSOR' &&
          state !== 'SLEEPING' &&
          state !== 'LYING' &&
          state !== 'BOX_HIDE'
        ) {
          const now = Date.now();
          // Cat hesitates a fraction of a second before chasing
          if (now - lastMouseNoticeTime.current > 300) {
            lastMouseNoticeTime.current = now;

            const isLeftSide = e.clientX < window.innerWidth / 2;
            const offsetX = isLeftSide ? 90 : -90;
            const offsetY = 50;

            const clampedX = Math.max(40, Math.min(window.innerWidth - 120, e.clientX + offsetX));
            const clampedY = Math.max(80, Math.min(window.innerHeight - 130, e.clientY + offsetY));

            targetPosRef.current = { x: clampedX, y: clampedY };
            isChasingCursorRef.current = true;
          }
        }
      }

      // Wake up if currently resting
      if (state === 'SLEEPING' || state === 'LYING' || state === 'SITTING') {
        wakeUp();
      }
    },
    [settings.followCursor, movementMode, state, wakeUp]
  );

  // Global event listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleUserActivity(e);
    const onKeyDown = (e: KeyboardEvent) => handleUserActivity(e);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleUserActivity({ clientX: touch.clientX, clientY: touch.clientY } as any);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [handleUserActivity]);

  // Handle explicit targetPosition overrides
  useEffect(() => {
    if (targetPosition) {
      targetPosRef.current = targetPosition;
    }
  }, [targetPosition]);

  // Handle RETURN_HOME mode
  useEffect(() => {
    if (movementMode === 'RETURN_HOME') {
      const home = getHomePosition();
      targetPosRef.current = home;
    }
  }, [movementMode, getHomePosition]);

  // Inactivity progression loop:
  // 10s: look around -> 20s: sit -> 40s: lie down -> 60s: sleep
  useEffect(() => {
    if (!settings.idleAnimations) return;

    const interval = setInterval(() => {
      const inactiveSeconds = (Date.now() - lastActivityRef.current) / 1000;

      if (inactiveSeconds >= 60 && state !== 'SLEEPING') {
        setState('SLEEPING', 'LOW');
        setEmotion('tired');
      } else if (inactiveSeconds >= 40 && inactiveSeconds < 60 && state !== 'LYING' && state !== 'SLEEPING') {
        setState('LYING', 'LOW');
        setEmotion('tired');
      } else if (inactiveSeconds >= 20 && inactiveSeconds < 40 && state !== 'SITTING' && state !== 'LYING' && state !== 'SLEEPING') {
        setState('SITTING', 'LOW');
        setEmotion('calm');
      } else if (inactiveSeconds >= 10 && inactiveSeconds < 20 && state === 'IDLE') {
        setState('LOOKING', 'LOW');
        setEmotion('curious');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [settings.idleAnimations, state, setState, setEmotion]);

  // Idle wandering when at home / relaxed
  useEffect(() => {
    if (
      movementMode !== 'FOLLOW_CURSOR' ||
      state === 'SLEEPING' ||
      state === 'LYING' ||
      state === 'BOX_HIDE' ||
      !settings.idleAnimations
    ) {
      return;
    }

    const startWander = () => {
      const delay = 9000 + Math.random() * 12000;
      wanderTimerRef.current = setTimeout(() => {
        const inactiveSeconds = (Date.now() - lastActivityRef.current) / 1000;
        if (inactiveSeconds > 5 && inactiveSeconds < 20 && state === 'IDLE') {
          // Wander slightly nearby
          const deltaX = (Math.random() - 0.5) * 140;
          const deltaY = (Math.random() - 0.5) * 60;
          const newX = Math.max(60, Math.min(window.innerWidth - 130, posRef.current.x + deltaX));
          const newY = Math.max(100, Math.min(window.innerHeight - 140, posRef.current.y + deltaY));
          targetPosRef.current = { x: newX, y: newY };
        }
        startWander();
      }, delay);
    };

    startWander();
    return () => {
      if (wanderTimerRef.current) clearTimeout(wanderTimerRef.current);
    };
  }, [movementMode, state, settings.idleAnimations]);

  // Main 60fps Physics & Damped Interpolation Loop
  useEffect(() => {
    if (settings.companionMode === 'hidden') return;

    let lastTime = performance.now();

    const updatePhysics = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const current = posRef.current;
      const target = targetPosRef.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (settings.reducedMotion) {
        posRef.current = target;
        setPos(target);
        setIsMoving(false);
      } else if (dist > 4 && state !== 'SLEEPING' && state !== 'LYING' && state !== 'BOX_HIDE') {
        const speed = state === 'RUNNING' || state === 'CELEBRATING' ? 7.5 : 4.0;
        const lerpFactor = Math.min(1, dt * speed);

        posRef.current.x += dx * lerpFactor;
        posRef.current.y += dy * lerpFactor;

        // Facing direction
        if (Math.abs(dx) > 1.2) {
          setFacing(dx > 0 ? 'right' : 'left');
        }

        if (dist > 25 && state === 'IDLE') {
          setState('WALKING', 'LOW');
        }

        setIsMoving(true);
        setPos({ x: posRef.current.x, y: posRef.current.y });
      } else {
        if (isMoving) {
          setIsMoving(false);
          if (state === 'WALKING' || state === 'RUNNING') {
            setState('IDLE', 'LOW');
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [settings.companionMode, settings.reducedMotion, state, isMoving, setState, setFacing]);

  // Click reaction
  const handleCatClick = () => {
    wakeUp();
    const sounds = ['hehe!', 'oh!', 'yay!', 'purr...', 'hi!', 'mew!'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    setEmotion('happy');
    setState('EXCITED', 'HIGH');
    triggerSpeech(randomSound, 2200);

    setTimeout(() => {
      setState('HAPPY', 'MEDIUM');
      setTimeout(() => setState('IDLE', 'LOW'), 2000);
    }, 1200);
  };

  if (settings.companionMode === 'hidden') {
    return null;
  }

  const renderPos =
    settings.companionMode === 'minimal' ? getHomePosition() : pos;

  return (
    <div
      className="fixed z-40 pointer-events-none transition-opacity duration-300 select-none"
      style={{
        transform: `translate3d(${renderPos.x}px, ${renderPos.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      <div className="relative pointer-events-auto">
        <AnimatedCat
          state={state}
          emotion={emotion}
          facingDirection={facing}
          size={settings.companionSize}
          isMoving={isMoving}
          bubbleText={settings.textReactions ? bubbleText : null}
          onClick={handleCatClick}
        />
      </div>
    </div>
  );
};
