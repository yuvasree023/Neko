import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Heart } from 'lucide-react';

export const GreetingHeader: React.FC = () => {
  const { user } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const name = user?.displayName || 'Friend';

  return (
    <div className="space-y-1.5 pb-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cozy-500 dark:text-gray-400">
        <span>{formattedDate}</span>
        <span>•</span>
        <span className="flex items-center gap-1 text-momo-blush font-medium">
          <Heart className="w-3 h-3 fill-current" /> Cozy Sanctuary
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-serif font-medium text-cozy-950 dark:text-white tracking-tight">
        {greeting}, <span className="italic text-cozy-700 dark:text-cozy-300">{name}</span>.
      </h1>
      <p className="text-cozy-600 dark:text-gray-400 text-sm sm:text-base font-light">
        What is on your mind today? Momo is here to listen.
      </p>
    </div>
  );
};
