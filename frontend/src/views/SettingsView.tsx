import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Clock,
  Shield,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save
} from 'lucide-react';
import { UserProfile, StudyPreferences } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  preferences: StudyPreferences;
  onUpdateUser: (user: UserProfile) => void;
  onUpdatePreferences: (preferences: StudyPreferences) => void;
  onResetData: () => void;
  onClearSessions: () => void;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  preferences,
  onUpdateUser,
  onUpdatePreferences,
  onResetData,
  onClearSessions,
}) => {
  // Form states
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [degree, setDegree] = useState<string>(user.degree);
  const [yearOfStudy, setYearOfStudy] = useState<number>(user.yearOfStudy);

  const [availableHours, setAvailableHours] = useState<number>(preferences.availableHours);
  const [sessionDuration, setSessionDuration] = useState<number>(preferences.sessionDuration);
  const [breakDuration, setBreakDuration] = useState<number>(preferences.breakDuration);
  const [preferredWindows, setPreferredWindows] = useState(preferences.preferredWindows);
  const [activeDays, setActiveDays] = useState<string[]>(preferences.activeDays);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [researchConsent, setResearchConsent] = useState<boolean>(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      degree,
      yearOfStudy,
    });
    onUpdatePreferences({
      availableHours,
      sessionDuration,
      breakDuration,
      preferredWindows,
      activeDays,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      if (activeDays.length > 1) {
        setActiveDays(activeDays.filter((d) => d !== day));
      }
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const exportAllJSON = () => {
    const backupData = {
      user: { name, email, degree, yearOfStudy },
      preferences: { availableHours, sessionDuration, breakDuration, preferredWindows, activeDays },
      exportDate: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `studybloom_profile_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="relative w-full min-h-screen p-6 md:p-8 space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-primary)]">Preferences & Profile</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Configuration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FAF5ED] tracking-tight">System Settings</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Customize your academic degree info, scheduling window constraints, and research data export.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent-olive)]/20 border border-[var(--accent-olive)] text-[var(--accent-olive)] text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card */}
        <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <User className="w-4 h-4 text-[var(--accent-primary)]" />
            <h2 className="text-base font-bold text-[#FAF5ED]">Student Academic Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">University Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">Degree Program / Major</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="input-field w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(Number(e.target.value))}
                className="input-field w-full text-xs"
              >
                <option value={1}>Year 1 (Freshman / First Year)</option>
                <option value={2}>Year 2 (Sophomore / Second Year)</option>
                <option value={3}>Year 3 (Junior / Third Year)</option>
                <option value={4}>Year 4 (Senior / Honours)</option>
                <option value={5}>Postgraduate / Master's / PhD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Study Timing Preferences */}
        <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Clock className="w-4 h-4 text-[var(--accent-gold)]" />
            <h2 className="text-base font-bold text-[#FAF5ED]">Algorithm Constraints & Scheduling Windows</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                Weekly Study Capacity (Hours)
              </label>
              <input
                type="number"
                min={2}
                max={60}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="input-field w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                Study Session Duration
              </label>
              <select
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value))}
                className="input-field w-full text-xs"
              >
                <option value={25}>25 minutes (Pomodoro Sprint)</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes (Standard Focus)</option>
                <option value={60}>60 minutes (Deep Work)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-secondary)] mb-1">
                Rest Break Duration
              </label>
              <select
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="input-field w-full text-xs"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes (Recommended)</option>
                <option value={20}>20 minutes</option>
              </select>
            </div>
          </div>

          {/* Time Windows */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Preferred Study Windows
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl glass-panel border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferredWindows.morning}
                  onChange={(e) => setPreferredWindows({ ...preferredWindows, morning: e.target.checked })}
                  className="accent-[var(--accent-primary)] rounded"
                />
                <div>
                  <span className="font-semibold text-[#FAF5ED] block">Morning</span>
                  <span className="text-[10px] text-[var(--text-muted)]">08:00 - 12:00</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl glass-panel border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferredWindows.afternoon}
                  onChange={(e) => setPreferredWindows({ ...preferredWindows, afternoon: e.target.checked })}
                  className="accent-[var(--accent-primary)] rounded"
                />
                <div>
                  <span className="font-semibold text-[#FAF5ED] block">Afternoon</span>
                  <span className="text-[10px] text-[var(--text-muted)]">12:00 - 17:00</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl glass-panel border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferredWindows.evening}
                  onChange={(e) => setPreferredWindows({ ...preferredWindows, evening: e.target.checked })}
                  className="accent-[var(--accent-primary)] rounded"
                />
                <div>
                  <span className="font-semibold text-[#FAF5ED] block">Evening</span>
                  <span className="text-[10px] text-[var(--text-muted)]">17:00 - 21:00</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl glass-panel border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferredWindows.night}
                  onChange={(e) => setPreferredWindows({ ...preferredWindows, night: e.target.checked })}
                  className="accent-[var(--accent-primary)] rounded"
                />
                <div>
                  <span className="font-semibold text-[#FAF5ED] block">Night</span>
                  <span className="text-[10px] text-[var(--text-muted)]">21:00 - 01:00</span>
                </div>
              </label>
            </div>
          </div>

          {/* Active Days */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Available Study Days
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {ALL_DAYS.map((day) => {
                const isActive = activeDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                        : 'bg-white/5 border-white/5 text-[var(--text-muted)] hover:text-[#FAF5ED]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Research & Data Management Card */}
        <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-[var(--border-subtle)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Shield className="w-4 h-4 text-[var(--accent-olive)]" />
            <h2 className="text-base font-bold text-[#FAF5ED]">Research Privacy & Data Management</h2>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
            <input
              type="checkbox"
              id="consent"
              checked={researchConsent}
              onChange={(e) => setResearchConsent(e.target.checked)}
              className="accent-[var(--accent-primary)] rounded mt-0.5"
            />
            <label htmlFor="consent" className="cursor-pointer space-y-1">
              <span className="font-bold text-[#FAF5ED] block">Participate in University Research Evaluation</span>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Allow anonymized timetable feasibility metrics to be utilized in aggregate for the final dissertation analysis. No personally identifiable student information is ever stored or transmitted externally.
              </p>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={exportAllJSON}
              className="btn-secondary text-xs flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Export Full Profile JSON</span>
            </button>

            <button
              type="button"
              onClick={onClearSessions}
              className="btn-secondary text-xs flex items-center gap-2 text-[var(--accent-secondary)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Current Timetable</span>
            </button>

            <button
              type="button"
              onClick={onResetData}
              className="btn-secondary text-xs flex items-center gap-2 text-[var(--text-muted)] hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo Defaults</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button type="submit" className="btn-primary text-xs flex items-center gap-2 px-8 py-3">
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
