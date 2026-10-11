# Decision Log & Issue Register

## Unresolved Methodological Decisions (Pending Supervisor Approval)
1. **Target Variable Source:** Should we collect organic target labels from students (asking them to rank priority) or use an expert-defined formula to generate labels for the dataset? *Recommendation: Use a transparent rule-based heuristic for initial prototype development, and validate organic labels later if time permits.*
2. **Dataset Acquisition:** Since no real dataset has been provided, we need approval to collect data via the drafted questionnaire. Should we generate a synthetic dataset to develop the ML pipeline while waiting for ethics approval? *Recommendation: Yes, build the pipeline with explicitly marked synthetic data.*
3. **Evaluation Protocol:** For RQ4, is a post-use survey sufficient, or do we require an A/B test (conventional planner vs. AI planner)? *Recommendation: A task-based usability survey is safer for an undergraduate project timeline.*

## Deviations from Original Proposal
- **Clarification of "Recommendation":** The proposal implied ML would generate the schedule directly. I have clarified the architecture: ML predicts *Subject Priority*, and a Constraint-based Algorithm generates the *Schedule*. This is a standard and robust architectural pattern for AI scheduling. 

## Assumptions
- The presentation (`docs/research_proposal.pptx`) was not supplied in the workspace, so the project setup strictly relies on the detailed Master Prompt provided.
