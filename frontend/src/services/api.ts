import { Subject, StudyPreferences, StudySession, PriorityLevel } from '../types';

const API_BASE = 'http://localhost:8000/api';

export async function checkBackendHealth(): Promise<{ online: boolean; modelLoaded: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, modelLoaded: data.model_loaded };
    }
  } catch {
    // API not reachable, fallback to client-side engine
  }
  return { online: false, modelLoaded: false };
}

export async function predictSubjectPriorityAPI(subject: Subject): Promise<{ priority: PriorityLevel; explanation: string; source: string }> {
  try {
    const res = await fetch(`${API_BASE}/predict-priority`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Subject_ID: subject.id,
        Subject_Name: subject.name,
        Difficulty_Rating: subject.difficulty,
        Prior_Performance: subject.priorPerformance,
        Days_To_Deadline: subject.daysToDeadline,
        Assessment_Weight: subject.assessmentWeight,
        Available_Hours: subject.targetHours
      }),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      return {
        priority: data.priority as PriorityLevel,
        explanation: data.explanation,
        source: data.source
      };
    }
  } catch {
    // Local fallback
  }

  // Client-side Heuristic calculation matching python logic
  const days = Math.max(1, subject.daysToDeadline);
  const score = (subject.assessmentWeight / days) * subject.difficulty;
  let priority: PriorityLevel = 'Low';
  if (score >= 15.0) priority = 'High';
  else if (score >= 5.0) priority = 'Medium';

  let explanation = '';
  if (priority === 'High') {
    explanation = `Assigned HIGH priority because of high urgency (score ${score.toFixed(1)}), imminent deadline in ${days} day(s), and weighting of ${subject.assessmentWeight}%.`;
  } else if (priority === 'Medium') {
    explanation = `Assigned MEDIUM priority because steady pacing is needed (score ${score.toFixed(1)}).`;
  } else {
    explanation = `Assigned LOW priority because deadline is distant or weighting is low.`;
  }

  return { priority, explanation, source: 'Client-Side Heuristic Fallback' };
}

export async function generateScheduleAPI(
  subjects: Subject[],
  preferences: StudyPreferences
): Promise<{ sessions: StudySession[]; messages: string[] }> {
  // Try remote backend first
  try {
    const formattedWindows: { day: string; start: string; end: string }[] = [];
    const windowTimes: { [k: string]: { start: string; end: string } } = {
      morning: { start: '08:30', end: '12:00' },
      afternoon: { start: '13:00', end: '17:00' },
      evening: { start: '17:30', end: '20:30' },
      night: { start: '21:00', end: '23:30' }
    };

    preferences.activeDays.forEach(day => {
      if (preferences.preferredWindows.morning) formattedWindows.push({ day, ...windowTimes.morning });
      if (preferences.preferredWindows.afternoon) formattedWindows.push({ day, ...windowTimes.afternoon });
      if (preferences.preferredWindows.evening) formattedWindows.push({ day, ...windowTimes.evening });
      if (preferences.preferredWindows.night) formattedWindows.push({ day, ...windowTimes.night });
    });

    const res = await fetch(`${API_BASE}/generate-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjects: subjects.map(s => ({
          Subject_ID: s.id,
          Subject_Name: s.name,
          Difficulty_Rating: s.difficulty,
          Prior_Performance: s.priorPerformance,
          Days_To_Deadline: s.daysToDeadline,
          Assessment_Weight: s.assessmentWeight,
          Available_Hours: preferences.availableHours
        })),
        preferences: {
          available_hours: preferences.availableHours,
          session_duration: preferences.sessionDuration,
          break_duration: preferences.breakDuration,
          preferred_windows: formattedWindows
        }
      }),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.timetable && data.timetable.length > 0) {
        const mappedSessions: StudySession[] = data.timetable.map((t: any, index: number) => ({
          id: `SES_REM_${index + 1}`,
          day: t.day,
          subjectId: t.subject_id,
          subjectName: t.subject_name,
          startTime: t.start_time,
          endTime: t.end_time,
          durationMinutes: preferences.sessionDuration,
          priority: t.priority as PriorityLevel,
          isCompleted: false
        }));
        return { sessions: mappedSessions, messages: data.messages || [] };
      }
    }
  } catch {
    // Use client-side scheduler
  }

  // Client-Side Deterministic Greedy Scheduler
  const sessions: StudySession[] = [];
  const priorityWeights: Record<PriorityLevel, number> = { High: 3.0, Medium: 2.0, Low: 1.0 };
  const totalWeight = subjects.reduce((sum, s) => sum + priorityWeights[s.priority || 'Medium'], 0) || 1;

  // Calculate session count per subject
  const subjectSessions: { subject: Subject; count: number }[] = [];
  subjects.forEach(sub => {
    const allocatedHours = preferences.availableHours * (priorityWeights[sub.priority || 'Medium'] / totalWeight);
    const sessionCount = Math.max(1, Math.round((allocatedHours * 60) / preferences.sessionDuration));
    subjectSessions.push({ subject: sub, count: sessionCount });
  });

  // Flat list of sessions to schedule (interleaved)
  const queue: Subject[] = [];
  let maxCount = Math.max(...subjectSessions.map(s => s.count), 0);
  for (let round = 0; round < maxCount; round++) {
    for (const item of subjectSessions) {
      if (round < item.count) queue.push(item.subject);
    }
  }

  const days = preferences.activeDays.length > 0 ? preferences.activeDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let queueIndex = 0;
  let sessionId = 1;

  for (let d = 0; d < days.length && queueIndex < queue.length; d++) {
    const currentDay = days[d];
    let currentHour = 8.5; // 08:30 start

    // Schedule 2 to 3 sessions per day
    for (let slot = 0; slot < 3 && queueIndex < queue.length; slot++) {
      const targetSub = queue[queueIndex++];
      const startMinutes = Math.floor(currentHour * 60);
      const endMinutes = startMinutes + preferences.sessionDuration;

      const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60).toString().padStart(2, '0');
        const m = (mins % 60).toString().padStart(2, '0');
        return `${h}:${m}`;
      };

      sessions.push({
        id: `SES_LOC_${sessionId++}`,
        day: currentDay,
        subjectId: targetSub.id,
        subjectName: targetSub.name,
        startTime: formatTime(startMinutes),
        endTime: formatTime(endMinutes),
        durationMinutes: preferences.sessionDuration,
        priority: targetSub.priority || 'Medium',
        isCompleted: false
      });

      // Advance pointer: session duration + break duration
      currentHour += (preferences.sessionDuration + preferences.breakDuration) / 60;
      if (currentHour >= 18.0) break; // End of day limit
    }
  }

  return {
    sessions,
    messages: [
      `Generated ${sessions.length} conflict-free study sessions across ${days.length} active days.`,
      `Enforced ${preferences.breakDuration}-minute cognitive rest breaks between study sessions.`
    ]
  };
}
