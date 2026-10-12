import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  Headphones,
  Music,
  CloudRain,
  Flame,
  Coffee
} from 'lucide-react';
import { Subject } from '../types';

interface FocusRoomProps {
  subjects: Subject[];
  onLogFocusSession?: (subjectName: string, minutes: number) => void;
}

type TimerMode = 'focus' | 'deep' | 'short_break' | 'long_break';

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  deep: 45 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export const FocusRoom: React.FC<FocusRoomProps> = ({ subjects, onLogFocusSession }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(3);
  const [totalMinutesFocused, setTotalMinutesFocused] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeSound, setActiveSound] = useState<'rain' | 'whitenoise' | 'lofi' | 'none'>('none');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Web Audio Context reference for gentle ambient generative sounds
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Update duration when mode changes
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      const completedMins = Math.round(MODE_DURATIONS[mode] / 60);
      if (mode === 'focus' || mode === 'deep') {
        setSessionsCompletedToday((c) => c + 1);
        setTotalMinutesFocused((m) => m + completedMins);
        const sub = subjects.find(s => s.id === selectedSubjectId);
        if (onLogFocusSession && sub) {
          onLogFocusSession(sub.name, completedMins);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, selectedSubjectId, subjects, onLogFocusSession]);

  // Audio Generator using Web Audio API for relaxing brown/pink noise
  useEffect(() => {
    if (activeSound === 'none' || isMuted) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate brown noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain adjustment
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      whiteNoise.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [activeSound, isMuted]);

  const toggleSound = (sound: 'rain' | 'whitenoise' | 'lofi') => {
    if (activeSound === sound) {
      setActiveSound('none');
    } else {
      setActiveSound(sound);
      setIsMuted(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = MODE_DURATIONS[mode];
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div
      className={`relative w-full min-h-screen p-6 md:p-8 space-y-6 flex flex-col justify-between transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-8' : ''
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(11, 11, 13, 0.88), rgba(11, 11, 13, 0.94)), url('/assets/images/focus-room-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel-elevated border border-[var(--border-subtle)] z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)]">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#FAF5ED] leading-none">Focus Room</h1>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Cinematic Deep Study Immersion</p>
          </div>
        </div>

        {/* Focus Subject Picker */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">Active Module:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="input-field text-xs py-1.5 px-3 bg-black/60 max-w-xs"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.priority || 'Medium'})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent border-0 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Dial Center */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 z-10 space-y-8 animate-fade-in">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/60 border border-[var(--border-subtle)] backdrop-blur-lg">
          <button
            onClick={() => switchMode('focus')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all border-0 cursor-pointer ${
              mode === 'focus'
                ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                : 'text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => switchMode('deep')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all border-0 cursor-pointer ${
              mode === 'deep'
                ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                : 'text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent'
            }`}
          >
            Deep Work (45m)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-0 cursor-pointer ${
              mode === 'short_break'
                ? 'bg-[var(--accent-gold)] text-black'
                : 'text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-0 cursor-pointer ${
              mode === 'long_break'
                ? 'bg-[var(--accent-olive)] text-black'
                : 'text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent'
            }`}
          >
            Long Rest (15m)
          </button>
        </div>

        {/* Circular SVG Timer */}
        <div className="relative flex items-center justify-center">
          <svg className="w-80 h-80 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke={
                mode === 'focus' || mode === 'deep'
                  ? 'var(--accent-primary)'
                  : mode === 'short_break'
                  ? 'var(--accent-gold)'
                  : 'var(--accent-olive)'
              }
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>

          {/* Dial Center Content */}
          <div className="absolute flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-5xl md:text-6xl font-black text-[#FAF5ED] font-mono tracking-tight drop-shadow-md">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>

            <span className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]">
              {mode === 'focus' || mode === 'deep' ? currentSubject?.name || 'Focused Study' : 'Rest & Recharge'}
            </span>

            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
              isRunning ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'bg-white/10 text-[var(--text-muted)]'
            }`}>
              {isRunning ? 'Session Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTimeLeft(MODE_DURATIONS[mode])}
            className="p-3.5 rounded-full glass-panel hover:bg-white/10 text-[var(--text-secondary)] hover:text-[#FAF5ED] border border-[var(--border-subtle)] cursor-pointer transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[#FAF5ED] font-bold text-sm flex items-center gap-2.5 shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer border-0"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Audio & Stats Dock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl glass-panel-elevated border border-[var(--border-subtle)] z-10 text-xs">
        {/* Ambient Sound Generators */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 text-[var(--text-muted)] font-semibold shrink-0">
            <Headphones className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>Soundscape:</span>
          </div>

          <button
            onClick={() => toggleSound('rain')}
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSound === 'rain'
                ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'glass-panel border-white/5 text-[var(--text-secondary)] hover:text-[#FAF5ED]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Gentle Rain</span>
          </button>

          <button
            onClick={() => toggleSound('whitenoise')}
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSound === 'whitenoise'
                ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'glass-panel border-white/5 text-[var(--text-secondary)] hover:text-[#FAF5ED]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Deep Brown Noise</span>
          </button>

          {activeSound !== 'none' && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[#FAF5ED] bg-transparent border-0 cursor-pointer ml-auto"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Daily Focus Stats */}
        <div className="flex items-center justify-end gap-6 text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-olive)]" />
            <span>Completed: <strong className="text-[#FAF5ED]">{sessionsCompletedToday} blocks</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>Time Focused: <strong className="text-[#FAF5ED]">{totalMinutesFocused} mins</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
