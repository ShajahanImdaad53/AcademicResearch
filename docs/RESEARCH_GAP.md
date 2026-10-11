# Research Gap Analysis

## 1. Context
Educational technologies have made significant strides in predicting student performance and recommending learning materials (e.g., Intelligent Tutoring Systems, MOOC recommenders). 

## 2. The Gap
Despite the abundance of predictive models, there is a distinct gap in applying machine learning to **contextual, time-bound study scheduling**. Specifically:
1. **Focus on "What" over "When":** Existing systems recommend *what* to study but rarely output a constrained, actionable weekly timetable that accounts for a student's available hours, breaks, and overlapping deadlines.
2. **Static vs. Dynamic Prioritization:** Traditional planners are static. Students need dynamic prioritization that adjusts based on changing deadlines, self-perceived difficulty, and remaining time.
3. **Integration of Constraints:** Framing scheduling strictly as a predictive ML problem overlooks real-world constraints (e.g., maximum daily study hours). The gap lies in bridging predictive ML (prioritizing subjects) with constraint-based scheduling algorithms to generate usable schedules.

## 3. Contribution
This research will address the gap by developing a hybrid approach:
- A **Machine Learning Model** to classify the priority level of a given subject context (High, Medium, Low).
- A **Rule-Based Schedule Generator** that translates these priorities into a conflict-free, weekly timetable that respects human constraints (availability, breaks, deadlines).
