# Agentic AI: Agents Building in the Open -- Quiz Questions

---

### Question 1
**In the Scwripts backend, what framework is used to define API controllers and schemas?**

A) Django REST Framework
B) Flask-RESTful
C) Django Ninja Extra
D) FastAPI

**Answer: C**
**Explanation:** Scwripts uses Django Ninja Extra with `NinjaExtraAPI` for controller-based API design, combined with Pydantic schemas for request/response validation.

---

### Question 2
**What is the purpose of the `seed_agentic_course.py` management command?**

A) To delete all course data from the database
B) To populate the database with course slides, modules, and quiz questions
C) To run the development server
D) To generate database migrations

**Answer: B**
**Explanation:** The seed command creates Course, Module, Slide, and Quiz/Question/Choice records from predefined data structures, allowing agent-generated content to be loaded into the platform.

---

### Question 3
**How does the Scwripts `LLMService` deliver AI tutor responses to the frontend?**

A) WebSocket messages
B) Polling with REST API calls every 2 seconds
C) Server-Sent Events (SSE) streaming
D) GraphQL subscriptions

**Answer: C**
**Explanation:** `LLMService.stream_response()` uses the Anthropic SDK's `messages.stream()` method and yields `data:` prefixed chunks as Server-Sent Events.

---

### Question 4
**In the Scwripts slide schema, which `slide_type` values are supported?**

A) header, body, footer
B) title, content, end
C) intro, main, conclusion
D) opening, middle, closing

**Answer: B**
**Explanation:** The `Slide` model defines three types: `title` (course/module title slides), `content` (the main instructional slides), and `end` (closing slides).

---

### Question 5
**When an agent generates course content as structured JSON, which of these is a valid content field for a `content` type slide?**

A) `backgroundColor`
B) `highlightBox`
C) `animation`
D) `videoUrl`

**Answer: B**
**Explanation:** Content slides support fields like `heading`, `paragraphs`, `bullets`, `diagram`, `columns`, `tableHeaders`, `tableRows`, and `highlightBox` -- all rendered by the `SlideContent` component.

---

### Question 6
**What is the role of the `AuthContext` in the Scwripts frontend?**

A) It encrypts all API requests
B) It provides user authentication state and methods to all components via React Context
C) It stores the database connection string
D) It manages CSS themes

**Answer: B**
**Explanation:** `AuthContext` wraps the app in `_app.js` and provides the current `user` object, `login`, `register`, and `logout` methods to any component via `useAuth()`.

---

### Question 7
**In the gamification system, what happens when a user's XP crosses a level threshold?**

A) The user is removed from the leaderboard
B) The user's level increases and their title may change (e.g., "Tool User" to "ReAct Thinker")
C) The user loses all their XP
D) Nothing -- levels are manually assigned by instructors

**Answer: B**
**Explanation:** The `UserXP` model calculates levels from `LEVEL_THRESHOLDS` and maps levels to titles like "Prompt Novice" (L1), "Tool User" (L6), "ReAct Thinker" (L11), etc.

---

### Question 8
**Why does the multi-agent content pipeline need a ReviewerAgent?**

A) To make the pipeline slower
B) To validate accuracy, check for hallucinations, and ensure content meets quality thresholds before publishing
C) To delete content that is too long
D) To translate content into other languages

**Answer: B**
**Explanation:** AI-generated educational content can contain inaccuracies or hallucinations. A ReviewerAgent critiques the output, flags issues, and triggers revision loops until quality standards are met.

---

### Question 9
**What is the "recursive improvement" concept in the context of Scwripts?**

A) Running the same function repeatedly until it crashes
B) Agents building features that improve the platform, which then helps future agents and students build even better features
C) Deleting old code and rewriting it from scratch
D) Using recursion in all Python functions

**Answer: B**
**Explanation:** The platform embodies recursive improvement: agents generate courses that teach students to build agents that improve the platform, creating a self-reinforcing cycle of quality.

---

### Question 10
**When submitting a PR to the Scwripts codebase, what must be clearly documented?**

A) Only the file names that changed
B) What the agent did vs. what the student did, along with tests and a description
C) The student's GPA
D) A list of all Python packages installed globally

**Answer: B**
**Explanation:** Academic integrity in agent-augmented development requires transparency about human vs. agent contributions, plus proper testing and documentation.

---

### Question 11
**What pattern does the Scwripts backend use for organizing business logic?**

A) All logic in views.py
B) Controller -> Service -> Model layered architecture
C) Everything in a single file
D) Logic stored in the database

**Answer: B**
**Explanation:** Scwripts separates concerns: Controllers handle HTTP routing, Services contain business logic, and Models define data structures -- each in their own directory within each Django app.

---

### Question 12
**How does the `EngagementTracker` component determine student attention levels?**

A) By counting mouse clicks
B) By analyzing facial expressions, gaze direction, and emotion via webcam snapshots
C) By measuring typing speed
D) By checking how many pages the student has visited

**Answer: B**
**Explanation:** The engagement system captures webcam snapshots, analyzes facial emotion and gaze direction, and computes an engagement score stored as `EngagementSnapshot` records.

---

### Question 13
**In a multi-agent course generation pipeline, what is the Orchestrator agent's responsibility?**

A) Writing all the slides by itself
B) Coordinating the workflow: assigning tasks to specialized agents and managing the overall pipeline flow
C) Grading student submissions
D) Managing the database schema

**Answer: B**
**Explanation:** The Orchestrator agent follows the orchestrator-worker pattern: it breaks the task into subtasks, delegates to specialized agents (Researcher, Writer, Reviewer, QuizAgent), and manages the workflow.

---

### Question 14
**What is the key challenge of testing agent-generated code or content?**

A) Agents always produce identical output
B) Agent outputs are non-deterministic, so tests must focus on structure, constraints, and quality metrics rather than exact string matching
C) Agent code cannot be tested at all
D) Tests run too fast for agent code

**Answer: B**
**Explanation:** Because LLM outputs are non-deterministic, testing requires schema validation, constraint checking (word count, required fields), and quality scoring rather than exact output matching.

---

### Question 15
**What distinguishes this course (OLI-AAI-201) from the prerequisite (OLI-AAI-101)?**

A) This course has no coding -- it is purely theoretical
B) Students contribute to the actual Scwripts platform while learning how agents build software, creating a learn-by-building open-source experience
C) This course uses a completely different programming language
D) This course is shorter and easier

**Answer: B**
**Explanation:** OLI-AAI-201 advances beyond theory into practice: students work inside the real Scwripts codebase, study how agents built the platform, and contribute features as open-source pull requests.

---

*End of Quiz*
