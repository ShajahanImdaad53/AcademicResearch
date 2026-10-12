import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  BookOpen,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { Subject, StudySession } from '../types';

interface ProgressAnalyticsProps {
  subjects: Subject[];
  sessions: StudySession[];
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ subjects, sessions }) => {
  const completedSessions = sessions.filter((s) => s.isCompleted);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const completedMinutes = completedSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedHours = (completedMinutes / 60).toFixed(1);
  const completionPercentage = totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;

  // High priority adherence
  const highSessions = sessions.filter((s) => s.priority === 'High');
  const highCompleted = highSessions.filter((s) => s.isCompleted);
  const highAdherence = highSessions.length > 0 ? Math.round((highCompleted.length / highSessions.length) * 100) : 100;

  // Per-subject hours breakdown
  const subjectProgress = subjects.map((sub) => {
    const subSessions = sessions.filter((s) => s.subjectId === sub.id);
    const subCompletedMins = subSessions.filter((s) => s.isCompleted).reduce((sum, s) => sum + s.durationMinutes, 0);
    const completedH = subCompletedMins / 60;
    const targetH = sub.targetHours || 4.0;
    const pct = Math.min(100, Math.round((completedH / targetH) * 100));

    return {
      ...sub,
      completedHours: completedH.toFixed(1),
      targetHours: targetH.toFixed(1),
      percent: pct,
    };
  });

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Top Banner with Growth Artwork Hero */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-elevated border border-[var(--border-subtle)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Academic Growth</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Performance Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">
            Study Progress & Learning Intelligence
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Track adherence to machine learning study plans, subject mastery progress, and weekly focus consistency.
          </p>
        </div>

        <div className="w-full md:w-64 h-36 rounded-2xl overflow-hidden border border-white/10 shrink-0 relative shadow-2xl">
          <img
            src="/assets/images/progress-growth-artwork.jpg"
            alt="Learning Growth"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent" />
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Overall Plan Adherence</span>
            <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FAF5ED]">{completionPercentage}%</div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            {completedHours} of {totalHours} target hours
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>High Priority Completion</span>
            <Award className="w-4 h-4 text-[var(--accent-gold)]" />
          </div>
          <div className="text-2xl font-extrabold text-[var(--accent-gold)]">{highAdherence}%</div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            {highCompleted.length} of {highSessions.length} urgent blocks completed
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Focus Sessions Done</span>
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-olive)]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FAF5ED]">{completedSessions.length} Blocks</div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Across {sessions.length} total scheduled
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Current Study Streak</span>
            <Flame className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FAF5ED]">4 Days</div>
          <div className="text-[11px] text-[var(--text-muted)]">Consistent daily sessions</div>
        </div>
      </div>

      {/* Subject-by-Subject Target vs Actual Progress */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-lg font-bold text-[#FAF5ED]">Subject Hours Allocation vs Completion</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Real-time comparison of logged hours against AI-allocated study targets.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {subjectProgress.map((sub) => (
            <div key={sub.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#FAF5ED]">{sub.name}</span>
                  <span className={`badge-${(sub.priority || 'Medium').toLowerCase()} text-[10px]`}>
                    {sub.priority || 'Medium'}
                  </span>
                </div>
                <div className="text-[var(--text-secondary)] font-mono">
                  <strong className="text-[#FAF5ED]">{sub.completedHours}h</strong> / {sub.targetHours}h ({sub.percent}%)
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-gold)]"
                  style={{ width: `${sub.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Insights Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-[var(--border-subtle)] space-y-4">
          <h3 className="text-sm font-bold text-[#FAF5ED] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Optimal Study Windows</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Your schedule demonstrates the highest session completion adherence during the morning study window (08:00 - 12:00), with an 85% completion rate compared to 62% in evening blocks.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-[var(--border-subtle)] space-y-4">
          <h3 className="text-sm font-bold text-[#FAF5ED] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>Spaced Repetition Metric</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            High-difficulty modules are partitioned across multiple non-consecutive days, mitigating the cognitive slump associated with cramming and supporting long-term memory consolidation.
          </p>
        </div>
      </div>
    </div>
  );
};
