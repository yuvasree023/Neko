import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, loginAsDemo } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signupWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (demoName: string) => {
    loginAsDemo(demoName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-darkbg-card rounded-3xl border border-cozy-200 dark:border-darkbg-border shadow-cozy p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-cozy-400 hover:text-cozy-700 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-momo-peach to-momo-blush mx-auto flex items-center justify-center text-xl shadow-sm">
            🐾
          </div>
          <h2 className="text-2xl font-serif font-bold text-cozy-950 dark:text-white">
            {isSignUp ? 'Create your sanctuary' : 'Welcome back'}
          </h2>
          <p className="text-xs text-cozy-600 dark:text-gray-400 font-light">
            Your private journal with Momo, your tiny animated companion.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-cozy-800 dark:text-gray-200 mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cozy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-cozy-50 dark:bg-darkbg border border-cozy-200 dark:border-darkbg-border outline-none focus:border-cozy-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-cozy-800 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cozy-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-cozy-50 dark:bg-darkbg border border-cozy-200 dark:border-darkbg-border outline-none focus:border-cozy-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cozy-800 dark:text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cozy-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-cozy-50 dark:bg-darkbg border border-cozy-200 dark:border-darkbg-border outline-none focus:border-cozy-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-cozy-900 hover:bg-cozy-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-cozy-950 font-semibold text-xs sm:text-sm shadow-soft transition-all disabled:opacity-50 mt-1"
          >
            {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cozy-200 dark:border-darkbg-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-darkbg-card px-2 text-cozy-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-cozy-200 dark:border-darkbg-border hover:bg-cozy-50 dark:hover:bg-darkbg text-cozy-800 dark:text-gray-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors mb-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign In with Google</span>
        </button>

        {/* Quick Demo Switcher */}
        <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-center space-y-1.5">
          <div className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Instant Demo Mode (No signup needed)</span>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => handleDemoSignIn('Alex')}
              className="px-3 py-1 rounded-lg bg-white dark:bg-darkbg text-cozy-800 dark:text-gray-200 text-xs font-medium border border-cozy-200 dark:border-darkbg-border hover:bg-cozy-100 shadow-xs"
            >
              Enter as Alex
            </button>
            <button
              onClick={() => handleDemoSignIn('Taylor')}
              className="px-3 py-1 rounded-lg bg-white dark:bg-darkbg text-cozy-800 dark:text-gray-200 text-xs font-medium border border-cozy-200 dark:border-darkbg-border hover:bg-cozy-100 shadow-xs"
            >
              Enter as Taylor
            </button>
          </div>
        </div>

        {/* Toggle sign in / sign up */}
        <div className="text-center text-xs text-cozy-500 dark:text-gray-400 mt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-cozy-900 dark:text-white underline ml-1"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
