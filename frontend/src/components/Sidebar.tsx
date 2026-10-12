import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  BookOpen,
  ClockAlert,
  Sparkles,
  Timer,
  HeartHandshake,
  TrendingUp,
  FlaskConical,
  MessageSquareHeart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

export type AppView =
  | 'overview'
  | 'study-plan'
  | 'calendar'
  | 'subjects'
  | 'deadlines'
  | 'planner-wizard'
  | 'focus-room'
  | 'wellbeing'
  | 'progress'
  | 'research-lab'
  | 'feedback'
  | 'settings';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
  onSignOut
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'study-plan', label: 'My Study Plan', icon: CalendarDays },
    { id: 'calendar', label: 'Weekly Calendar', icon: CalendarRange },
    { id: 'subjects', label: 'My Subjects', icon: BookOpen },
    { id: 'deadlines', label: 'Assignments & Exams', icon: ClockAlert },
    { id: 'planner-wizard', label: 'AI Study Planner', icon: Sparkles },
    { id: 'focus-room', label: 'Focus Room', icon: Timer },
    { id: 'wellbeing', label: 'Wellbeing', icon: HeartHandshake },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'research-lab', label: 'Research Lab', icon: FlaskConical },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareHeart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col glass-panel border-r border-[var(--border-subtle)] transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ minHeight: '100vh', backgroundColor: 'rgba(11, 11, 13, 0.88)' }}
    >
      {/* Brand & Collapse Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#FAF5ED]" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-base text-[#FAF5ED]">StudyBloom</span>
              <span className="block text-[9px] uppercase tracking-wider text-[var(--accent-primary)] font-semibold">AI Platform</span>
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-white/5 text-[var(--text-secondary)] hover:text-[#FAF5ED] transition-colors border-0 bg-transparent cursor-pointer ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AppView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-0 cursor-pointer text-left ${
                isActive
                  ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[#FAF5ED] hover:bg-white/5 bg-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Sign Out */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--accent-secondary)] hover:bg-white/5 transition-colors border-0 bg-transparent cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
