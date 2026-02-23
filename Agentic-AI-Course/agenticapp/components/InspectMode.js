import { useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/InspectMode.module.css";

const InspectContext = createContext({ active: false, toggle: () => {} });

export function useInspect() {
  return useContext(InspectContext);
}

export function InspectProvider({ children }) {
  const [active, setActive] = useState(false);
  return (
    <InspectContext.Provider value={{ active, toggle: () => setActive((v) => !v) }}>
      {children}
    </InspectContext.Provider>
  );
}

export function InspectToggle() {
  const { active, toggle } = useInspect();
  return (
    <button
      className={`${styles.inspectToggle} ${active ? styles.inspectToggleActive : ""}`}
      onClick={toggle}
      title="Inspect how Scwripts works under the hood"
    >
      {active ? "Inspecting" : "Inspect"}
    </button>
  );
}

const PAGE_INSPECTIONS = {
  chat: {
    title: "AI Tutor — Chat Pipeline",
    sections: [
      {
        label: "System Prompt",
        icon: "📝",
        type: "code",
        content: `You are Scwripts AI Tutor, an expert
in Agentic AI. You help students
understand concepts from their course.
Be encouraging and use the Socratic
method when possible.

Format responses using Markdown:
- **bold** for key terms
- Bullet points for lists
- \`code\` for technical terms
- Headings for structure`,
      },
      {
        label: "Model",
        icon: "🤖",
        type: "info",
        rows: [
          { label: "Provider", value: "Anthropic" },
          { label: "Model", value: "claude-sonnet-4-20250514", badge: true },
          { label: "Max Tokens", value: "1,024" },
          { label: "Streaming", value: "SSE (Server-Sent Events)" },
        ],
      },
      {
        label: "Streaming Architecture",
        icon: "⚡",
        type: "pipeline",
        steps: [
          { icon: "💬", text: "User sends message" },
          { icon: "🔐", text: "JWT auth validated" },
          { icon: "💾", text: "Message saved to ChatSession" },
          { icon: "🧠", text: "Engagement context injected (if enabled)" },
          { icon: "📡", text: "Stream opened to Anthropic API" },
          { icon: "📨", text: "SSE chunks: data: {text}\\n\\n" },
          { icon: "🖥️", text: "React incrementally renders Markdown" },
        ],
      },
      {
        label: "Adaptive Engagement",
        icon: "🧠",
        type: "code",
        content: `// Engagement context appended to system prompt:
if (avg_engagement < 30 && emotion == "sad"):
  "Be encouraging, break into smaller steps"
if (avg_engagement < 50):
  "Keep response concise, end with question"
if (avg_engagement >= 75):
  "Increase complexity, challenge them"`,
      },
    ],
    lessonLink: { text: "Learn about Tool Use in Agentic AI", slug: "agentic-ai", slide: 7 },
  },

  quiz: {
    title: "Quiz — Grading Pipeline",
    sections: [
      {
        label: "Grading Algorithm",
        icon: "📊",
        type: "code",
        content: `for each answer in submission:
  correct = question.correct_option
  if answer == correct:
    score += 1

percentage = (score / total) * 100
pass = percentage >= 70`,
      },
      {
        label: "XP Award Logic",
        icon: "⭐",
        type: "info",
        rows: [
          { label: "Base XP", value: "20 XP" },
          { label: "Perfect Score", value: "100 XP" },
          { label: "Formula", value: "20 + (score/100 * 80)" },
          { label: "Quest Progress", value: "pass_quiz +1" },
        ],
      },
      {
        label: "Pipeline",
        icon: "⚡",
        type: "pipeline",
        steps: [
          { icon: "📝", text: "Student submits answers" },
          { icon: "✅", text: "Server grades against correct_option" },
          { icon: "⭐", text: "XP awarded based on score" },
          { icon: "🏆", text: "Achievement check triggered" },
          { icon: "📊", text: "Quest progress updated" },
        ],
      },
    ],
    lessonLink: { text: "Learn about Agent Evaluation", slug: "agentic-ai", slide: 14 },
  },

  slides: {
    title: "Slide Viewer — Content Pipeline",
    sections: [
      {
        label: "Architecture",
        icon: "🏗️",
        type: "pipeline",
        steps: [
          { icon: "📡", text: "Fetch slides from /api/courses/{slug}/slides" },
          { icon: "🔄", text: "Transform API response → slide format" },
          { icon: "🖼️", text: "Render based on slide_type (title/content/end)" },
          { icon: "⌨️", text: "Arrow keys / spacebar for navigation" },
          { icon: "⭐", text: "XP awarded on slide completion" },
        ],
      },
      {
        label: "Slide Types",
        icon: "📋",
        type: "info",
        rows: [
          { label: "title", value: "Course title slide" },
          { label: "content", value: "Standard lesson content" },
          { label: "end", value: "Course completion slide" },
          { label: "interactive_3d", value: "Three.js visualization", badge: true },
        ],
      },
      {
        label: "Engagement Tracking",
        icon: "🧠",
        type: "code",
        content: `// Every 5 seconds during slides:
webcam frame → base64 → /api/engagement/analyze
→ UniFace: emotion + gaze detection
→ Engagement score (0-100)
  = 50% emotion + 30% gaze + 20% presence`,
      },
    ],
    lessonLink: { text: "Learn about Agent Memory", slug: "agentic-ai", slide: 10 },
  },

  dashboard: {
    title: "Dashboard — Data Aggregation",
    sections: [
      {
        label: "Data Sources",
        icon: "📊",
        type: "pipeline",
        steps: [
          { icon: "📚", text: "Enrollments from /api/courses/enrollments/me" },
          { icon: "⭐", text: "XP & Level from /api/gamification/profile" },
          { icon: "🧠", text: "Engagement from /api/engagement/summary/{slug}" },
          { icon: "🏆", text: "Achievements from /api/gamification/dashboard" },
        ],
      },
      {
        label: "Gamification System",
        icon: "🎮",
        type: "info",
        rows: [
          { label: "Level System", value: "XP thresholds → L1-50" },
          { label: "Streak", value: "Consecutive daily logins" },
          { label: "Leaderboard", value: "Weekly XP ranking" },
          { label: "Quests", value: "3 daily, auto-generated" },
        ],
      },
    ],
    lessonLink: { text: "Learn about Agent Planning", slug: "agentic-ai", slide: 11 },
  },
};

function getPageKey(pathname) {
  if (pathname.includes("/chat")) return "chat";
  if (pathname.includes("/quiz")) return "quiz";
  if (pathname.includes("/slides")) return "slides";
  if (pathname.includes("/dashboard")) return "dashboard";
  return null;
}

export default function InspectPanel() {
  const { active, toggle } = useInspect();
  const router = useRouter();

  if (!active) return null;

  const pageKey = getPageKey(router.pathname);
  const inspection = pageKey ? PAGE_INSPECTIONS[pageKey] : null;

  if (!inspection) {
    return (
      <div className={styles.inspectOverlay}>
        <div className={styles.inspectPanel}>
          <div className={styles.inspectHeader}>
            <span className={styles.inspectHeaderIcon}>🔍</span>
            <span className={styles.inspectTitle}>Inspect Mode</span>
            <button className={styles.inspectClose} onClick={toggle}>
              &times;
            </button>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 }}>
            Navigate to the <strong>Chat</strong>, <strong>Quiz</strong>,{" "}
            <strong>Slides</strong>, or <strong>Dashboard</strong> pages to see
            how Scwripts works under the hood.
          </p>
          <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: "12px" }}>
            The platform teaches Agentic AI by exposing its own AI architecture.
            Every feature you use IS the lesson.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inspectOverlay}>
      <div className={styles.inspectPanel}>
        <div className={styles.inspectHeader}>
          <span className={styles.inspectHeaderIcon}>🔍</span>
          <span className={styles.inspectTitle}>{inspection.title}</span>
          <button className={styles.inspectClose} onClick={toggle}>
            &times;
          </button>
        </div>

        {inspection.sections.map((section, i) => (
          <div key={i} className={styles.inspectSection}>
            <div className={styles.sectionLabel}>
              <span className={styles.sectionIcon}>{section.icon}</span>
              {section.label}
            </div>

            {section.type === "code" && (
              <div className={styles.codeBlock}>{section.content}</div>
            )}

            {section.type === "info" && (
              <div>
                {section.rows.map((row, j) => (
                  <div key={j} className={styles.infoRow}>
                    <span className={styles.infoLabel}>{row.label}</span>
                    {row.badge ? (
                      <span className={styles.infoBadge}>{row.value}</span>
                    ) : (
                      <span className={styles.infoValue}>{row.value}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.type === "pipeline" && (
              <div className={styles.pipelineFlow}>
                {section.steps.map((step, j) => (
                  <div key={j}>
                    <div className={styles.pipelineStep}>
                      <span className={styles.pipelineStepIcon}>{step.icon}</span>
                      {step.text}
                    </div>
                    {j < section.steps.length - 1 && (
                      <div className={styles.pipelineArrow}>↓</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {inspection.lessonLink && (
          <a
            href={`/courses/${inspection.lessonLink.slug}/slides`}
            className={styles.lessonLink}
          >
            📖 {inspection.lessonLink.text} →
          </a>
        )}
      </div>
    </div>
  );
}
