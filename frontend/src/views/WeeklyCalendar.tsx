import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { StudySession, Subject } from '../types';

interface WeeklyCalendarProps {
  sessions: StudySession[];
  subjects: Subject[];
  onToggleSessionComplete: (sessionId: string) => void;
  onAddCustomSession: (session: StudySession) => void;
  onDeleteSession: (sessionId: string) => void;
  onOpenPlanner: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  sessions,
  subjects,
  onToggleSessionComplete,
  onAddCustomSession,
  onDeleteSession,
  onOpenPlanner,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New session modal state
  const [newDay, setNewDay] = useState<string>('Monday');
  const [newSubjectId, setNewSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newStartTime, setNewStartTime] = useState<string>('10:00');
  const [newDuration, setNewDuration] = useState<number>(45);

  const filteredSessions = sessions.filter((s) => {
    if (selectedSubjectFilter !== 'all' && s.subjectId !== selectedSubjectFilter) return false;
    if (selectedDayFilter !== 'all' && s.day !== selectedDayFilter) return false;
    return true;
  });

  const exportCSV = () => {
    if (sessions.length === 0) return;
    const headers = ['Day', 'Subject', 'Start Time', 'End Time', 'Duration (min)', 'Priority', 'Status', 'Notes'];
    const rows = sessions.map((s) => [
      `"${s.day}"`,
      `"${s.subjectName}"`,
      `"${s.startTime}"`,
      `"${s.endTime}"`,
      s.durationMinutes,
      `"${s.priority}"`,
      s.isCompleted ? '"Completed"' : '"Pending"',
      `"${s.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `studybloom_weekly_schedule_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === newSubjectId);
    if (!sub) return;

    // Calculate end time
    const [h, m] = newStartTime.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = startMins + newDuration;
    const endH = Math.floor(endMins / 60) % 24;
    const endM = endMins % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const newSession: StudySession = {
      id: `SES_MANUAL_${Date.now()}`,
      day: newDay,
      subjectId: sub.id,
      subjectName: sub.name,
      startTime: newStartTime,
      endTime,
      durationMinutes: newDuration,
      priority: sub.priority || 'Medium',
      isCompleted: false,
      notes: 'Manually added custom study block.'
    };

    onAddCustomSession(newSession);
    setShowAddModal(false);
  };

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Timetable Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Active Schedule</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">Weekly Study Calendar</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Optimized timetable ensuring non-overlapping blocks, study-window alignment, and scheduled rest breaks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Add Custom Session</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={sessions.length === 0}
            className="btn-secondary text-xs flex items-center gap-2 disabled:opacity-40"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenPlanner}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Re-Generate Plan</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Filter className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="font-semibold text-[var(--text-secondary)]">Filter:</span>
          </div>

          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="input-field text-xs py-1.5 px-3 bg-[var(--bg-secondary)]"
          >
            <option value="all">All Subjects ({sessions.length})</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>

          <select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value)}
            className="input-field text-xs py-1.5 px-3 bg-[var(--bg-secondary)]"
          >
            <option value="all">All Days</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[var(--text-muted)]">
          Showing <strong className="text-[#FAF5ED]">{filteredSessions.length}</strong> scheduled sessions
        </div>
      </div>

      {/* Main Timetable View */}
      {sessions.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel border border-[var(--border-subtle)] text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xl">
            <img
              src="/assets/images/planner-empty-state.jpg"
              alt="No Sessions"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-[#FAF5ED]">No Scheduled Study Blocks</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            You haven't generated a timetable yet. Use our AI Study Planner to allocate your weekly study budget based on deadlines and machine learning priority.
          </p>
          <button onClick={onOpenPlanner} className="btn-primary text-xs mx-auto">
            Generate Weekly Timetable
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {DAYS.map((day) => {
            const daySessions = filteredSessions.filter((s) => s.day === day);
            const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;

            return (
              <div
                key={day}
                className={`rounded-2xl p-4 glass-panel border transition-all flex flex-col min-h-[400px] ${
                  isToday
                    ? 'border-[var(--accent-primary)]/60 bg-[var(--accent-primary)]/5'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#FAF5ED]">{day}</h3>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {daySessions.length} {daySessions.length === 1 ? 'block' : 'blocks'}
                    </span>
                  </div>
                  {isToday && (
                    <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-white">
                      Today
                    </span>
                  )}
                </div>

                {/* Day Session List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {daySessions.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-center p-3 border border-dashed border-white/10 rounded-xl">
                      <span className="text-[11px] text-[var(--text-muted)]">Rest Day / Free</span>
                    </div>
                  ) : (
                    daySessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-xl border transition-all text-xs space-y-2 relative group ${
                          session.isCompleted
                            ? 'bg-black/40 border-white/5 opacity-60'
                            : 'glass-panel-elevated border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`font-bold leading-tight ${session.isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[#FAF5ED]'}`}>
                            {session.subjectName}
                          </span>
                          <button
                            onClick={() => onDeleteSession(session.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-opacity bg-transparent border-0 cursor-pointer"
                            title="Remove session"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-mono">
                          <Clock className="w-3 h-3 text-[var(--accent-gold)]" />
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className={`badge-${session.priority.toLowerCase()} text-[10px] py-0.5`}>
                            {session.priority}
                          </span>

                          <button
                            onClick={() => onToggleSessionComplete(session.id)}
                            className={`flex items-center gap-1 text-[11px] font-semibold border-0 bg-transparent cursor-pointer transition-colors ${
                              session.isCompleted ? 'text-[var(--accent-olive)]' : 'text-[var(--text-muted)] hover:text-[#FAF5ED]'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{session.isCompleted ? 'Done' : 'Mark'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-panel-elevated p-6 border border-[var(--border-subtle)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-bold text-[#FAF5ED]">Add Custom Study Session</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-muted)] hover:text-[#FAF5ED] text-sm bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Subject</label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="input-field w-full text-xs"
                  required
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.priority || 'Medium'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Day of Week</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="input-field w-full text-xs"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Duration (minutes)</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="input-field w-full text-xs"
                >
                  <option value={25}>25 minutes (Pomodoro)</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes (Standard)</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes (Deep Work)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
