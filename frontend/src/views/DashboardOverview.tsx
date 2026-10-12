import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Timer,
  BookOpen,
  TrendingUp,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, Subject, Deadline, StudySession } from '../types';

interface DashboardOverviewProps {
  user: UserProfile;
  subjects: Subject[];
  deadlines: Deadline[];
  sessions: StudySession[];
  onOpenPlanner: () => void;
  onOpenFocusRoom: () => void;
  onToggleSessionComplete: (sessionId: string) => void;
  onViewAllSessions: () => void;
  onViewAllDeadlines: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  subjects,
  deadlines,
  sessions,
  onOpenPlanner,
  onOpenFocusRoom,
  onToggleSessionComplete,
  onViewAllSessions,
  onViewAllDeadlines
}) => {
  const completedCount = sessions.filter(s => s.isCompleted).length;
  const totalHours = sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;
  const completedHours = sessions.filter(s => s.isCompleted).reduce((sum, s) => sum + s.durationMinutes, 0) / 60;
  const urgentDeadlines = deadlines.filter(d => !d.isCompleted && d.daysRemaining <= 10);
  const highPrioritySubjects = subjects.filter(s => s.priority === 'High');

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Student Workspace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Active Term 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Your study schedule has been optimized using Random Forest priority classification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFocusRoom}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            <Timer className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>Enter Focus Room</span>
          </button>
          <button
            onClick={onOpenPlanner}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Weekly Study Budget</span>
            <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FAF5ED]">{totalHours.toFixed(1)} hrs</div>
          <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
            <span className="text-[var(--accent-olive)] font-semibold">{completedHours.toFixed(1)} hrs</span> completed this week
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Sessions Progress</span>
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-olive)]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FAF5ED]">{completedCount} / {sessions.length}</div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-gold)] h-full rounded-full transition-all duration-500"
              style={{ width: `${sessions.length > 0 ? (completedCount / sessions.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Urgent Deadlines</span>
            <AlertTriangle className="w-4 h-4 text-[var(--accent-secondary)]" />
          </div>
          <div className="text-2xl font-extrabold text-[var(--accent-secondary)]">{urgentDeadlines.length}</div>
          <div className="text-[11px] text-[var(--text-secondary)]">Due in the next 10 days</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Focus Streak</span>
            <Flame className="w-4 h-4 text-[var(--accent-gold)]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FAF5ED]">4 Days</div>
          <div className="text-[11px] text-[var(--text-muted)]">Consistent study habits</div>
        </div>
      </div>

      {/* Main Grid: Today's Sessions + Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scheduled Study Sessions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
              <h2 className="text-lg font-bold text-[#FAF5ED]">Current Weekly Timetable</h2>
            </div>
            <button
              onClick={onViewAllSessions}
              className="text-xs text-[var(--accent-primary)] hover:underline bg-transparent border-0 cursor-pointer flex items-center gap-1"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="p-8 rounded-2xl glass-panel text-center space-y-3">
                <p className="text-sm text-[var(--text-muted)]">No study sessions generated yet.</p>
                <button onClick={onOpenPlanner} className="btn-primary text-xs">
                  Generate Study Plan
                </button>
              </div>
            ) : (
              sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl glass-panel border transition-all flex items-center justify-between gap-4 ${
                    session.isCompleted
                      ? 'border-white/5 opacity-60 bg-black/40'
                      : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={session.isCompleted}
                      onChange={() => onToggleSessionComplete(session.id)}
                      className="w-4 h-4 accent-[var(--accent-primary)] cursor-pointer rounded"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${session.isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[#FAF5ED]'}`}>
                          {session.subjectName}
                        </span>
                        <span className={`badge-${session.priority.toLowerCase()}`}>
                          {session.priority}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[var(--text-secondary)]">{session.day}</span>
                        <span>•</span>
                        <span>{session.startTime} - {session.endTime} ({session.durationMinutes}m)</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {session.isCompleted ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Urgent Coursework & Subject Priorities (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Deadlines Widget */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--accent-secondary)]" />
                <h3 className="text-base font-bold text-[#FAF5ED]">Upcoming Assessments</h3>
              </div>
              <button
                onClick={onViewAllDeadlines}
                className="text-xs text-[var(--accent-primary)] hover:underline bg-transparent border-0 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {deadlines.slice(0, 3).map((dl) => (
                <div key={dl.id} className="p-3.5 rounded-xl glass-panel border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#FAF5ED]">{dl.title}</span>
                    <span className="text-[var(--accent-secondary)] font-bold">{dl.daysRemaining} days left</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span>{dl.subjectName}</span>
                    <span>Weight: {dl.weight}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Priority Allocation Breakdown */}
          <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#FAF5ED] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>AI Subject Prioritization</span>
              </h3>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Random Forest</span>
            </div>

            <div className="space-y-2.5">
              {subjects.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#FAF5ED] block">{sub.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">Difficulty: {sub.difficulty}/5 • Weight: {sub.assessmentWeight}%</span>
                  </div>
                  <span className={`badge-${(sub.priority || 'Medium').toLowerCase()}`}>
                    {sub.priority || 'Medium'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
