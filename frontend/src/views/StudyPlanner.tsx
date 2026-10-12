import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Download,
  Check
} from 'lucide-react';
import { Subject, StudyPreferences, StudySession } from '../types';
import { generateScheduleAPI } from '../services/api';

interface StudyPlannerProps {
  subjects: Subject[];
  preferences: StudyPreferences;
  onUpdatePreferences: (prefs: StudyPreferences) => void;
  onScheduleGenerated: (sessions: StudySession[]) => void;
  onNavigateToCalendar: () => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  subjects,
  preferences,
  onUpdatePreferences,
  onScheduleGenerated,
  onNavigateToCalendar
}) => {
  const [step, setStep] = useState(1);
  const [localPrefs, setLocalPrefs] = useState<StudyPreferences>({ ...preferences });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSessions, setGeneratedSessions] = useState<StudySession[]>([]);
  const [engineMessages, setEngineMessages] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    const active = localPrefs.activeDays.includes(day)
      ? localPrefs.activeDays.filter(d => d !== day)
      : [...localPrefs.activeDays, day];
    setLocalPrefs({ ...localPrefs, activeDays: active });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setEngineMessages([]);

    try {
      const result = await generateScheduleAPI(subjects, localPrefs);
      setGeneratedSessions(result.sessions);
      setEngineMessages(result.messages);
      onUpdatePreferences(localPrefs);
      onScheduleGenerated(result.sessions);
      setHasGenerated(true);
      setStep(5); // Go to Results Step
    } catch (err) {
      setEngineMessages(['Error: Failed to generate schedule. Please verify input hours.']);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Background Ambience Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-subtle)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-xs font-bold text-[var(--accent-primary)] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Schedule Recommendation Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FAF5ED] tracking-tight">
            Personalized Study Planner Wizard
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Configure your weekly availability, module contexts, and focus session limits to generate an interleaving, conflict-free timetable.
          </p>
        </div>

        {/* Step Progression Indicators */}
        <div className="flex items-center gap-2 z-10 self-start md:self-auto">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                step === s
                  ? 'bg-[var(--accent-primary)] text-[#FAF5ED] shadow-lg shadow-[var(--accent-primary)]/30'
                  : step > s
                  ? 'bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] border border-[var(--accent-olive)]/40'
                  : 'bg-white/5 text-[var(--text-muted)] border border-white/5'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="glass-panel-elevated rounded-3xl border border-[var(--border-subtle)] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* STEP 1: SUBJECT WORKLOAD REVIEW */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#FAF5ED]">Step 1: Enrolled Academic Modules</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Review the subjects submitted for weekly scheduling. The machine-learning model uses these factors to assign priority tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <div key={sub.id} className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black/40">
                    <img src={sub.artwork} alt={sub.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#FAF5ED]">{sub.name}</span>
                      <span className={`badge-${(sub.priority || 'Medium').toLowerCase()}`}>{sub.priority || 'Medium'}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Difficulty: {sub.difficulty}/5 • Due in {sub.daysToDeadline}d • Weight: {sub.assessmentWeight}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(2)} className="btn-primary text-xs">
                <span>Next: Time Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WEEKLY TIME AVAILABILITY */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#FAF5ED]">Step 2: Weekly Time Availability</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Define the total independent study capacity and the active days you are willing to study this week.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  Total Weekly Study Hours Capacity: <strong className="text-[var(--accent-primary)] font-bold text-base">{localPrefs.availableHours} hours</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={localPrefs.availableHours}
                  onChange={(e) => setLocalPrefs({ ...localPrefs, availableHours: Number(e.target.value) })}
                  className="w-full accent-[var(--accent-primary)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] pt-1">
                  <span>5 hrs (Light)</span>
                  <span>15-20 hrs (Recommended)</span>
                  <span>40 hrs (Intensive)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  Active Study Days
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => {
                    const isActive = localPrefs.activeDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          isActive
                            ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                            : 'bg-white/5 border-white/5 text-[var(--text-muted)] hover:text-[#FAF5ED]'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  Preferred Daily Study Windows
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'morning', label: 'Morning (08:30 - 12:00)' },
                    { key: 'afternoon', label: 'Afternoon (13:00 - 17:00)' },
                    { key: 'evening', label: 'Evening (17:30 - 20:30)' },
                    { key: 'night', label: 'Night (21:00 - 23:30)' }
                  ].map(({ key, label }) => {
                    const isChecked = localPrefs.preferredWindows[key as keyof typeof localPrefs.preferredWindows];
                    return (
                      <label
                        key={key}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)]/40 text-[var(--accent-gold)]'
                            : 'bg-white/5 border-white/5 text-[var(--text-muted)] hover:text-[#FAF5ED]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setLocalPrefs({
                              ...localPrefs,
                              preferredWindows: { ...localPrefs.preferredWindows, [key]: e.target.checked }
                            })
                          }
                          className="accent-[var(--accent-gold)]"
                        />
                        <span className="text-xs font-medium">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="btn-secondary text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button onClick={() => setStep(3)} className="btn-primary text-xs">
                <span>Next: Cognitive Pacing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: COGNITIVE PACING & BREAK PREFERENCES */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#FAF5ED]">Step 3: Cognitive Pacing & Rest Breaks</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Enforce Pomodoro-style rest intervals to prevent fatigue and preserve concentration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-3">
                <label className="block text-xs font-semibold text-[#FAF5ED]">Study Session Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setLocalPrefs({ ...localPrefs, sessionDuration: mins })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        localPrefs.sessionDuration === mins
                          ? 'bg-[var(--accent-primary)] text-[#FAF5ED] border-[var(--accent-primary)]'
                          : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:text-[#FAF5ED]'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Standard recommendation: 45 minutes of continuous focus per session.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-3">
                <label className="block text-xs font-semibold text-[#FAF5ED]">Mandatory Rest Break</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setLocalPrefs({ ...localPrefs, breakDuration: mins })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        localPrefs.breakDuration === mins
                          ? 'bg-[var(--accent-gold)] text-[#0B0B0D] border-[var(--accent-gold)]'
                          : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:text-[#FAF5ED]'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Enforces cognitive rest between consecutive sessions on the timetable.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="btn-secondary text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button onClick={() => setStep(4)} className="btn-primary text-xs">
                <span>Next: Review &amp; Generate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#FAF5ED]">Step 4: Review Scheduling Context</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Confirm your parameters before triggering the AI constraint-satisfaction engine.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--text-muted)]">Target Study Budget:</span>
                <span className="font-bold text-[#FAF5ED]">{localPrefs.availableHours} hours / week</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--text-muted)]">Active Days:</span>
                <span className="font-bold text-[#FAF5ED]">{localPrefs.activeDays.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--text-muted)]">Focus Blocks &amp; Breaks:</span>
                <span className="font-bold text-[#FAF5ED]">{localPrefs.sessionDuration}m focus + {localPrefs.breakDuration}m break</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Enrolled Subjects:</span>
                <span className="font-bold text-[var(--accent-primary)]">{subjects.length} modules</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(3)} className="btn-secondary text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary text-xs py-3 px-6"
              >
                {isGenerating ? (
                  <span>Computing Optimal Slots...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate My Personalized Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS & SUCCESS CONFIRMATION */}
        {step === 5 && (
          <div className="space-y-8 animate-fade-in text-center">
            <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden glass-panel border border-[var(--accent-primary)]/40 shadow-2xl">
              <img
                src="/assets/images/plan-created-success-artwork.jpg"
                alt="Plan Generated Successfully"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-olive)]/20 border border-[var(--accent-olive)]/40 text-xs font-bold text-[var(--accent-olive)]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Weekly Schedule Generated Successfully</span>
              </span>
              <h2 className="text-2xl font-extrabold text-[#FAF5ED]">Your Conflict-Free Timetable is Ready</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                We have arranged {generatedSessions.length} non-overlapping study sessions across your active days, incorporating mandatory {localPrefs.breakDuration}-minute cognitive rest breaks.
              </p>
            </div>

            {engineMessages.length > 0 && (
              <div className="max-w-md mx-auto p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[var(--text-muted)] space-y-1 text-left">
                {engineMessages.map((msg, i) => (
                  <p key={i}>• {msg}</p>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={onNavigateToCalendar}
                className="btn-primary text-xs py-3 px-6"
              >
                <span>View Full Weekly Calendar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep(1)}
                className="btn-secondary text-xs"
              >
                <span>Reconfigure Parameters</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
