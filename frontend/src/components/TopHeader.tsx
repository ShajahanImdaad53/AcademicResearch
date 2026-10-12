import React, { useState } from 'react';
import { Bell, User, Cpu, Timer, Menu, LogOut, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface TopHeaderProps {
  pageTitle: string;
  user: UserProfile;
  modelStatus: string;
  onOpenFocusRoom: () => void;
  onSignOut: () => void;
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  pageTitle,
  user,
  modelStatus,
  onOpenFocusRoom,
  onSignOut,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-[var(--border-subtle)] px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Toggle & Page Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[#FAF5ED] hover:bg-white/5 border-0 bg-transparent cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#FAF5ED] tracking-tight">{pageTitle}</h1>
            <p className="text-xs text-[var(--text-muted)] hidden sm:block">
              StudyBloom AI / {pageTitle}
            </p>
          </div>
        </div>

        {/* Right: Engine Status, Quick Action, Alerts, User Profile */}
        <div className="flex items-center gap-4">
          {/* AI Engine Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-pulse" />
            <span>AI Engine: <strong className="text-[var(--text-primary)]">{modelStatus}</strong></span>
          </div>

          {/* Quick Focus Room Action */}
          <button
            onClick={onOpenFocusRoom}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/25 text-xs font-semibold cursor-pointer transition-all"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Focus Room</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[#FAF5ED] hover:bg-white/5 border-0 bg-transparent cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-panel-elevated rounded-xl shadow-2xl p-4 border border-[var(--border-subtle)] z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <span className="font-semibold text-xs text-[#FAF5ED]">System Notifications</span>
                  <span className="text-[10px] text-[var(--accent-primary)] font-medium">2 Active</span>
                </div>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-olive)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">Timetable Verified</p>
                      <p className="text-[var(--text-muted)] text-[11px]">All study blocks are conflict-free with 15m rest breaks.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Cpu className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">Priority Recalibrated</p>
                      <p className="text-[var(--text-muted)] text-[11px]">Linear Algebra deadline due in 5 days prioritized High.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/5 border-0 bg-transparent cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-gold)] flex items-center justify-center font-bold text-xs text-[#FAF5ED] shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-semibold text-[#FAF5ED] leading-none">{user.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">Year {user.yearOfStudy} • {user.degree}</span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 glass-panel-elevated rounded-xl shadow-2xl p-2 border border-[var(--border-subtle)] z-50 animate-fade-in text-xs">
                <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                  <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{user.email}</p>
                </div>
                <div className="py-1">
                  <div className="px-3 py-2 text-[var(--text-secondary)]">
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">Academic Program</span>
                    {user.degree} (Year {user.yearOfStudy})
                  </div>
                </div>
                <div className="pt-1 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={onSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[var(--accent-secondary)] hover:bg-white/5 border-0 bg-transparent cursor-pointer text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
