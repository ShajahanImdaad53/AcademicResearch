import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Lock, Mail, User, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('BSc Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    if (isRegister && !name) {
      setError('Please provide your full name.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: isRegister ? name : (email.split('@')[0] || 'Undergraduate Scholar'),
        email,
        degree,
        yearOfStudy,
        isAuthenticated: true,
        isOnboarded: true
      });
      onClose();
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: 'Alex Rivera',
        email: 'alex.rivera@university.edu',
        degree: 'BSc Computer Science',
        yearOfStudy: 3,
        isAuthenticated: true,
        isOnboarded: true
      });
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Background Image Container with Cinematic Lighting */}
      <div className="relative w-full max-w-4xl min-h-[580px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl flex flex-col md:flex-row bg-[var(--bg-primary)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-[var(--text-secondary)] hover:text-[#FAF5ED] transition-colors border-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Real AI-Generated Login Background (Visible & Dramatic) */}
        <div className="relative hidden md:block md:w-1/2 overflow-hidden bg-black">
          <img
            src="/assets/images/login-background.jpg"
            alt="StudyBloom Authentication Environment"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-[var(--bg-primary)]" />
          
          <div className="absolute bottom-8 left-8 right-8 space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Academic Workspace</span>
            </div>
            <h3 className="text-2xl font-bold text-[#FAF5ED] leading-tight">
              Personalized Planning for Higher Education
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Log in to sync your enrolled modules, generate conflict-free study timetables, and monitor academic progress.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between glass-panel z-20">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#FAF5ED]" />
                </div>
                <span className="font-extrabold text-lg text-[#FAF5ED]">StudyBloom AI</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#FAF5ED] tracking-tight">
                {isRegister ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {isRegister
                  ? 'Set up your student profile to begin scheduling.'
                  : 'Enter your credentials to access your personalized timetable.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-[var(--accent-secondary)]/15 border border-[var(--accent-secondary)]/30 text-xs text-[#FF8A78]">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="input-field pl-9 text-xs"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">University Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="input-field pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Password</label>
                  {!isRegister && (
                    <button
                      type="button"
                      className="text-[11px] text-[var(--accent-primary)] hover:underline bg-transparent border-0 cursor-pointer p-0"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input-field pl-9 pr-9 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[#FAF5ED] border-0 bg-transparent cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Program</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Year of Study</label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(Number(e.target.value))}
                      className="input-field text-xs"
                    >
                      <option value={1}>Year 1</option>
                      <option value={2}>Year 2</option>
                      <option value={3}>Year 3</option>
                      <option value={4}>Year 4</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-xs py-3 justify-center mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isRegister ? 'Complete Registration' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Sign In Button */}
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <button
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[var(--accent-gold)]/10 hover:bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Instant Demo Sign In (Undergraduate Scholar)</span>
              </button>
            </div>
          </div>

          {/* Toggle between Login and Register */}
          <div className="pt-4 text-center text-xs text-[var(--text-muted)]">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  className="text-[var(--accent-primary)] font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  className="text-[var(--accent-primary)] font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Create one here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
