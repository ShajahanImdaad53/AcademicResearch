import React, { useState } from 'react';
import {
  ClockAlert,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  Filter
} from 'lucide-react';
import { Deadline, Subject } from '../types';

interface AssignmentsExamsProps {
  deadlines: Deadline[];
  subjects: Subject[];
  onAddDeadline: (deadline: Deadline) => void;
  onToggleDeadlineComplete: (deadlineId: string) => void;
  onDeleteDeadline: (deadlineId: string) => void;
}

export const AssignmentsExams: React.FC<AssignmentsExamsProps> = ({
  deadlines,
  subjects,
  onAddDeadline,
  onToggleDeadlineComplete,
  onDeleteDeadline,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form states
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSubjectId, setFormSubjectId] = useState<string>(subjects[0]?.id || '');
  const [formDueDate, setFormDueDate] = useState<string>('');
  const [formWeight, setFormWeight] = useState<number>(20);

  const filteredDeadlines = deadlines.filter((d) => {
    if (filter === 'upcoming') return !d.isCompleted;
    if (filter === 'completed') return d.isCompleted;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === formSubjectId);
    if (!sub || !formDueDate) return;

    // Calculate days remaining
    const targetTime = new Date(formDueDate).getTime();
    const currentTime = new Date().getTime();
    const diffDays = Math.max(0, Math.ceil((targetTime - currentTime) / (1000 * 60 * 60 * 24)));

    const newDl: Deadline = {
      id: `DL_${Date.now()}`,
      subjectId: sub.id,
      subjectName: sub.name,
      title: formTitle,
      dueDate: formDueDate,
      daysRemaining: diffDays,
      weight: formWeight,
      isCompleted: false,
    };

    onAddDeadline(newDl);
    setShowModal(false);
    setFormTitle('');
  };

  const pendingCount = deadlines.filter((d) => !d.isCompleted).length;
  const criticalCount = deadlines.filter((d) => !d.isCompleted && d.daysRemaining <= 5).length;
  const completedCount = deadlines.filter((d) => d.isCompleted).length;

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Academic Milestones</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Coursework & Exam Registry</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">Assignments & Examinations</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            High-stakes deadlines directly feed into the recommendation engine to calibrate study hours and urgency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assessment</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/15 flex items-center justify-center text-[var(--accent-secondary)]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Critical Assessments (≤5 Days)</div>
            <div className="text-xl font-bold text-[var(--accent-secondary)]">{criticalCount} Urgent Items</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/15 flex items-center justify-center text-[var(--accent-primary)]">
            <ClockAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Pending Deadlines</div>
            <div className="text-xl font-bold text-[#FAF5ED]">{pendingCount} Active Tasks</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-olive)]/15 flex items-center justify-center text-[var(--accent-olive)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Completed Milestones</div>
            <div className="text-xl font-bold text-[#FAF5ED]">{completedCount} Finished</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center gap-2">
          {(['upcoming', 'all', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border-0 cursor-pointer transition-all ${
                filter === tab
                  ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                  : 'text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent'
              }`}
            >
              {tab} ({
                tab === 'upcoming' ? pendingCount : tab === 'completed' ? completedCount : deadlines.length
              })
            </button>
          ))}
        </div>
      </div>

      {/* Main Deadline Cards */}
      {filteredDeadlines.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel border border-[var(--border-subtle)] text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-[var(--border-subtle)] p-4 flex items-center justify-center bg-black/40">
            <img
              src="/assets/images/deadline-empty-state.svg"
              alt="No Deadlines"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-[#FAF5ED]">No Milestones Recorded</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            You have no deadlines matching this filter. Keep your schedule proactive by adding your syllabus dates early.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-xs mx-auto">
            Add Assessment Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeadlines.map((dl) => {
            const isCritical = !dl.isCompleted && dl.daysRemaining <= 5;
            const isSoon = !dl.isCompleted && dl.daysRemaining > 5 && dl.daysRemaining <= 10;

            return (
              <div
                key={dl.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                  dl.isCompleted
                    ? 'glass-panel bg-black/30 border-white/5 opacity-60'
                    : isCritical
                    ? 'glass-panel-elevated border-[var(--accent-secondary)]/50 shadow-[var(--accent-secondary)]/10'
                    : 'glass-panel border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[var(--text-secondary)]">
                      {dl.subjectName}
                    </span>

                    <button
                      onClick={() => onDeleteDeadline(dl.id)}
                      className="text-[var(--text-muted)] hover:text-[var(--accent-secondary)] p-1 bg-transparent border-0 cursor-pointer transition-colors"
                      title="Delete assessment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className={`text-base font-bold leading-tight ${dl.isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[#FAF5ED]'}`}>
                      {dl.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        <span>Due Date:</span>
                      </span>
                      <span className="font-mono text-[#FAF5ED]">{dl.dueDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                        <span>Weight:</span>
                      </span>
                      <span className="font-semibold text-[#FAF5ED]">{dl.weight}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    {dl.isCompleted ? (
                      <span className="text-[11px] font-semibold text-[var(--accent-olive)] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className={`text-xs font-bold ${
                        isCritical ? 'text-[var(--accent-secondary)]' : isSoon ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-gold)]'
                      }`}>
                        {dl.daysRemaining === 0 ? 'Due Today!' : `${dl.daysRemaining} days remaining`}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleDeadlineComplete(dl.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      dl.isCompleted
                        ? 'bg-white/5 text-[var(--text-muted)] border-white/10'
                        : 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/25'
                    }`}
                  >
                    {dl.isCompleted ? 'Mark Pending' : 'Mark Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Assessment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-panel-elevated p-6 md:p-8 border border-[var(--border-subtle)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-lg font-bold text-[#FAF5ED]">Add Assessment</h3>
                <p className="text-xs text-[var(--text-muted)]">Record an exam, coursework, or project deadline.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--text-muted)] hover:text-[#FAF5ED] text-sm bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">Assessment Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination / Raft Lab Report"
                  className="input-field w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">Related Subject</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="input-field w-full text-xs"
                  required
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Weight (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
