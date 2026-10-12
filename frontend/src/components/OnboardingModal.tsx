import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X, Clock, BookOpen, ShieldCheck } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onSkip
}) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl">
        {/* Top Close / Skip */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-[var(--text-secondary)] hover:text-[#FAF5ED] transition-colors border-0 cursor-pointer"
          title="Skip Onboarding"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Artwork Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-[var(--bg-primary)]">
          <img
            src="/assets/images/profile-onboarding-artwork.svg"
            alt="StudyBloom Onboarding"
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel-secondary)] via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] text-xs font-semibold uppercase tracking-wider">
              Step {step} of 3
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#FAF5ED] tracking-tight">
                Welcome to StudyBloom AI
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                StudyBloom AI is an intelligent study-planning companion engineered to eliminate academic urgency bias. By combining supervised machine-learning priority classification with deterministic constraint scheduling, it generates conflict-free, fatigue-aware weekly study calendars.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#FAF5ED]">Multivariate Prioritization</h4>
                    <p className="text-[11px] text-[var(--text-muted)]">Balances assessment weights, deadlines, and personal module difficulty.</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#FAF5ED]">Cognitive Fatigue Guard</h4>
                    <p className="text-[11px] text-[var(--text-muted)]">Enforces 45-minute chunking with mandatory rest breaks to prevent burnout.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#FAF5ED] tracking-tight">
                Preloaded Academic Workload
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                We have initialized your workspace with four standard undergraduate modules representing diverse difficulty levels and deadlines:
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs">
                  <span className="font-semibold text-[#FAF5ED]">Advanced Linear Algebra</span>
                  <span className="badge-high">High Priority (Exam in 5d)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs">
                  <span className="font-semibold text-[#FAF5ED]">Distributed Systems & Cloud</span>
                  <span className="badge-high">High Priority (Coursework 40%)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs">
                  <span className="font-semibold text-[#FAF5ED]">Statistical Inference & Probability</span>
                  <span className="badge-medium">Medium Priority</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs">
                  <span className="font-semibold text-[#FAF5ED]">Academic Research Writing & Ethics</span>
                  <span className="badge-low">Low Priority</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                You can add, edit, or remove your own customized subjects anytime in the My Subjects workspace.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#FAF5ED] tracking-tight">
                Privacy & Research Integrity
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                StudyBloom AI strictly adheres to data minimization principles. All schedules, preferences, and subject details are stored securely in your local environment.
              </p>

              <div className="p-4 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>No Personal Identifiers Collected</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your student ID, real name, and university grades are never transmitted or monetized. The underlying AI models have been evaluated under rigorous GroupKFold cross-validation to prevent data leakage.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-[var(--accent-olive)]">
                <Check className="w-4 h-4" />
                <span>Default 16.0 hours/week study budget and morning/afternoon windows active.</span>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            <button
              onClick={onSkip}
              className="text-xs text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent border-0 cursor-pointer"
            >
              Skip setup
            </button>

            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary text-xs"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="btn-primary text-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onComplete}
                  className="btn-primary text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enter My Study Workspace</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
