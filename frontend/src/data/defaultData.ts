import { Subject, Deadline, StudyPreferences, ModelMetric, StudySession } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'SUB_01',
    name: 'Advanced Linear Algebra',
    difficulty: 4,
    priorPerformance: 'Medium',
    daysToDeadline: 5,
    assessmentWeight: 35.0,
    targetHours: 6.0,
    category: 'Mathematics',
    artwork: '/assets/images/subject-mathematics-artwork.jpg',
    priority: 'High',
    explanation: 'Assigned HIGH priority because of urgent deadline in 5 day(s), high assessment weight (35.0%), and high perceived difficulty (4/5).'
  },
  {
    id: 'SUB_02',
    name: 'Distributed Systems & Cloud',
    difficulty: 4,
    priorPerformance: 'Low',
    daysToDeadline: 9,
    assessmentWeight: 40.0,
    targetHours: 5.5,
    category: 'Programming',
    artwork: '/assets/images/subject-programming-artwork.jpg',
    priority: 'High',
    explanation: 'Assigned HIGH priority because of high assessment weight (40.0%), and prior performance level (\'Low\') requiring active review.'
  },
  {
    id: 'SUB_03',
    name: 'Statistical Inference & Probability',
    difficulty: 3,
    priorPerformance: 'High',
    daysToDeadline: 14,
    assessmentWeight: 20.0,
    targetHours: 3.0,
    category: 'Statistics',
    artwork: '/assets/images/subject-statistics-artwork.jpg',
    priority: 'Medium',
    explanation: 'Assigned MEDIUM priority because steady pacing is required, an approaching deadline in 14 day(s), and moderate difficulty.'
  },
  {
    id: 'SUB_04',
    name: 'Academic Research Writing & Ethics',
    difficulty: 2,
    priorPerformance: 'High',
    daysToDeadline: 28,
    assessmentWeight: 15.0,
    targetHours: 1.5,
    category: 'Writing',
    artwork: '/assets/images/subject-writing-artwork.svg',
    priority: 'Low',
    explanation: 'Assigned LOW priority because deadline is far away (28 days) and it is perceived as relatively easy.'
  }
];

export const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'DL_01',
    subjectId: 'SUB_01',
    subjectName: 'Advanced Linear Algebra',
    title: 'Midterm Examination (Eigenvalues & SVD)',
    dueDate: '2026-10-16',
    daysRemaining: 5,
    weight: 35.0,
    isCompleted: false
  },
  {
    id: 'DL_02',
    subjectId: 'SUB_02',
    subjectName: 'Distributed Systems & Cloud',
    title: 'Consensus Protocols Coursework (Raft/Paxos)',
    dueDate: '2026-10-20',
    daysRemaining: 9,
    weight: 40.0,
    isCompleted: false
  },
  {
    id: 'DL_03',
    subjectId: 'SUB_03',
    subjectName: 'Statistical Inference & Probability',
    title: 'Hypothesis Testing & Bayesian Problem Set',
    dueDate: '2026-10-25',
    daysRemaining: 14,
    weight: 20.0,
    isCompleted: false
  }
];

export const INITIAL_PREFERENCES: StudyPreferences = {
  availableHours: 16.0,
  sessionDuration: 45,
  breakDuration: 15,
  preferredWindows: {
    morning: true,
    afternoon: true,
    evening: false,
    night: false
  },
  activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'SES_01',
    day: 'Monday',
    subjectId: 'SUB_01',
    subjectName: 'Advanced Linear Algebra',
    startTime: '08:30',
    endTime: '09:15',
    durationMinutes: 45,
    priority: 'High',
    isCompleted: true,
    notes: 'Reviewed Matrix diagonalization and symmetric matrices.'
  },
  {
    id: 'SES_02',
    day: 'Monday',
    subjectId: 'SUB_02',
    subjectName: 'Distributed Systems & Cloud',
    startTime: '09:30',
    endTime: '10:15',
    durationMinutes: 45,
    priority: 'High',
    isCompleted: true,
    notes: 'Debugged Raft leader election heartbeat logic.'
  },
  {
    id: 'SES_03',
    day: 'Tuesday',
    subjectId: 'SUB_01',
    subjectName: 'Advanced Linear Algebra',
    startTime: '08:30',
    endTime: '09:15',
    durationMinutes: 45,
    priority: 'High',
    isCompleted: false
  },
  {
    id: 'SES_04',
    day: 'Tuesday',
    subjectId: 'SUB_03',
    subjectName: 'Statistical Inference & Probability',
    startTime: '09:30',
    endTime: '10:15',
    durationMinutes: 45,
    priority: 'Medium',
    isCompleted: false
  },
  {
    id: 'SES_05',
    day: 'Wednesday',
    subjectId: 'SUB_02',
    subjectName: 'Distributed Systems & Cloud',
    startTime: '08:30',
    endTime: '09:15',
    durationMinutes: 45,
    priority: 'High',
    isCompleted: false
  },
  {
    id: 'SES_06',
    day: 'Thursday',
    subjectId: 'SUB_01',
    subjectName: 'Advanced Linear Algebra',
    startTime: '08:30',
    endTime: '09:15',
    durationMinutes: 45,
    priority: 'High',
    isCompleted: false
  },
  {
    id: 'SES_07',
    day: 'Friday',
    subjectId: 'SUB_04',
    subjectName: 'Academic Research Writing & Ethics',
    startTime: '09:30',
    endTime: '10:15',
    durationMinutes: 45,
    priority: 'Low',
    isCompleted: false
  }
];

export const AUTHENTIC_RESEARCH_METRICS: ModelMetric[] = [
  {
    Model: 'Baseline (Rule-Based Heuristic)',
    Accuracy: 0.9000,
    'Precision (Macro)': 0.9612,
    'Recall (Macro)': 0.6857,
    'F1-Score (Macro)': 0.7316
  },
  {
    Model: 'Random Forest Classifier',
    Accuracy: 0.8000,
    'Precision (Macro)': 0.4697,
    'Recall (Macro)': 0.5451,
    'F1-Score (Macro)': 0.5037
  },
  {
    Model: 'Logistic Regression',
    Accuracy: 0.7800,
    'Precision (Macro)': 0.7743,
    'Recall (Macro)': 0.5942,
    'F1-Score (Macro)': 0.5858
  },
  {
    Model: 'Decision Tree Classifier',
    Accuracy: 0.7400,
    'Precision (Macro)': 0.4272,
    'Recall (Macro)': 0.5188,
    'F1-Score (Macro)': 0.4599
  },
  {
    Model: 'K-Nearest Neighbors (KNN)',
    Accuracy: 0.7200,
    'Precision (Macro)': 0.4288,
    'Recall (Macro)': 0.4712,
    'F1-Score (Macro)': 0.4474
  }
];
