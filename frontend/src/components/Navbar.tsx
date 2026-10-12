import React from 'react';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

interface NavbarProps {
  onSignInClick: () => void;
  onGetStartedClick: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSignInClick,
  onGetStartedClick,
  onNavigateSection
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[var(--border-subtle)] px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Wordmark & Kinetic Symbol */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigateSection('hero')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
            <Sparkles className="w-5 h-5 text-[#FAF5ED]" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#FAF5ED]">StudyBloom <span className="text-[var(--accent-primary)]">AI</span></span>
            <span className="block text-[10px] tracking-widest text-[var(--text-muted)] uppercase font-semibold">Personalized Learning Intelligence</span>
          </div>
        </div>

        {/* Center Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <button onClick={() => onNavigateSection('problem')} className="hover:text-[var(--text-primary)] transition-colors bg-transparent border-0 cursor-pointer">
            The Dilemma
          </button>
          <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-[var(--text-primary)] transition-colors bg-transparent border-0 cursor-pointer">
            How It Works
          </button>
          <button onClick={() => onNavigateSection('features')} className="hover:text-[var(--text-primary)] transition-colors bg-transparent border-0 cursor-pointer">
            Intelligence
          </button>
          <button onClick={() => onNavigateSection('research')} className="hover:text-[var(--text-primary)] transition-colors bg-transparent border-0 cursor-pointer">
            Research Lab
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSignInClick}
            className="btn-ghost text-sm font-medium flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[var(--accent-coral)]" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onGetStartedClick}
            className="btn-primary text-sm"
          >
            <span>Create My Study Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
