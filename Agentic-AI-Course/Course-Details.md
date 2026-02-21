# Agentic AI — Course Details

## Weekly Schedule & Topics

---

### Week 1: Introduction to Agentic AI
**Session 1 — What is Agentic AI?**
- The evolution from rule-based systems to autonomous agents
- Defining "agency" in AI: perception, reasoning, action, learning
- How Agentic AI differs from chatbots, copilots, and traditional automation
- Real-world examples: coding agents, research agents, business process agents

**Session 2 — The AI Agent Landscape**
- Overview of current agent frameworks (LangChain, CrewAI, AutoGen, OpenClaw)
- Key industry players and open-source projects
- The role of Large Language Models as agent brains
- Lab 0: Setting up your development environment

---

### Week 2: Large Language Models as Reasoning Engines
**Session 3 — How LLMs Think**
- Transformer architecture refresher
- Prompt engineering for agent behavior
- System prompts, few-shot examples, and structured outputs
- Temperature, token limits, and their effect on agent reliability

**Session 4 — From Chat to Action**
- The gap between generating text and taking action
- Function calling and structured output formats (JSON mode)
- Introduction to the ReAct (Reasoning + Acting) pattern
- Lab 1: Building your first ReAct agent from scratch

---

### Week 3: Tool Use & External Integrations
**Session 5 — Giving Agents Tools**
- What is tool use and why agents need it
- Designing tool interfaces: descriptions, parameters, return types
- Common tools: web search, code execution, file I/O, APIs
- Error handling when tools fail

**Session 6 — Building Tool-Augmented Agents**
- Implementing tool selection and invocation logic
- Chaining multiple tool calls in a single reasoning loop
- Sandboxing and security considerations
- Lab 2: Build an agent that can search the web, read files, and answer questions

---

### Week 4: Memory & Context Management
**Session 7 — Agent Memory Systems**
- Why memory matters for agents
- Short-term memory: conversation context and working memory
- Long-term memory: vector databases and persistent storage
- Retrieval-Augmented Generation (RAG) for agents

**Session 8 — Practical Memory Implementation**
- Choosing a vector store (ChromaDB, Pinecone, FAISS)
- Embedding models and similarity search
- Implementing memory retrieval in agent loops
- Lab 3: Add persistent memory to your agent

---

### Week 5: Planning & Reasoning Architectures
**Session 9 — How Agents Plan**
- Plan-and-Execute architecture
- Task decomposition and subtask management
- Tree-of-Thought and Chain-of-Thought prompting for deeper reasoning
- When to plan ahead vs. when to act reactively

**Session 10 — Self-Reflection & Error Recovery**
- The Reflexion pattern: learning from mistakes
- Critique and revision loops
- Implementing retry logic with adaptive strategies
- **Midterm Project Due** — Individual agent that solves a defined problem domain

---

### Week 6: Multi-Agent Systems
**Session 11 — Why Multiple Agents?**
- Limitations of single-agent architectures
- Divide and conquer: specialization and delegation
- Communication patterns: hierarchical, peer-to-peer, broadcast
- Real-world multi-agent examples

**Session 12 — Building Multi-Agent Workflows**
- Orchestrator-worker patterns
- Agent-to-agent messaging and shared state
- Frameworks for multi-agent systems (CrewAI, AutoGen, LangGraph)
- Lab 4: Build a multi-agent research team (researcher, writer, reviewer)

---

### Week 7: Safety, Ethics & Evaluation
**Session 13 — Agent Safety & Guardrails**
- What can go wrong: hallucination, infinite loops, harmful actions
- Human-in-the-loop designs
- Permission systems and action sandboxing
- Monitoring and logging agent behavior

**Session 14 — Evaluating Agent Performance**
- Metrics for agent evaluation: task completion, accuracy, efficiency
- Benchmarking frameworks and datasets
- Ethical considerations: bias, transparency, accountability
- The societal impact of autonomous AI systems

---

### Week 8: Capstone & Future Directions
**Session 15 — Capstone Project Work Session**
- In-class working session with instructor support
- Peer code reviews and feedback
- Preparing project presentations

**Session 16 — Presentations & The Future of Agentic AI**
- Student capstone presentations
- Emerging trends: OS-level agents, embodied agents, self-improving systems
- The path from current agents to AGI — hype vs. reality
- Course wrap-up and next steps for continued learning

---

## Lab Assignments Summary

| Lab | Title                                | Due     |
|-----|--------------------------------------|---------|
| 0   | Environment Setup & First Prompt     | Week 1  |
| 1   | Build a ReAct Agent from Scratch     | Week 2  |
| 2   | Tool-Augmented Q&A Agent             | Week 3  |
| 3   | Agent with Persistent Memory         | Week 4  |
| 4   | Multi-Agent Research Team            | Week 6  |

---

## Capstone Project

Students will design and build a complete agentic AI system that solves a real-world problem of their choice. The project must include:

- A clearly defined problem statement
- At least one autonomous agent with tool use
- A memory or retrieval component
- A written report covering architecture, design decisions, and evaluation
- A live demo or recorded walkthrough

**Capstone Submission Deadline:** End of Week 8

---

## Recommended Reading & Resources

1. **"Building LLM-Powered Agents"** — LangChain Documentation
2. **"The Rise of AI Agents"** — Lilian Weng's Blog (lilianweng.github.io)
3. **ReAct Paper:** "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., 2023)
4. **Reflexion Paper:** "Reflexion: Language Agents with Verbal Reinforcement Learning" (Shinn et al., 2023)
5. **CrewAI Documentation** — crewai.com
6. **OpenClaw Platform Documentation**
7. **Anthropic's Claude Documentation** — docs.anthropic.com
