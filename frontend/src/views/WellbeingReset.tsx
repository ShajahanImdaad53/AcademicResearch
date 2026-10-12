import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Droplet,
  Eye,
  ShieldCheck,
  Zap,
  Smile
} from 'lucide-react';

type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

export const WellbeingReset: React.FC = () => {
  // 4-7-8 Breathing Guide state
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathingPhase>('Rest');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // Wellbeing Check-in sliders
  const [energyLevel, setEnergyLevel] = useState<number>(6);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [waterGlasses, setWaterGlasses] = useState<number>(4);

  // Breathing interval
  useEffect(() => {
    let timer: any = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (phase === 'Rest' || phase === 'Exhale') {
              setPhase('Inhale');
              return 4;
            } else if (phase === 'Inhale') {
              setPhase('Hold');
              return 7;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              setCyclesCompleted((c) => c + 1);
              return 8;
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, phase]);

  const startBreathing = () => {
    setIsBreathingActive(true);
    setPhase('Inhale');
    setPhaseSecondsLeft(4);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setPhase('Rest');
    setPhaseSecondsLeft(4);
  };

  const resetBreathing = () => {
    stopBreathing();
    setCyclesCompleted(0);
  };

  // Compute adaptive recommendation
  const getWellbeingRecommendation = () => {
    if (stressLevel >= 8 && energyLevel <= 4) {
      return {
        title: 'High Cognitive Fatigue Detected',
        text: 'Your current workload indicators suggest elevated burnout risk. We recommend capping study blocks to 30 minutes, shifting intense problem sets to tomorrow morning, and taking a 20-minute screen-free walk.',
        color: 'var(--accent-secondary)'
      };
    }
    if (stressLevel >= 7) {
      return {
        title: 'Moderate Exam Anxiety',
        text: 'Prioritize active recall over passive re-reading. Do 2 rounds of the 4-7-8 breathing exercise before your upcoming study sessions to lower cortisol levels.',
        color: 'var(--accent-primary)'
      };
    }
    if (energyLevel >= 7) {
      return {
        title: 'Optimal Deep Work State',
        text: 'Your cognitive capacity is high. This is an ideal window for high-difficulty problem sets (Linear Algebra or Distributed Systems). Schedule 45-minute deep focus sprints.',
        color: 'var(--accent-olive)'
      };
    }
    return {
      title: 'Balanced Academic Pacing',
      text: 'Maintain consistent hydration, protect your 7+ hours of sleep, and take 10-minute breaks between study blocks to prevent cumulative fatigue.',
      color: 'var(--accent-gold)'
    };
  };

  const advice = getWellbeingRecommendation();

  return (
    <div
      className="relative w-full min-h-screen p-6 md:p-8 space-y-8 animate-fade-in"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 11, 13, 0.88), rgba(11, 11, 13, 0.94)), url('/assets/images/wellbeing-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-gold)]">Student Health</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
            <span className="text-xs text-[var(--text-muted)]">Cognitive Restoration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">Wellbeing & Mental Reset</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Preventing cognitive burnout through guided respiratory pacing, posture resets, and fatigue tracking.
          </p>
        </div>
      </div>

      {/* Main Grid: Breathing Circle + Stress Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 4-7-8 Guided Breathing Circle (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)] flex flex-col items-center justify-between space-y-8 shadow-xl">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--accent-primary)]">
              4-7-8 Parasympathetic Reset
            </span>
            <h2 className="text-xl font-bold text-[#FAF5ED]">Physiological Sigh & Relaxation</h2>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Inhale 4s through nose, hold 7s, exhale 8s through mouth to rapidly downregulate heart rate.
            </p>
          </div>

          {/* Animated Expanding Breathing Sphere */}
          <div className="relative w-64 h-64 flex items-center justify-center my-4">
            {/* Outer Pulsing Glow Circle */}
            <div
              className={`absolute rounded-full transition-all duration-1000 ${
                phase === 'Inhale'
                  ? 'w-64 h-64 bg-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)] scale-110 shadow-2xl shadow-[var(--accent-primary)]/30'
                  : phase === 'Hold'
                  ? 'w-64 h-64 bg-[var(--accent-gold)]/20 border-2 border-[var(--accent-gold)] scale-110 shadow-2xl shadow-[var(--accent-gold)]/30 animate-pulse'
                  : phase === 'Exhale'
                  ? 'w-44 h-44 bg-[var(--accent-olive)]/20 border-2 border-[var(--accent-olive)] scale-90 shadow-lg'
                  : 'w-48 h-48 bg-white/5 border border-white/10'
              }`}
            />

            {/* Inner Sphere */}
            <div className="relative z-10 text-center space-y-1">
              <span className="text-3xl font-extrabold text-[#FAF5ED] block tracking-tight">
                {phase === 'Rest' ? 'Ready' : phase}
              </span>
              <span className="text-2xl font-mono font-bold text-[var(--accent-gold)]">
                {isBreathingActive ? `${phaseSecondsLeft}s` : 'Press Start'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
                Cycle {cyclesCompleted}
              </span>
            </div>
          </div>

          {/* Breathing Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetBreathing}
              className="p-3 rounded-full glass-panel hover:bg-white/10 text-[var(--text-muted)] hover:text-[#FAF5ED] border border-[var(--border-subtle)] cursor-pointer"
              title="Reset Cycles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {isBreathingActive ? (
              <button
                onClick={stopBreathing}
                className="btn-secondary text-xs flex items-center gap-2 px-6 py-2.5"
              >
                <Pause className="w-4 h-4" />
                <span>Pause Guide</span>
              </button>
            ) : (
              <button
                onClick={startBreathing}
                className="btn-primary text-xs flex items-center gap-2 px-6 py-2.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Breathing Exercise</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Cognitive Fatigue & Burnout Check-In (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Zap className="w-4 h-4 text-[var(--accent-gold)]" />
              <h3 className="text-base font-bold text-[#FAF5ED]">Workload & Fatigue Check-In</h3>
            </div>

            {/* Energy Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)] font-semibold">Cognitive Energy:</span>
                <span className="font-bold text-[#FAF5ED]">{energyLevel} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-[var(--accent-primary)] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>Drained</span>
                <span>Optimal Peak</span>
              </div>
            </div>

            {/* Stress Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)] font-semibold">Academic Stress:</span>
                <span className="font-bold text-[var(--accent-secondary)]">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-[var(--accent-secondary)] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>Low / Relaxed</span>
                <span>Critical Deadlines</span>
              </div>
            </div>

            {/* Adaptive Recommendation Card */}
            <div
              className="p-4 rounded-2xl border space-y-2 text-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: advice.color,
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: advice.color }} />
                <h4 className="font-bold text-[#FAF5ED]">{advice.title}</h4>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {advice.text}
              </p>
            </div>
          </div>

          {/* Micro Habits Quick Check */}
          <div className="p-6 rounded-3xl glass-panel border border-[var(--border-subtle)] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
              Daily Physical Micro-Habits
            </h4>

            <div className="space-y-3 text-xs">
              {/* Hydration */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <Droplet className="w-4 h-4 text-[var(--accent-primary)]" />
                  <div>
                    <span className="font-semibold text-[#FAF5ED] block">Hydration</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{waterGlasses} of 8 glasses logged</span>
                  </div>
                </div>
                <button
                  onClick={() => setWaterGlasses((w) => Math.min(8, w + 1))}
                  className="px-3 py-1 rounded-lg bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-xs font-bold hover:bg-[var(--accent-primary)]/25 cursor-pointer"
                >
                  +1 Glass
                </button>
              </div>

              {/* 20-20-20 Rule */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-[var(--accent-olive)]" />
                  <div>
                    <span className="font-semibold text-[#FAF5ED] block">20-20-20 Screen Rule</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Look 20ft away every 20 mins</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[var(--accent-olive)]">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
