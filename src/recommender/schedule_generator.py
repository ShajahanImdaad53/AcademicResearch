import datetime
from math import floor

class ScheduleGenerator:
    def __init__(self, priority_engine):
        self.priority_engine = priority_engine
        
    def generate(self, subjects_context, preferences):
        """
        subjects_context: List of dicts, each with subject features (Weight, Days, Diff, etc.)
        preferences: dict containing:
            - available_hours (float): total weekly hours
            - session_duration (int): minutes per session (e.g., 60)
            - break_duration (int): minutes per break (e.g., 15)
            - preferred_windows: list of dicts (day, start, end)
        """
        messages = []
        
        # 1. Edge Case: Empty Subjects
        if not subjects_context:
            return {
                'is_fallback_used': self.priority_engine.is_fallback,
                'subject_priorities': [],
                'time_allocations': {},
                'timetable': [],
                'messages': ["Info: No subjects provided for scheduling."]
            }
            
        # 2. Edge Case: Non-positive Available Hours
        raw_available_hours = preferences.get('available_hours', 0.0)
        if raw_available_hours <= 0:
            return {
                'is_fallback_used': self.priority_engine.is_fallback,
                'subject_priorities': [],
                'time_allocations': {ctx.get('Subject_ID', f'SUB_{i}'): 0.0 for i, ctx in enumerate(subjects_context)},
                'timetable': [],
                'messages': ["Warning: Available study hours is zero or negative. No sessions could be scheduled."]
            }

        # 3. Sanitize Preferences
        session_len = max(15, int(preferences.get('session_duration', 60)))
        break_len = max(0, int(preferences.get('break_duration', 15)))
        sanitized_prefs = {
            'available_hours': float(raw_available_hours),
            'session_duration': session_len,
            'break_duration': break_len,
            'preferred_windows': preferences.get('preferred_windows', [])
        }

        # 4. Evaluate Priorities
        prioritized_subjects = []
        for ctx in subjects_context:
            # Inject student available hours into subject context if missing
            ctx_copy = ctx.copy()
            if 'Available_Hours' not in ctx_copy:
                ctx_copy['Available_Hours'] = sanitized_prefs['available_hours']
                
            priority, explanation = self.priority_engine.predict_priority(ctx_copy)
            prioritized_subjects.append({
                'id': ctx_copy.get('Subject_ID', 'Unknown_Subject'),
                'priority': priority,
                'explanation': explanation
            })
            
        # 5. Allocate Total Hours Proportionally
        allocations = self._allocate_hours(prioritized_subjects, sanitized_prefs['available_hours'])
        
        # 6. Schedule blocks in the week
        schedule, schedule_msgs = self._build_timetable(allocations, sanitized_prefs)
        messages.extend(schedule_msgs)
        
        return {
            'is_fallback_used': self.priority_engine.is_fallback,
            'subject_priorities': prioritized_subjects,
            'time_allocations': allocations,
            'timetable': schedule,
            'messages': messages
        }
        
    def _allocate_hours(self, subjects, total_hours):
        weights = {'High': 3, 'Medium': 2, 'Low': 1}
        total_weight = sum(weights.get(s['priority'], 1) for s in subjects)
        
        allocations = {}
        for s in subjects:
            if total_weight == 0:
                allocations[s['id']] = 0.0
            else:
                proportion = weights.get(s['priority'], 1) / total_weight
                allocations[s['id']] = round(proportion * total_hours * 60, 2)
                
        return allocations
        
    def _build_timetable(self, allocations, prefs):
        schedule = []
        messages = []
        
        remaining_minutes = allocations.copy()
        session_len = prefs['session_duration']
        break_len = prefs['break_duration']
        
        windows = prefs.get('preferred_windows', [])
        if not windows:
            windows = [{'day': d, 'start': '09:00', 'end': '17:00'} for d in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']]
            
        total_window_capacity_mins = 0
        
        for window in windows:
            day = window.get('day', 'Day')
            start_str = window.get('start', '09:00')
            end_str = window.get('end', '17:00')
            
            try:
                start_dt = datetime.datetime.strptime(start_str, "%H:%M")
                end_dt = datetime.datetime.strptime(end_str, "%H:%M")
            except ValueError:
                messages.append(f"Warning: Invalid time format in window {start_str}-{end_str} for {day}. Skipping window.")
                continue
                
            if start_dt >= end_dt:
                messages.append(f"Warning: Window start ({start_str}) is not earlier than end ({end_str}) on {day}. Skipping window.")
                continue
                
            window_duration = (end_dt - start_dt).seconds / 60
            total_window_capacity_mins += window_duration
            
            if window_duration < session_len:
                # Window too short for even one session
                continue
            
            current_time = start_dt
            
            while True:
                # Find subjects needing study time
                subjects_needing_time = {k: v for k, v in remaining_minutes.items() if v >= (session_len * 0.5)}
                
                if not subjects_needing_time:
                    break
                    
                target_sub = max(subjects_needing_time, key=subjects_needing_time.get)
                
                session_end = current_time + datetime.timedelta(minutes=session_len)
                if session_end > end_dt:
                    break
                    
                schedule.append({
                    'day': day,
                    'start': current_time.strftime("%H:%M"),
                    'end': session_end.strftime("%H:%M"),
                    'subject': target_sub,
                    'type': 'Study'
                })
                
                remaining_minutes[target_sub] = max(0.0, remaining_minutes[target_sub] - session_len)
                current_time = session_end
                
                # Check for Break
                if break_len > 0:
                    break_end = current_time + datetime.timedelta(minutes=break_len)
                    if break_end <= end_dt:
                        schedule.append({
                            'day': day,
                            'start': current_time.strftime("%H:%M"),
                            'end': break_end.strftime("%H:%M"),
                            'subject': 'Break',
                            'type': 'Break'
                        })
                        current_time = break_end
                    else:
                        break
                else:
                    # No break requested
                    pass
                    
        total_requested_study_mins = sum(allocations.values())
        if total_requested_study_mins > total_window_capacity_mins:
            messages.append(
                f"Warning: Target study time ({total_requested_study_mins/60:.1f}h) exceeds the total available window capacity ({total_window_capacity_mins/60:.1f}h)."
            )
            
        unscheduled = {k: round(v/60, 2) for k, v in remaining_minutes.items() if v >= 15}
        if unscheduled:
            msg_details = ", ".join([f"{k} ({v}h remaining)" for k, v in unscheduled.items()])
            messages.append(f"Warning: Insufficient available time windows. Could not schedule: {msg_details}.")
        else:
            messages.append("Success: All recommended study hours were successfully scheduled.")
            
        return schedule, messages
