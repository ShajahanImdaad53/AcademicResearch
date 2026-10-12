import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, AppView } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { OnboardingModal } from './components/OnboardingModal';

// Views
import { LandingPage } from './views/LandingPage';
import { AuthModal } from './views/AuthModal';
import { DashboardOverview } from './views/DashboardOverview';
import { WeeklyCalendar } from './views/WeeklyCalendar';
import { SubjectManagement } from './views/SubjectManagement';
import { AssignmentsExams } from './views/AssignmentsExams';
import { StudyPlanner } from './views/StudyPlanner';
import { FocusRoom } from './views/FocusRoom';
import { WellbeingReset } from './views/WellbeingReset';
import { ProgressAnalytics } from './views/ProgressAnalytics';
import { ResearchLab } from './views/ResearchLab';
import { FeedbackView } from './views/FeedbackView';
import { SettingsView } from './views/SettingsView';

// Types & Data
import { UserProfile, Subject, Deadline, StudyPreferences, StudySession } from './types';
import {
  INITIAL_SUBJECTS,
  INITIAL_DEADLINES,
  INITIAL_PREFERENCES,
  INITIAL_SESSIONS,
} from './data/defaultData';

export function App() {
  // Authentication & Profile State
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    degree: 'BSc Computer Science',
    yearOfStudy: 3,
    isAuthenticated: false, // Starts on landing page; instant sign-in available
    isOnboarded: false,
  });

  const [currentView, setCurrentView] = useState<AppView>('overview');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [modelStatus, setModelStatus] = useState<string>('Random Forest (Active)');

  // Main Application Data State
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [preferences, setPreferences] = useState<StudyPreferences>(INITIAL_PREFERENCES);
  const [sessions, setSessions] = useState<StudySession[]>(INITIAL_SESSIONS);

  // Authentication Handlers
  const handleAuthSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setShowAuthModal(false);
    if (!newUser.isOnboarded) {
      setShowOnboarding(true);
    }
  };

  const handleSignOut = () => {
    setUser((prev) => ({ ...prev, isAuthenticated: false }));
    setCurrentView('overview');
  };

  // Session Handlers
  const handleToggleSessionComplete = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const handleAddCustomSession = (newSession: StudySession) => {
    setSessions((prev) => [...prev, newSession]);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleClearSessions = () => {
    setSessions([]);
  };

  // Subject Handlers
  const handleAddSubject = (subject: Subject) => {
    setSubjects((prev) => [...prev, subject]);
  };

  const handleUpdateSubject = (updated: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  // Deadline Handlers
  const handleAddDeadline = (deadline: Deadline) => {
    setDeadlines((prev) => [...prev, deadline]);
  };

  const handleToggleDeadlineComplete = (deadlineId: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === deadlineId ? { ...d, isCompleted: !d.isCompleted } : d))
    );
  };

  const handleDeleteDeadline = (deadlineId: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== deadlineId));
  };

  // Reset to Demo Defaults
  const handleResetData = () => {
    setSubjects(INITIAL_SUBJECTS);
    setDeadlines(INITIAL_DEADLINES);
    setPreferences(INITIAL_PREFERENCES);
    setSessions(INITIAL_SESSIONS);
  };

  // Titles mapping
  const viewTitles: Record<AppView, string> = {
    overview: 'Workspace Overview',
    'study-plan': 'My Study Plan',
    calendar: 'Weekly Timetable',
    subjects: 'Enrolled Subjects',
    deadlines: 'Assignments & Exams',
    'planner-wizard': 'AI Study Planner',
    'focus-room': 'Cinematic Focus Room',
    wellbeing: 'Wellbeing & Mental Reset',
    progress: 'Learning Intelligence & Progress',
    'research-lab': 'Research Lab & Benchmarks',
    feedback: 'Evaluation Survey',
    settings: 'Configuration & Settings',
  };

  // UN-AUTHENTICATED STATE: SHOW EDITORIAL LANDING PAGE
  if (!user.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[#FAF5ED]">
        <Navbar
          onSignInClick={() => setShowAuthModal(true)}
          onGetStartedClick={() => setShowAuthModal(true)}
          onNavigateSection={(sectionId) => {
            const el = document.getElementById(sectionId);
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <LandingPage
          onGetStarted={() => setShowAuthModal(true)}
          onSignIn={() => setShowAuthModal(true)}
          onNavigateToResearch={() => {
            setUser((prev) => ({ ...prev, isAuthenticated: true }));
            setCurrentView('research-lab');
          }}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // AUTHENTICATED STATE: FULL RICH APPLICATION WORKSPACE
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FAF5ED] overflow-x-hidden">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setMobileMenuOpen(false);
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          pageTitle={viewTitles[currentView] || 'StudyBloom AI'}
          user={user}
          modelStatus={modelStatus}
          onOpenFocusRoom={() => setCurrentView('focus-room')}
          onSignOut={handleSignOut}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto">
          {currentView === 'overview' && (
            <DashboardOverview
              user={user}
              subjects={subjects}
              deadlines={deadlines}
              sessions={sessions}
              onOpenPlanner={() => setCurrentView('planner-wizard')}
              onOpenFocusRoom={() => setCurrentView('focus-room')}
              onToggleSessionComplete={handleToggleSessionComplete}
              onViewAllSessions={() => setCurrentView('calendar')}
              onViewAllDeadlines={() => setCurrentView('deadlines')}
            />
          )}

          {(currentView === 'study-plan' || currentView === 'calendar') && (
            <WeeklyCalendar
              sessions={sessions}
              subjects={subjects}
              onToggleSessionComplete={handleToggleSessionComplete}
              onAddCustomSession={handleAddCustomSession}
              onDeleteSession={handleDeleteSession}
              onOpenPlanner={() => setCurrentView('planner-wizard')}
            />
          )}

          {currentView === 'subjects' && (
            <SubjectManagement
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
              onOpenPlanner={() => setCurrentView('planner-wizard')}
            />
          )}

          {currentView === 'deadlines' && (
            <AssignmentsExams
              deadlines={deadlines}
              subjects={subjects}
              onAddDeadline={handleAddDeadline}
              onToggleDeadlineComplete={handleToggleDeadlineComplete}
              onDeleteDeadline={handleDeleteDeadline}
            />
          )}

          {currentView === 'planner-wizard' && (
            <StudyPlanner
              subjects={subjects}
              preferences={preferences}
              onUpdatePreferences={(newPrefs) => setPreferences(newPrefs)}
              onScheduleGenerated={(newSessions) => setSessions(newSessions)}
              onNavigateToCalendar={() => setCurrentView('calendar')}
            />
          )}

          {currentView === 'focus-room' && (
            <FocusRoom
              subjects={subjects}
              onLogFocusSession={(subName, mins) => {
                console.log(`Focus session completed: ${subName} (${mins}m)`);
              }}
            />
          )}

          {currentView === 'wellbeing' && <WellbeingReset />}

          {currentView === 'progress' && (
            <ProgressAnalytics subjects={subjects} sessions={sessions} />
          )}

          {currentView === 'research-lab' && <ResearchLab />}

          {currentView === 'feedback' && <FeedbackView />}

          {currentView === 'settings' && (
            <SettingsView
              user={user}
              preferences={preferences}
              onUpdateUser={setUser}
              onUpdatePreferences={setPreferences}
              onResetData={handleResetData}
              onClearSessions={handleClearSessions}
            />
          )}
        </main>
      </div>

      {/* Onboarding Modal for New Students */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          setUser((prev) => ({ ...prev, isOnboarded: true }));
        }}
        onSkip={() => {
          setShowOnboarding(false);
          setUser((prev) => ({ ...prev, isOnboarded: true }));
        }}
      />
    </div>
  );
}

export default App;
