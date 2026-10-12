import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  CalendarCheck2,
  Clock,
  Layers,
  FlaskConical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onNavigateToResearch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onNavigateToResearch
}) => {
  return (
    <div className="relative w-full min-h-screen bg-[var(--bg-primary)] overflow-x-hidden text-[#FAF5ED]">
      {/* SECTION 1: HERO */}
      <section id="hero" className="relative w-full min-h-[92vh] flex items-center pt-8 pb-20 px-6 lg:px-12 border-b border-[var(--border-subtle)]">
        {/* Subtle Atmospheric Ambient Background */}
        <div className="absolute top-0 right-0 w-3/5 h-full opacity-35 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-primary)]/20 filter blur-[120px]" />
          <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-[var(--accent-gold)]/15 filter blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Editorial Headline & Actions (5 cols) */}
          <div className="lg:col-span-6 space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Study Planning</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FAF5ED] leading-[1.08]">
              Your goals.<br />
              <span className="text-[var(--accent-primary)]">Your rhythm.</span><br />
              Your study plan.
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Meet your personal AI study companion. Organize subjects, manage assessment deadlines, and create a realistic weekly study plan around your availability and academic priorities.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="btn-primary text-base py-3.5 px-7"
              >
                <span>Create My Study Plan</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary text-base py-3.5 px-6"
              >
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Credibility badges */}
            <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-6 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>GroupKFold ML Prioritization</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Zero Session Overlaps</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-olive)]" />
                <span>Zero Data Leakage Protocol</span>
              </div>
            </div>
          </div>

          {/* Right Column: Original 3D Hero Artwork Sculpture (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] max-h-[580px] rounded-3xl overflow-hidden glass-panel border border-[var(--border-subtle)] shadow-2xl group">
              <img
                src="/assets/images/landing-hero-sculpture.jpg"
                alt="StudyBloom Kinetic 3D Study Sculpture"
                className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.02] transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Subtle Overlay Card on Sculpture */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel-elevated border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-primary)] block">Algorithmic Engine</span>
                  <span className="text-sm font-bold text-[#FAF5ED]">Constraint-Aware Weekly Timetabling</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--accent-olive)]/15 border border-[var(--accent-olive)]/30 text-[11px] font-bold text-[var(--accent-olive)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Conflict-Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (THE DILEMMA OF STATIC PLANNING) */}
      <section id="problem" className="w-full py-24 px-6 lg:px-12 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">The Academic Dilemma</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAF5ED] tracking-tight">
              Why Traditional Calendars Fail University Students
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              Standard calendar and to-do apps are completely passive. They require students to manually decide when and how long to study, leaving them vulnerable to cognitive fatigue and planning illusions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4 hover:border-[var(--accent-primary)]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/15 border border-[var(--accent-secondary)]/30 flex items-center justify-center text-[var(--accent-secondary)]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF5ED]">The Urgency Bias Trap</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Students naturally default to cramming for whichever assessment is closest on the calendar, often ignoring high-weighted or difficult modules due two weeks later.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4 hover:border-[var(--accent-gold)]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF5ED]">Cognitive Overload & Cramming</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Prolonged, unbroken study sessions lead to sharp drops in retention and acute burnout. Without enforced breaks, study schedules quickly collapse under pressure.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4 hover:border-[var(--accent-olive)]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-olive)]/15 border border-[var(--accent-olive)]/30 flex items-center justify-center text-[var(--accent-olive)]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF5ED]">The AI Semantic Gap</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Educational Data Mining predicts student grades, but fails to translate predictive insights into actionable, operational daily study sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS (THE TWO-STAGE HYBRID ARCHITECTURE) */}
      <section id="how-it-works" className="w-full py-24 px-6 lg:px-12 border-b border-[var(--border-subtle)] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Methodology</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAF5ED] tracking-tight">
              A Two-Stage Hybrid Recommendation Architecture
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              We separate subjective priority pattern-recognition from exact calendar mathematics, guaranteeing that timetables are always conflict-free and fatigue-aware.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Stage 1 Box */}
            <div className="p-8 rounded-3xl glass-panel-elevated border border-[var(--accent-primary)]/30 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent-primary)]/20 text-xs font-bold text-[var(--accent-primary)] uppercase">
                  Stage 1: Machine Learning Prioritization
                </div>
                <h3 className="text-2xl font-bold text-[#FAF5ED]">Predictive Priority Classification</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Supervised classifiers (Random Forest, Decision Tree, Logistic Regression) evaluate multivariate student workload features:
                </p>
                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span><strong>Difficulty Rating (1–5):</strong> Subjective cognitive load per module.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span><strong>Days to Deadline:</strong> Temporal urgency metric.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span><strong>Assessment Weight (%):</strong> Relative impact on final academic degree.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span><strong>Output:</strong> Categorical Priority Tier (High = 3x, Medium = 2x, Low = 1x).</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-[var(--accent-coral)] font-mono">
                Priority Score = (Weight / Days) * Difficulty
              </div>
            </div>

            {/* Stage 2 Box */}
            <div className="p-8 rounded-3xl glass-panel border border-[var(--border-subtle)] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent-gold)]/20 text-xs font-bold text-[var(--accent-gold)] uppercase">
                  Stage 2: Constraint-Satisfaction Timetable
                </div>
                <h3 className="text-2xl font-bold text-[#FAF5ED]">Deterministic Greedy Timetabling</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  The scheduling engine converts prioritized hour quotas into non-overlapping study sessions placed strictly within user-designated windows:
                </p>
                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                    <span><strong>Strict Non-Overlap Guarantee:</strong> Hard mathematical bounds prevent collisions.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                    <span><strong>Cognitive Rest Breaks:</strong> Enforces 15-minute breaks between consecutive blocks.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                    <span><strong>Interleaving:</strong> Alternates modules across active days to enhance memory retention.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                    <span><strong>Capacity Protection:</strong> Total study time never overflows available hours.</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-[var(--accent-olive)] font-mono">
                Hard Constraints: (t_a ∩ t_b = ∅) &amp; Total_Hours ≤ Capacity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SUBJECT ARTWORK SHOWCASE */}
      <section id="features" className="w-full py-24 px-6 lg:px-12 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Discipline Coverage</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAF5ED] tracking-tight">
                Designed for Challenging Undergraduate Curricula
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                From quantitative proof-writing to software systems and empirical statistics, StudyBloom adapts to every academic module.
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="btn-secondary text-xs self-start md:self-auto"
            >
              <span>Explore My Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--border-subtle)] group hover:border-[var(--accent-primary)]/50 transition-all">
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src="/assets/images/subject-mathematics-artwork.jpg"
                  alt="Mathematics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-base text-[#FAF5ED]">Mathematics</h4>
                <p className="text-xs text-[var(--text-muted)]">Linear algebra, calculus, and discrete proofs requiring deep conceptual focus.</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--border-subtle)] group hover:border-[var(--accent-primary)]/50 transition-all">
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src="/assets/images/subject-programming-artwork.jpg"
                  alt="Programming"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-base text-[#FAF5ED]">Computer Science</h4>
                <p className="text-xs text-[var(--text-muted)]">Algorithms, cloud systems, and coursework debugging sessions.</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--border-subtle)] group hover:border-[var(--accent-primary)]/50 transition-all">
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src="/assets/images/subject-statistics-artwork.jpg"
                  alt="Statistics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-base text-[#FAF5ED]">Statistics</h4>
                <p className="text-xs text-[var(--text-muted)]">Probability, hypothesis testing, and quantitative data modeling.</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--border-subtle)] group hover:border-[var(--accent-primary)]/50 transition-all">
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src="/assets/images/subject-writing-artwork.svg"
                  alt="Writing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-base text-[#FAF5ED]">Academic Writing</h4>
                <p className="text-xs text-[var(--text-muted)]">Literature syntheses, thesis drafting, and structured ethical arguments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: RESEARCH METHODOLOGY HIGHLIGHT */}
      <section id="research" className="w-full py-24 px-6 lg:px-12 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-subtle)] shadow-2xl">
            <img
              src="/assets/images/research-lab-artwork.jpg"
              alt="StudyBloom Research Lab"
              className="w-full h-full object-cover filter brightness-100"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Academic Rigor</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAF5ED] tracking-tight">
              An Audited University Research Project
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              StudyBloom AI is an undergraduate research project developed with full academic transparency. The models are benchmarked under 5-fold participant-grouped cross-validation to eliminate data leakage.
            </p>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#FAF5ED]">
                <span>Top Model Accuracy (Random Forest)</span>
                <span className="text-[var(--accent-primary)] font-bold">80.0%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#FAF5ED]">
                <span>Best Balanced Priority F1 (Logistic Regression)</span>
                <span className="text-[var(--accent-gold)] font-bold">0.5858</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#FAF5ED]">
                <span>Automated Unit &amp; Integration Tests</span>
                <span className="text-[var(--accent-olive)] font-bold">18 Passed (100%)</span>
              </div>
            </div>

            <button
              onClick={onNavigateToResearch}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Explore Research Lab &amp; Benchmark Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CALL TO ACTION */}
      <section className="w-full py-28 px-6 lg:px-12 text-center bg-gradient-to-b from-[var(--bg-primary)] to-[#151218]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-gold)] flex items-center justify-center shadow-xl shadow-[var(--accent-primary)]/20">
            <Sparkles className="w-7 h-7 text-[#FAF5ED]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FAF5ED] tracking-tight leading-tight">
            Take Control of Your Study Schedule Today
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Eliminate urgency bias, stop cramming, and study with clarity. Experience AI-driven subject prioritization and conflict-free timetables tailored to your weekly rhythm.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="btn-primary text-base py-4 px-8 w-full sm:w-auto"
            >
              <span>Launch StudyBloom AI</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onSignIn}
              className="btn-secondary text-base py-4 px-8 w-full sm:w-auto"
            >
              <span>Sign In to Existing Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
