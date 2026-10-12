import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Info,
  Clock,
  Award,
  AlertCircle,
  BarChart2
} from 'lucide-react';
import { Subject, PriorityLevel } from '../types';

interface SubjectManagementProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onOpenPlanner: () => void;
}

const CATEGORY_ARTWORKS: Record<string, string> = {
  Mathematics: '/assets/images/subject-mathematics-artwork.jpg',
  Programming: '/assets/images/subject-programming-artwork.jpg',
  Statistics: '/assets/images/subject-statistics-artwork.jpg',
  Writing: '/assets/images/subject-writing-artwork.svg',
  General: '/assets/images/subject-mathematics-artwork.jpg',
};

export const SubjectManagement: React.FC<SubjectManagementProps> = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onOpenPlanner,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<'Mathematics' | 'Programming' | 'Statistics' | 'Writing' | 'General'>('Mathematics');
  const [formDifficulty, setFormDifficulty] = useState<number>(3);
  const [formPriorPerformance, setFormPriorPerformance] = useState<'High' | 'Medium' | 'Low' | 'None'>('Medium');
  const [formDaysToDeadline, setFormDaysToDeadline] = useState<number>(14);
  const [formAssessmentWeight, setFormAssessmentWeight] = useState<number>(25);
  const [formTargetHours, setFormTargetHours] = useState<number>(4.0);

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormName('');
    setFormCategory('Mathematics');
    setFormDifficulty(3);
    setFormPriorPerformance('Medium');
    setFormDaysToDeadline(14);
    setFormAssessmentWeight(25);
    setFormTargetHours(4.0);
    setShowModal(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setFormName(sub.name);
    setFormCategory(sub.category);
    setFormDifficulty(sub.difficulty);
    setFormPriorPerformance(sub.priorPerformance);
    setFormDaysToDeadline(sub.daysToDeadline);
    setFormAssessmentWeight(sub.assessmentWeight);
    setFormTargetHours(sub.targetHours);
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Compute heuristic priority
    let computedPriority: PriorityLevel = 'Medium';
    let explanation = '';

    if (formDaysToDeadline <= 7 || (formDifficulty >= 4 && formAssessmentWeight >= 30)) {
      computedPriority = 'High';
      explanation = `Assigned HIGH priority because of near deadline (${formDaysToDeadline} days) and high cognitive load / assessment weight.`;
    } else if (formDaysToDeadline >= 21 && formDifficulty <= 2) {
      computedPriority = 'Low';
      explanation = `Assigned LOW priority because deadline is distant (${formDaysToDeadline} days) and subject difficulty is low.`;
    } else {
      computedPriority = 'Medium';
      explanation = `Assigned MEDIUM priority for steady pacing and moderate assessment stakes.`;
    }

    if (editingSubject) {
      onUpdateSubject({
        ...editingSubject,
        name: formName,
        category: formCategory,
        difficulty: formDifficulty,
        priorPerformance: formPriorPerformance,
        daysToDeadline: formDaysToDeadline,
        assessmentWeight: formAssessmentWeight,
        targetHours: formTargetHours,
        artwork: CATEGORY_ARTWORKS[formCategory] || CATEGORY_ARTWORKS.General,
        priority: computedPriority,
        explanation
      });
    } else {
      const newSubject: Subject = {
        id: `SUB_${Date.now()}`,
        name: formName,
        category: formCategory,
        difficulty: formDifficulty,
        priorPerformance: formPriorPerformance,
        daysToDeadline: formDaysToDeadline,
        assessmentWeight: formAssessmentWeight,
        targetHours: formTargetHours,
        artwork: CATEGORY_ARTWORKS[formCategory] || CATEGORY_ARTWORKS.General,
        priority: computedPriority,
        explanation
      };
      onAddSubject(newSubject);
    }

    setShowModal(false);
  };

  const totalTargetHours = subjects.reduce((sum, s) => sum + s.targetHours, 0);
  const avgDifficulty = subjects.length > 0
    ? (subjects.reduce((sum, s) => sum + s.difficulty, 0) / subjects.length).toFixed(1)
    : '0';

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Curriculum Portfolio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Coursework & Modules</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">Enrolled Subjects</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage subject difficulty, prior academic performance, assessment weightings, and machine learning priority targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Subject</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/15 flex items-center justify-center text-[var(--accent-primary)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Enrolled Subjects</div>
            <div className="text-xl font-bold text-[#FAF5ED]">{subjects.length} Course Modules</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/15 flex items-center justify-center text-[var(--accent-gold)]">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Average Difficulty</div>
            <div className="text-xl font-bold text-[#FAF5ED]">{avgDifficulty} / 5.0</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-olive)]/15 flex items-center justify-center text-[var(--accent-olive)]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Target Weekly Hours</div>
            <div className="text-xl font-bold text-[#FAF5ED]">{totalTargetHours.toFixed(1)} hrs/week</div>
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="rounded-3xl glass-panel border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all overflow-hidden flex flex-col group shadow-lg"
          >
            {/* Subject Visual Header */}
            <div className="relative h-44 w-full overflow-hidden bg-black/40">
              <img
                src={subject.artwork}
                alt={subject.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/40 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#FAF5ED] border border-white/10">
                  {subject.category}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className={`badge-${(subject.priority || 'Medium').toLowerCase()} shadow-md`}>
                  {subject.priority || 'Medium'} Priority
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-base font-extrabold text-[#FAF5ED] leading-tight line-clamp-1 drop-shadow-md">
                  {subject.name}
                </h3>
              </div>
            </div>

            {/* Subject Details Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Metric Bars */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Difficulty Level:</span>
                    <span className="font-bold text-[#FAF5ED] flex items-center gap-1">
                      {subject.difficulty} / 5
                      <span className="text-[10px] text-[var(--accent-gold)]">
                        {'★'.repeat(subject.difficulty)}{'☆'.repeat(5 - subject.difficulty)}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Assessment Weight:</span>
                    <span className="font-semibold text-[#FAF5ED]">{subject.assessmentWeight}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Prior Grade / Mastery:</span>
                    <span className="font-semibold text-[#FAF5ED]">{subject.priorPerformance}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Days to Next Exam/Task:</span>
                    <span className={`font-semibold ${subject.daysToDeadline <= 7 ? 'text-[var(--accent-secondary)]' : 'text-[#FAF5ED]'}`}>
                      {subject.daysToDeadline} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Target Study Budget:</span>
                    <span className="font-bold text-[var(--accent-primary)]">{subject.targetHours} hrs/wk</span>
                  </div>
                </div>

                {/* AI Explanation Snippet */}
                {subject.explanation && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <p className="line-clamp-2 leading-relaxed">{subject.explanation}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => openEditModal(subject)}
                  className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-secondary)] hover:text-[#FAF5ED] transition-colors border-0 bg-transparent cursor-pointer"
                  title="Edit Subject"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteSubject(subject.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-colors border-0 bg-transparent cursor-pointer"
                  title="Delete Subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel-elevated p-6 md:p-8 border border-[var(--border-subtle)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-lg font-bold text-[#FAF5ED]">
                  {editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Subject properties are processed by the Machine Learning priority model.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--text-muted)] hover:text-[#FAF5ED] text-sm bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-secondary)] mb-1">Subject Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="input-field w-full text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Category / Domain</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="input-field w-full text-xs"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Programming">Programming</option>
                    <option value="Statistics">Statistics</option>
                    <option value="Writing">Writing & Ethics</option>
                    <option value="General">General Academic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Perceived Difficulty (1-5)</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(Number(e.target.value))}
                    className="input-field w-full text-xs"
                  >
                    <option value={1}>1 - Very Easy</option>
                    <option value={2}>2 - Easy</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - Challenging</option>
                    <option value={5}>5 - Very Difficult</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Prior Performance</label>
                  <select
                    value={formPriorPerformance}
                    onChange={(e) => setFormPriorPerformance(e.target.value as any)}
                    className="input-field w-full text-xs"
                  >
                    <option value="High">High (Distinction / A)</option>
                    <option value="Medium">Medium (Credit / B)</option>
                    <option value="Low">Low (Pass / C / Struggles)</option>
                    <option value="None">None (First time taking)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Days to Examination / Task</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={formDaysToDeadline}
                    onChange={(e) => setFormDaysToDeadline(Number(e.target.value))}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Assessment Weight (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formAssessmentWeight}
                    onChange={(e) => setFormAssessmentWeight(Number(e.target.value))}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-secondary)] mb-1">Target Hours / Week</label>
                  <input
                    type="number"
                    step={0.5}
                    min={0.5}
                    max={25}
                    value={formTargetHours}
                    onChange={(e) => setFormTargetHours(Number(e.target.value))}
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
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
