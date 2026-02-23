from django.core.management.base import BaseCommand
from courses.models import Course, Module, Slide
from quizzes.models import Quiz, Question, Choice


SLIDES = [
    {"type": "title", "content": {"title": "Agentic AI", "subtitle": "Building Autonomous Intelligent Systems", "meta": "OLI-AAI-101 | OpenClaw Learning Initiative"}},
    {"type": "content", "content": {"heading": "What is Agentic AI?", "paragraphs": ["Agentic AI refers to AI systems that can <strong>independently</strong> perceive their environment, make decisions, take actions, and learn from outcomes \u2014 with minimal human guidance."], "highlightBox": "<strong>Key Idea:</strong> An AI agent doesn\u2019t just answer questions \u2014 it <em>does things</em>. It reasons about what to do, uses tools, and works toward goals on its own.", "bullets": ["Goes beyond simple chatbots and autocomplete", "Can break complex tasks into steps and execute them", "Interacts with the real world through tools and APIs"]}},
    {"type": "content", "content": {"heading": "Traditional AI vs. Agentic AI", "columns": [{"title": "Traditional AI / Chatbots", "items": ["Responds only when prompted", "Single turn: question in, answer out", "No memory across interactions", "Cannot take actions in the world", "Human does all the planning"]}, {"title": "Agentic AI", "items": ["Proactively works toward goals", "Multi-step reasoning and execution", "Maintains memory and context", "Uses tools (search, code, APIs)", "Plans, acts, and self-corrects"]}]}},
    {"type": "content", "content": {"heading": "Core Components of an AI Agent", "diagram": [{"label": "Perception", "sub": "Observe inputs"}, {"label": "Reasoning", "sub": "Think & plan"}, {"label": "Action", "sub": "Use tools & act"}, {"label": "Learning", "sub": "Reflect & improve"}], "bullets": ["<strong>Perception:</strong> The agent receives input \u2014 a user request, sensor data, or system event", "<strong>Reasoning:</strong> An LLM (like Claude or GPT) thinks through what to do next", "<strong>Action:</strong> The agent calls tools, writes code, searches the web, or sends messages", "<strong>Learning:</strong> The agent reflects on results and adjusts its approach"]}},
    {"type": "content", "content": {"heading": "LLMs: The Brain of the Agent", "paragraphs": ["Large Language Models (LLMs) like Claude, GPT, and Gemini serve as the <strong>reasoning engine</strong> inside modern AI agents."], "bullets": ["<strong>Natural language understanding</strong> \u2014 interpret complex user requests", "<strong>Planning</strong> \u2014 break big tasks into smaller steps", "<strong>Decision making</strong> \u2014 choose which tool to use and when", "<strong>Code generation</strong> \u2014 write and debug code on the fly", "<strong>Self-reflection</strong> \u2014 evaluate their own outputs and retry if needed"], "highlightBox": "The LLM doesn\u2019t just generate text \u2014 it <em>orchestrates</em> an entire workflow of reasoning, tool use, and evaluation."}},
    {"type": "content", "content": {"heading": "The ReAct Pattern (Reasoning + Acting)", "paragraphs": ["ReAct is a foundational pattern where the agent alternates between <strong>thinking</strong> and <strong>doing</strong>."], "diagram": [{"label": "Thought", "sub": "\"I need to find...\""}, {"label": "Action", "sub": "search(\"query\")"}, {"label": "Observation", "sub": "Results returned"}, {"label": "Thought", "sub": "\"Now I know...\""}], "bullets": ["The agent <strong>thinks out loud</strong> about what it needs to do", "It then <strong>takes an action</strong> (e.g., call a tool)", "It <strong>observes</strong> the result and decides the next step", "This loop repeats until the task is complete"]}},
    {"type": "content", "content": {"heading": "Tool Use: How Agents Interact with the World", "paragraphs": ["Agents become truly useful when they can <strong>use tools</strong> \u2014 external functions that extend their capabilities beyond text generation."], "bullets": ["<strong>Web Search</strong> \u2014 look up current information online", "<strong>Code Execution</strong> \u2014 write and run Python, JavaScript, etc.", "<strong>File Operations</strong> \u2014 read, write, and manage files", "<strong>API Calls</strong> \u2014 interact with databases, services, and platforms", "<strong>Calculators & Data Tools</strong> \u2014 perform precise computations"], "highlightBox": "<strong>Example:</strong> \"What\u2019s the weather in Nairobi?\" \u2014 The agent calls a weather API, gets live data, and presents the answer."}},
    {"type": "content", "content": {"heading": "Agent Memory: Remembering and Retrieving", "paragraphs": ["Without memory, agents forget everything between interactions. Memory systems give agents <strong>continuity</strong> and <strong>context</strong>."], "columns": [{"title": "Short-Term Memory", "items": ["Current conversation context", "Working notes during a task", "Limited by context window size"]}, {"title": "Long-Term Memory", "items": ["Stored in vector databases", "Persists across sessions", "Retrieved via similarity search (RAG)"]}], "highlightBox": "<strong>RAG (Retrieval-Augmented Generation):</strong> The agent searches a knowledge base for relevant info and includes it in its reasoning."}},
    {"type": "content", "content": {"heading": "How Agents Plan", "paragraphs": ["For complex tasks, agents need to <strong>plan ahead</strong> rather than just react step-by-step."], "bullets": ["<strong>Plan-and-Execute:</strong> First create a full plan, then execute each step", "<strong>Chain-of-Thought:</strong> Reason through the problem step-by-step before acting", "<strong>Tree-of-Thought:</strong> Explore multiple reasoning paths and pick the best one", "<strong>Reflexion:</strong> After completing a task, reflect on what went wrong and improve"], "highlightBox": "<strong>Example \u2014 Plan-and-Execute:</strong> 1. Research the topic \u2192 2. Outline the article \u2192 3. Write each section \u2192 4. Review and edit \u2192 5. Format and deliver"}},
    {"type": "content", "content": {"heading": "Multi-Agent Systems", "paragraphs": ["Instead of one agent doing everything, <strong>multiple specialized agents</strong> can collaborate \u2014 each with its own role and expertise."], "diagram": [{"label": "Orchestrator", "sub": "Assigns tasks", "accent": True}, {"label": "Researcher", "sub": "Finds info"}, {"label": "Writer", "sub": "Drafts content"}, {"label": "Reviewer", "sub": "Checks quality"}], "bullets": ["Each agent focuses on what it does best", "Agents communicate through messages or shared state", "Frameworks like <strong>CrewAI</strong>, <strong>AutoGen</strong>, and <strong>LangGraph</strong> make this easier"]}},
    {"type": "content", "content": {"heading": "Real-World Applications of Agentic AI", "tableHeaders": ["Domain", "Application"], "tableRows": [["Software Engineering", "Coding agents that write, debug, and deploy code (e.g., Claude Code, Devin)"], ["Research", "Agents that read papers, summarize findings, and generate hypotheses"], ["Customer Support", "Autonomous agents that resolve tickets, look up accounts, and escalate issues"], ["Data Analysis", "Agents that query databases, create charts, and write reports"], ["Business Operations", "Workflow automation \u2014 scheduling, invoicing, email management"], ["Education", "Personalized tutoring agents that adapt to each student\u2019s pace"]]}},
    {"type": "content", "content": {"heading": "Popular Agent Frameworks", "tableHeaders": ["Framework", "Best For"], "tableRows": [["LangChain / LangGraph", "General-purpose agent building with flexible tool integration"], ["CrewAI", "Multi-agent collaboration with role-based agents"], ["AutoGen (Microsoft)", "Conversational multi-agent patterns and code execution"], ["OpenClaw", "Our platform \u2014 hands-on agent building and deployment"], ["Anthropic Agent SDK", "Building agents powered by Claude with native tool use"]], "highlightBox": "In this course, we will primarily use <strong>OpenClaw</strong> along with LangChain and CrewAI for hands-on labs."}},
    {"type": "content", "content": {"heading": "Safety, Ethics & Guardrails", "paragraphs": ["Autonomous agents are powerful \u2014 but they need <strong>boundaries</strong> to operate safely."], "bullets": ["<strong>Hallucination Risk:</strong> Agents can act on incorrect information \u2014 always verify critical outputs", "<strong>Infinite Loops:</strong> Without limits, agents may repeat actions endlessly \u2014 set max iterations", "<strong>Harmful Actions:</strong> Agents with file/system access need sandboxing and permission controls", "<strong>Human-in-the-Loop:</strong> For high-stakes decisions, require human approval before execution", "<strong>Transparency:</strong> Log all agent reasoning and actions for auditability", "<strong>Bias & Fairness:</strong> Agents inherit biases from their training data \u2014 test for and mitigate bias"]}},
    {"type": "content", "content": {"heading": "Course Structure Overview", "tableHeaders": ["Week", "Topic"], "tableRows": [["1", "Introduction to Agentic AI & The Agent Landscape"], ["2", "LLMs as Reasoning Engines & The ReAct Pattern"], ["3", "Tool Use & External Integrations"], ["4", "Memory & Context Management"], ["5", "Planning Architectures & Self-Reflection"], ["6", "Multi-Agent Systems"], ["7", "Safety, Ethics & Evaluation"], ["8", "Capstone Projects & Future Directions"]]}},
    {"type": "content", "content": {"heading": "What You Will Build", "bullets": ["<strong>Lab 1:</strong> A ReAct agent from scratch \u2014 observe the think-act-observe loop in action", "<strong>Lab 2:</strong> A tool-augmented Q&A agent \u2014 search the web, read files, answer questions", "<strong>Lab 3:</strong> An agent with persistent memory \u2014 remember past conversations using vector search", "<strong>Lab 4:</strong> A multi-agent research team \u2014 researcher, writer, and reviewer working together", "<strong>Capstone:</strong> A complete agentic system solving a real-world problem of your choice"], "highlightBox": "By the end of this course, you won\u2019t just understand Agentic AI \u2014 you\u2019ll have <strong>built</strong> multiple working agents."}},
    {"type": "end", "content": {"title": "Let\u2019s Build the Future of AI", "subtitle": "Welcome to Agentic AI \u2014 OLI-AAI-101", "meta": "OpenClaw Learning Initiative"}},
]

QUIZ_DATA = [
    {"text": "What does \"Agentic AI\" mean?", "choices": [("AI that only answers questions when asked", False), ("AI that can independently make decisions and take actions to achieve goals", True), ("AI that replaces all human workers", False), ("AI that only works offline", False)], "explanation": "Agentic AI refers to AI systems that can independently perceive, decide, act, and learn."},
    {"text": "What is the \"brain\" of a modern AI agent?", "choices": [("A calculator", False), ("A search engine", False), ("A Large Language Model (LLM)", True), ("A database", False)], "explanation": "LLMs like Claude and GPT serve as the reasoning engine inside AI agents."},
    {"text": "What does the ReAct pattern stand for?", "choices": [("Read and Edit", False), ("Reasoning and Acting", True), ("Record and Activate", False), ("Receive and Transmit", False)], "explanation": "ReAct combines Reasoning and Acting in an alternating loop."},
    {"text": "Which of these is an example of a \"tool\" an AI agent can use?", "choices": [("Web search", True), ("A keyboard", False), ("A monitor", False), ("A mouse", False)], "explanation": "Agents use tools like web search, code execution, and API calls."},
    {"text": "What is the main difference between a chatbot and an AI agent?", "choices": [("A chatbot is faster", False), ("An AI agent can plan, use tools, and take actions on its own", True), ("A chatbot is more intelligent", False), ("There is no difference", False)], "explanation": "AI agents go beyond Q&A to plan, act, and use tools autonomously."},
    {"text": "What does RAG stand for?", "choices": [("Rapid Action Generator", False), ("Random Access Gateway", False), ("Retrieval-Augmented Generation", True), ("Real-time Agent Grid", False)], "explanation": "RAG lets agents search a knowledge base and include relevant info in their reasoning."},
    {"text": "Why do AI agents need memory?", "choices": [("To use more electricity", False), ("To remember past interactions and provide better context", True), ("To slow down processing", False), ("Memory is not useful for agents", False)], "explanation": "Memory gives agents continuity across conversations and tasks."},
    {"text": "What is a multi-agent system?", "choices": [("One agent doing all the work alone", False), ("Multiple specialized agents working together on a task", True), ("An agent that runs on multiple computers", False), ("An agent with multiple passwords", False)], "explanation": "Multi-agent systems use specialized agents that collaborate on complex tasks."},
    {"text": "Which of these is a popular framework for building AI agents?", "choices": [("Microsoft Word", False), ("LangChain", True), ("Adobe Photoshop", False), ("Google Sheets", False)], "explanation": "LangChain is a widely-used framework for building AI agents with tool integration."},
    {"text": "What is \"tool use\" in Agentic AI?", "choices": [("The agent physically holding tools", False), ("The agent calling external functions like search, code execution, or APIs", True), ("The agent fixing hardware", False), ("The agent installing software updates", False)], "explanation": "Tool use means agents can call external functions to extend their capabilities."},
    {"text": "What is \"hallucination\" in AI?", "choices": [("The AI seeing images", False), ("The AI generating incorrect or made-up information", True), ("The AI dreaming", False), ("The AI shutting down", False)], "explanation": "Hallucination is when AI generates plausible but incorrect information."},
    {"text": "What does \"human-in-the-loop\" mean?", "choices": [("A human running inside a machine", False), ("A human giving approval before the agent takes important actions", True), ("A human writing all the code for the agent", False), ("A human replacing the AI completely", False)], "explanation": "Human-in-the-loop ensures humans approve high-stakes agent decisions."},
    {"text": "Which step comes first in the ReAct loop?", "choices": [("Observation", False), ("Action", False), ("Thought", True), ("Conclusion", False)], "explanation": "The ReAct loop starts with Thought, then Action, then Observation."},
    {"text": "What type of memory uses vector databases for long-term storage?", "choices": [("Short-term memory", False), ("Long-term memory", True), ("Read-only memory", False), ("Flash memory", False)], "explanation": "Long-term memory uses vector databases to persist and retrieve information via similarity search."},
    {"text": "Why are safety guardrails important for AI agents?", "choices": [("They make the agent look more professional", False), ("They prevent the agent from taking harmful or unintended actions", True), ("They make the agent run faster", False), ("They are not important at all", False)], "explanation": "Guardrails prevent hallucinations, infinite loops, and harmful actions."},
]


class Command(BaseCommand):
    help = "Seed the Agentic AI course with slides and quiz data"

    def handle(self, *args, **options):
        course, created = Course.objects.get_or_create(
            slug="agentic-ai",
            defaults={
                "name": "Agentic AI: Building Autonomous Intelligent Systems",
                "description": "This course introduces students to Agentic AI \u2014 AI systems that can perceive, decide, act, and learn autonomously. Build working AI agents using modern frameworks and tools across 8 weeks of hands-on learning.",
                "is_published": True,
            },
        )
        action = "Created" if created else "Found existing"
        self.stdout.write(f"{action} course: {course.name}")

        module, _ = Module.objects.get_or_create(
            course=course, title="Introduction to Agentic AI", defaults={"order": 0}
        )

        Slide.objects.filter(module=module).delete()
        for i, slide in enumerate(SLIDES):
            Slide.objects.create(
                module=module,
                slide_type=slide["type"],
                content=slide["content"],
                order=i,
            )
        self.stdout.write(f"Created {len(SLIDES)} slides")

        quiz, _ = Quiz.objects.get_or_create(
            module=module, defaults={"title": "Agentic AI Fundamentals Quiz"}
        )
        Question.objects.filter(quiz=quiz).delete()
        for i, q in enumerate(QUIZ_DATA):
            question = Question.objects.create(
                quiz=quiz, text=q["text"], explanation=q["explanation"], order=i
            )
            for text, is_correct in q["choices"]:
                Choice.objects.create(
                    question=question, text=text, is_correct=is_correct
                )
        self.stdout.write(f"Created {len(QUIZ_DATA)} quiz questions")

        self.stdout.write(self.style.SUCCESS("Seed complete!"))
