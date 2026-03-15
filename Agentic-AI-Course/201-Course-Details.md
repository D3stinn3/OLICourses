# Agentic AI: Agents Building in the Open -- Course Details

## Weekly Schedule & Topics

---

### Week 1: The Codebase is the Classroom
**Session 1 -- Anatomy of an Agent-Built Platform**
- Tour of the Scwripts codebase: Django backend, Next.js frontend, SQLite database
- How agents built this platform: walking through agent-generated commits
- Understanding the architecture: controllers, services, models, schemas (Django Ninja pattern)
- The `seed_agentic_course.py` command: how an agent generated the entire AAI-101 course content
- Reading real code: `LLMService`, `ChatController`, `EngagementTracker`

**Session 2 -- Open-Source Workflows for Agent-Augmented Development**
- Forking, branching, and pull request workflows on GitHub
- Writing meaningful commit messages (human + agent co-authorship)
- Code review practices: what to look for in agent-generated code
- Setting up your local dev environment (backend + frontend)
- Lab 0: Fork the repo, run the app locally, submit your first PR (fix a typo, add a comment, improve a docstring)

---

### Week 2: How Agents Generate Course Content
**Session 3 -- Agents as Content Creators**
- How the AAI-101 slides were generated: the data structure behind `SLIDES` and `QUIZ_DATA`
- Slide types: `title`, `content`, `end` -- and the JSON schema that drives rendering
- The `SlideContent` component: how frontend renders `paragraphs`, `bullets`, `columns`, `diagrams`, `tables`, `highlightBox`
- Prompt engineering for educational content generation
- Structured output: getting agents to produce valid JSON slide data

**Session 4 -- Building a Course Generation Agent**
- Designing a content generation pipeline: topic -> outline -> slides -> quiz
- Using Claude with system prompts and structured output for slide generation
- Validation: ensuring generated content matches the slide schema
- Integrating generated content with the Django seed command pattern
- Lab 1: Build an agent that generates a new module of slides for an existing course, validates them against the schema, and creates a seed command

---

### Week 3: Agent-Powered Backend Development
**Session 5 -- Deep Dive into the Scwripts Backend**
- Django Ninja Extra: controllers, schemas, and dependency injection
- The streaming chat architecture: `LLMService.stream_response()` and Server-Sent Events
- JWT authentication flow: `ninja-jwt`, access/refresh tokens, `AuthGuard`
- The engagement system: `EngagementSnapshot`, `FaceService`, `AdaptiveService`
- How agents write backend code: prompt patterns for generating Django models, controllers, and services

**Session 6 -- Building a New Backend Feature with Agent Assistance**
- Designing a new feature: agent-generated study guides per module
- Model design: `StudyGuide` model with generated content, status tracking, and user feedback
- Controller and service implementation with agent pair-programming
- Writing tests for agent-generated code
- Lab 2: Implement a complete backend feature (model + schema + controller + service + migration) using an agent as your pair programmer. Submit as a PR.

---

### Week 4: Agent-Powered Frontend Development
**Session 7 -- Deep Dive into the Scwripts Frontend**
- Next.js Pages Router: routing, dynamic routes (`[slug]`), and data fetching
- The component architecture: `Layout`, `AuthGuard`, `EngagementTracker`, `AchievementToast`
- State management: `AuthContext`, `ToastProvider`, `InspectProvider`
- The `api.js` module: centralized API calls with auto token refresh
- 3D visualizations with React Three Fiber: `AgentReActLoop`, `MultiAgentSystem`, `PlanningTree`

**Session 8 -- Building a New Frontend Feature with Agent Assistance**
- Designing a new page: "Agent Lab" -- an interactive sandbox where students test agent prompts
- Component design: prompt input, streaming response display, tool call visualization
- Connecting to the backend streaming API
- Responsive design and accessibility considerations
- Lab 3: Build a complete frontend feature (page + components + API integration + styles) using an agent as your pair programmer. Submit as a PR.

---

### Week 5: The Gamification Engine -- Agents that Motivate
**Session 9 -- Inside the Gamification System**
- The XP economy: `UserXP`, `XPTransaction`, levels, titles, and thresholds
- Achievements and daily quests: `Achievement`, `DailyQuest`, `UserQuestProgress`
- Leagues and leaderboards: `LeagueWeek`, `LeagueEntry`, tier progression
- The virtual agent companion: `UserAgent`, `AgentCapability`, and personality
- How agents can personalize gamification: adaptive quest difficulty, dynamic XP rewards

**Session 10 -- Building Agent-Driven Personalization**
- Designing an adaptive difficulty system: agents analyze student performance and adjust content
- Implementing personalized quest generation: agents create daily quests based on learning gaps
- Smart notifications: agents decide when and how to re-engage students
- **Midterm Feature Due** -- Submit a complete, reviewed, and tested feature PR to the Scwripts codebase

---

### Week 6: Multi-Agent Content Pipelines
**Session 11 -- From Single Agent to Content Pipeline**
- Why content generation needs multiple agents: researcher, writer, reviewer, formatter
- Designing the pipeline: orchestrator pattern with specialized workers
- The content review loop: generating, critiquing, and revising until quality thresholds are met
- Handling failures: retry logic, fallback content, human escalation

**Session 12 -- Building a Multi-Agent Course Generator**
- Implementing an orchestrator agent that coordinates content creation
- Building specialized agents: `ResearchAgent` (gathers topics), `WriterAgent` (generates slides), `ReviewerAgent` (validates accuracy), `QuizAgent` (creates assessments)
- Shared state and message passing between agents
- Deploying the pipeline as a management command
- Lab 4: Build a multi-agent pipeline that generates a complete course module (slides + quiz + study guide) from a single topic prompt. The pipeline must include at least 3 specialized agents.

---

### Week 7: Agent-in-the-Loop DevOps
**Session 13 -- Agents in the Development Lifecycle**
- Agent-assisted issue triage: categorizing, prioritizing, and assigning issues
- Agent-generated pull requests: from issue description to working code
- Automated code review: agents that review PRs for correctness, security, and style
- CI/CD with agent checkpoints: running agent-powered tests before merge
- Monitoring agent behavior in production: logging, observability, and alerting

**Session 14 -- Testing and Evaluating Agent-Built Features**
- Testing strategies for non-deterministic agent outputs
- Evaluation metrics: content quality scores, code correctness rates, user satisfaction
- A/B testing agent-generated vs. human-generated content
- Regression testing: ensuring agent updates don't break existing functionality
- Building a test harness for the course generation pipeline

---

### Week 8: Capstone & The Self-Improving Platform
**Session 15 -- Capstone Work Session**
- In-class working session with instructor and agent support
- Peer code reviews and cross-team collaboration
- Final PR preparation: documentation, tests, and demo recording
- The feedback loop: how student contributions improve the platform for future cohorts

**Session 16 -- Presentations & The Self-Improving Platform**
- Student capstone presentations and demos
- The vision: a platform that improves itself -- agents that learn from student engagement data to generate better content
- Recursive improvement: agents building better agents, courses teaching how to build the courses that teach
- Open-source community building: maintaining and growing the Scwripts project
- Course wrap-up, contributor recognition, and next steps

---

## Lab Assignments Summary

| Lab | Title                                           | Due     |
|-----|-------------------------------------------------|---------|
| 0   | Fork, Run, and Submit Your First PR             | Week 1  |
| 1   | Build a Course Content Generation Agent         | Week 2  |
| 2   | Implement a Backend Feature with Agent Pairing  | Week 3  |
| 3   | Build a Frontend Feature with Agent Pairing     | Week 4  |
| 4   | Multi-Agent Course Generation Pipeline          | Week 6  |

---

## Capstone Project

Students will design, implement, and ship a significant feature to the Scwripts platform. The capstone must include:

- A GitHub issue describing the feature with acceptance criteria
- At least 3 commits showing iterative development with agent collaboration
- A complete pull request with: code changes, tests, documentation, and a demo
- A written reflection covering: what the agent did vs. what you did, what worked, what didn't, and what you would do differently
- A peer review of at least one other student's capstone PR

**Capstone Submission Deadline:** End of Week 8

---

## Recommended Reading & Resources

1. **Scwripts Codebase** -- The primary learning material is the code itself
2. **Django Ninja Documentation** -- django-ninja.dev
3. **Next.js Documentation** -- nextjs.org/docs
4. **Anthropic Claude API Documentation** -- docs.anthropic.com
5. **"Working in Public: The Making and Maintenance of Open Source Software"** -- Nadia Eghbal
6. **"The Cathedral and the Bazaar"** -- Eric S. Raymond
7. **Anthropic Agent SDK Documentation** -- docs.anthropic.com/agent-sdk
8. **React Three Fiber Documentation** -- docs.pmnd.rs/react-three-fiber
