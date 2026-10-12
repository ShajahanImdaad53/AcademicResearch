export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface Subject {
  id: string;
  name: string;
  difficulty: number; // 1 - 5
  priorPerformance: 'High' | 'Medium' | 'Low' | 'None';
  daysToDeadline: number;
  assessmentWeight: number; // 0 - 100
  targetHours: number;
  category: 'Mathematics' | 'Programming' | 'Statistics' | 'Writing' | 'General';
  artwork: string;
  priority?: PriorityLevel;
  explanation?: string;
}

export interface Deadline {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  daysRemaining: number;
  weight: number;
  isCompleted: boolean;
}

export interface StudySession {
  id: string;
  day: string; // 'Monday', 'Tuesday', ...
  subjectId: string;
  subjectName: string;
  startTime: string; // '09:00'
  endTime: string;   // '09:45'
  durationMinutes: number;
  priority: PriorityLevel;
  isCompleted: boolean;
  notes?: string;
}

export interface StudyPreferences {
  availableHours: number;
  sessionDuration: number; // 15, 30, 45, 60 minutes
  breakDuration: number;   // 5, 10, 15, 20 minutes
  preferredWindows: {
    morning: boolean;   // 08:00 - 12:00
    afternoon: boolean; // 12:00 - 17:00
    evening: boolean;   // 17:00 - 21:00
    night: boolean;     // 21:00 - 01:00
  };
  activeDays: string[]; // ['Monday', 'Tuesday', ...]
}

export interface UserProfile {
  name: string;
  email: string;
  degree: string;
  yearOfStudy: number;
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

export interface ModelMetric {
  Model: string;
  Accuracy: number;
  'Precision (Macro)': number;
  'Recall (Macro)': number;
  'F1-Score (Macro)': number;
}
