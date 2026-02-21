const slides = [
  {
    type: 'title',
    title: 'Agentic AI',
    subtitle: 'Building Autonomous Intelligent Systems',
    meta: 'OLI-AAI-101 | OpenClaw Learning Initiative',
  },
  {
    type: 'content',
    heading: 'What is Agentic AI?',
    paragraphs: [
      'Agentic AI refers to AI systems that can <strong>independently</strong> perceive their environment, make decisions, take actions, and learn from outcomes — with minimal human guidance.',
    ],
    highlightBox:
      '<strong>Key Idea:</strong> An AI agent doesn\'t just answer questions — it <em>does things</em>. It reasons about what to do, uses tools, and works toward goals on its own.',
    bullets: [
      'Goes beyond simple chatbots and autocomplete',
      'Can break complex tasks into steps and execute them',
      'Interacts with the real world through tools and APIs',
    ],
  },
  {
    type: 'content',
    heading: 'Traditional AI vs. Agentic AI',
    columns: [
      {
        title: 'Traditional AI / Chatbots',
        items: [
          'Responds only when prompted',
          'Single turn: question in, answer out',
          'No memory across interactions',
          'Cannot take actions in the world',
          'Human does all the planning',
        ],
      },
      {
        title: 'Agentic AI',
        items: [
          'Proactively works toward goals',
          'Multi-step reasoning and execution',
          'Maintains memory and context',
          'Uses tools (search, code, APIs)',
          'Plans, acts, and self-corrects',
        ],
      },
    ],
  },
  {
    type: 'content',
    heading: 'Core Components of an AI Agent',
    diagram: [
      { label: 'Perception', sub: 'Observe inputs' },
      { label: 'Reasoning', sub: 'Think & plan' },
      { label: 'Action', sub: 'Use tools & act' },
      { label: 'Learning', sub: 'Reflect & improve' },
    ],
    bullets: [
      '<strong>Perception:</strong> The agent receives input — a user request, sensor data, or system event',
      '<strong>Reasoning:</strong> An LLM (like Claude or GPT) thinks through what to do next',
      '<strong>Action:</strong> The agent calls tools, writes code, searches the web, or sends messages',
      '<strong>Learning:</strong> The agent reflects on results and adjusts its approach',
    ],
  },
  {
    type: 'content',
    heading: 'LLMs: The Brain of the Agent',
    paragraphs: [
      'Large Language Models (LLMs) like Claude, GPT, and Gemini serve as the <strong>reasoning engine</strong> inside modern AI agents.',
    ],
    bullets: [
      '<strong>Natural language understanding</strong> — interpret complex user requests',
      '<strong>Planning</strong> — break big tasks into smaller steps',
      '<strong>Decision making</strong> — choose which tool to use and when',
      '<strong>Code generation</strong> — write and debug code on the fly',
      '<strong>Self-reflection</strong> — evaluate their own outputs and retry if needed',
    ],
    highlightBox:
      'The LLM doesn\'t just generate text — it <em>orchestrates</em> an entire workflow of reasoning, tool use, and evaluation.',
  },
  {
    type: 'content',
    heading: 'The ReAct Pattern (Reasoning + Acting)',
    paragraphs: [
      'ReAct is a foundational pattern where the agent alternates between <strong>thinking</strong> and <strong>doing</strong>.',
    ],
    diagram: [
      { label: 'Thought', sub: '"I need to find..."' },
      { label: 'Action', sub: 'search("query")' },
      { label: 'Observation', sub: 'Results returned' },
      { label: 'Thought', sub: '"Now I know..."' },
    ],
    bullets: [
      'The agent <strong>thinks out loud</strong> about what it needs to do',
      'It then <strong>takes an action</strong> (e.g., call a tool)',
      'It <strong>observes</strong> the result and decides the next step',
      'This loop repeats until the task is complete',
    ],
  },
  {
    type: 'content',
    heading: 'Tool Use: How Agents Interact with the World',
    paragraphs: [
      'Agents become truly useful when they can <strong>use tools</strong> — external functions that extend their capabilities beyond text generation.',
    ],
    bullets: [
      '<strong>Web Search</strong> — look up current information online',
      '<strong>Code Execution</strong> — write and run Python, JavaScript, etc.',
      '<strong>File Operations</strong> — read, write, and manage files',
      '<strong>API Calls</strong> — interact with databases, services, and platforms',
      '<strong>Calculators & Data Tools</strong> — perform precise computations',
    ],
    highlightBox:
      '<strong>Example:</strong> "What\'s the weather in Nairobi?" — The agent calls a weather API, gets live data, and presents the answer.',
  },
  {
    type: 'content',
    heading: 'Agent Memory: Remembering and Retrieving',
    paragraphs: [
      'Without memory, agents forget everything between interactions. Memory systems give agents <strong>continuity</strong> and <strong>context</strong>.',
    ],
    columns: [
      {
        title: 'Short-Term Memory',
        items: [
          'Current conversation context',
          'Working notes during a task',
          'Limited by context window size',
        ],
      },
      {
        title: 'Long-Term Memory',
        items: [
          'Stored in vector databases',
          'Persists across sessions',
          'Retrieved via similarity search (RAG)',
        ],
      },
    ],
    highlightBox:
      '<strong>RAG (Retrieval-Augmented Generation):</strong> The agent searches a knowledge base for relevant info and includes it in its reasoning.',
  },
  {
    type: 'content',
    heading: 'How Agents Plan',
    paragraphs: [
      'For complex tasks, agents need to <strong>plan ahead</strong> rather than just react step-by-step.',
    ],
    bullets: [
      '<strong>Plan-and-Execute:</strong> First create a full plan, then execute each step',
      '<strong>Chain-of-Thought:</strong> Reason through the problem step-by-step before acting',
      '<strong>Tree-of-Thought:</strong> Explore multiple reasoning paths and pick the best one',
      '<strong>Reflexion:</strong> After completing a task, reflect on what went wrong and improve',
    ],
    highlightBox:
      '<strong>Example — Plan-and-Execute:</strong> 1. Research the topic → 2. Outline the article → 3. Write each section → 4. Review and edit → 5. Format and deliver',
  },
  {
    type: 'content',
    heading: 'Multi-Agent Systems',
    paragraphs: [
      'Instead of one agent doing everything, <strong>multiple specialized agents</strong> can collaborate — each with its own role and expertise.',
    ],
    diagram: [
      { label: 'Orchestrator', sub: 'Assigns tasks', accent: true },
      { label: 'Researcher', sub: 'Finds info' },
      { label: 'Writer', sub: 'Drafts content' },
      { label: 'Reviewer', sub: 'Checks quality' },
    ],
    bullets: [
      'Each agent focuses on what it does best',
      'Agents communicate through messages or shared state',
      'Frameworks like <strong>CrewAI</strong>, <strong>AutoGen</strong>, and <strong>LangGraph</strong> make this easier',
    ],
  },
  {
    type: 'content',
    heading: 'Real-World Applications of Agentic AI',
    tableHeaders: ['Domain', 'Application'],
    tableRows: [
      ['Software Engineering', 'Coding agents that write, debug, and deploy code (e.g., Claude Code, Devin)'],
      ['Research', 'Agents that read papers, summarize findings, and generate hypotheses'],
      ['Customer Support', 'Autonomous agents that resolve tickets, look up accounts, and escalate issues'],
      ['Data Analysis', 'Agents that query databases, create charts, and write reports'],
      ['Business Operations', 'Workflow automation — scheduling, invoicing, email management'],
      ['Education', 'Personalized tutoring agents that adapt to each student\'s pace'],
    ],
  },
  {
    type: 'content',
    heading: 'Popular Agent Frameworks',
    tableHeaders: ['Framework', 'Best For'],
    tableRows: [
      ['LangChain / LangGraph', 'General-purpose agent building with flexible tool integration'],
      ['CrewAI', 'Multi-agent collaboration with role-based agents'],
      ['AutoGen (Microsoft)', 'Conversational multi-agent patterns and code execution'],
      ['OpenClaw', 'Our platform — hands-on agent building and deployment'],
      ['Anthropic Agent SDK', 'Building agents powered by Claude with native tool use'],
    ],
    highlightBox:
      'In this course, we will primarily use <strong>OpenClaw</strong> along with LangChain and CrewAI for hands-on labs.',
  },
  {
    type: 'content',
    heading: 'Safety, Ethics & Guardrails',
    paragraphs: [
      'Autonomous agents are powerful — but they need <strong>boundaries</strong> to operate safely.',
    ],
    bullets: [
      '<strong>Hallucination Risk:</strong> Agents can act on incorrect information — always verify critical outputs',
      '<strong>Infinite Loops:</strong> Without limits, agents may repeat actions endlessly — set max iterations',
      '<strong>Harmful Actions:</strong> Agents with file/system access need sandboxing and permission controls',
      '<strong>Human-in-the-Loop:</strong> For high-stakes decisions, require human approval before execution',
      '<strong>Transparency:</strong> Log all agent reasoning and actions for auditability',
      '<strong>Bias & Fairness:</strong> Agents inherit biases from their training data — test for and mitigate bias',
    ],
  },
  {
    type: 'content',
    heading: 'Course Structure Overview',
    tableHeaders: ['Week', 'Topic'],
    tableRows: [
      ['1', 'Introduction to Agentic AI & The Agent Landscape'],
      ['2', 'LLMs as Reasoning Engines & The ReAct Pattern'],
      ['3', 'Tool Use & External Integrations'],
      ['4', 'Memory & Context Management'],
      ['5', 'Planning Architectures & Self-Reflection'],
      ['6', 'Multi-Agent Systems'],
      ['7', 'Safety, Ethics & Evaluation'],
      ['8', 'Capstone Projects & Future Directions'],
    ],
  },
  {
    type: 'content',
    heading: 'What You Will Build',
    bullets: [
      '<strong>Lab 1:</strong> A ReAct agent from scratch — observe the think-act-observe loop in action',
      '<strong>Lab 2:</strong> A tool-augmented Q&A agent — search the web, read files, answer questions',
      '<strong>Lab 3:</strong> An agent with persistent memory — remember past conversations using vector search',
      '<strong>Lab 4:</strong> A multi-agent research team — researcher, writer, and reviewer working together',
      '<strong>Capstone:</strong> A complete agentic system solving a real-world problem of your choice',
    ],
    highlightBox:
      'By the end of this course, you won\'t just understand Agentic AI — you\'ll have <strong>built</strong> multiple working agents.',
  },
  {
    type: 'end',
    title: "Let's Build the Future of AI",
    subtitle: 'Welcome to Agentic AI — OLI-AAI-101',
    meta: 'OpenClaw Learning Initiative',
  },
];

export default slides;
