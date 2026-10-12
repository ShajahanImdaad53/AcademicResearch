import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Send,
  CheckCircle2,
  Star,
  Award,
  Sparkles
} from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const [q1, setQ1] = useState<number>(5); // Schedule Feasibility
  const [q2, setQ2] = useState<number>(4); // Clarity of AI Priority
  const [q3, setQ3] = useState<number>(5); // Focus Room utility
  const [q4, setQ4] = useState<number>(4); // UI Experience
  const [comments, setComments] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">User Evaluation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Research Survey</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">System Evaluation Questionnaire</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Share your experience to support the empirical evaluation chapter of this university research.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="p-12 rounded-3xl glass-panel-elevated border border-[var(--accent-olive)] text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#FAF5ED]">Evaluation Submitted Successfully</h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Thank you for participating in the StudyBloom AI evaluation protocol. Your ratings will contribute to the usability and schedule feasibility findings.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-secondary text-xs mx-auto"
          >
            Submit Another Evaluation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)] space-y-6">
          <div className="space-y-6 text-xs">
            {/* Q1 */}
            <div className="space-y-2 pb-4 border-b border-white/5">
              <label className="block font-bold text-[#FAF5ED] text-sm">
                1. How feasible and realistic are the generated weekly study blocks for your academic workload?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQ1(val)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all border cursor-pointer ${
                      q1 === val
                        ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                        : 'glass-panel border-white/10 text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
                <span className="text-[11px] text-[var(--text-muted)] ml-3">
                  (1 = Infeasible / Overwhelming, 5 = Highly Realistic & Well-Paced)
                </span>
              </div>
            </div>

            {/* Q2 */}
            <div className="space-y-2 pb-4 border-b border-white/5">
              <label className="block font-bold text-[#FAF5ED] text-sm">
                2. Are the AI priority recommendations (High / Medium / Low) and explanations clear and logical?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQ2(val)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all border cursor-pointer ${
                      q2 === val
                        ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                        : 'glass-panel border-white/10 text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
                <span className="text-[11px] text-[var(--text-muted)] ml-3">
                  (1 = Confusing / Arbitrary, 5 = Extremely Clear & Justified)
                </span>
              </div>
            </div>

            {/* Q3 */}
            <div className="space-y-2 pb-4 border-b border-white/5">
              <label className="block font-bold text-[#FAF5ED] text-sm">
                3. How effective is the cinematic Focus Room and ambient soundscape in minimizing study distractions?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQ3(val)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all border cursor-pointer ${
                      q3 === val
                        ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                        : 'glass-panel border-white/10 text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
                <span className="text-[11px] text-[var(--text-muted)] ml-3">
                  (1 = Not Useful, 5 = Highly Immersive & Focused)
                </span>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label className="block font-bold text-[#FAF5ED] text-sm">
                4. Qualitative Feedback or Suggested Algorithm Enhancements
              </label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="What did you like about the timetable? What constraints would you like to see incorporated?"
                className="input-field w-full text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-[var(--border-subtle)]">
            <button type="submit" className="btn-primary text-xs flex items-center gap-2 px-8 py-3">
              <Send className="w-4 h-4" />
              <span>Submit Evaluation</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
