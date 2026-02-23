import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import AuthGuard from "../components/AuthGuard";
import { getMyAgent, getAgentCapabilities, getXPProfile } from "../lib/api";
import styles from "../styles/Gamification.module.css";

const CAPABILITY_ICONS = {
  "basic-qa": "💬",
  explanation: "📖",
  "web-search": "🔍",
  "code-analysis": "💻",
  memory: "🧠",
  planning: "📋",
  "tool-use": "🔧",
  delegation: "👥",
  "self-reflection": "🪞",
  autonomy: "🚀",
};

const AGENT_STAGES = [
  { level: 1, name: "Seedling", emoji: "🌱", desc: "A basic agent that can answer yes/no" },
  { level: 5, name: "Sprout", emoji: "🌿", desc: "Can explain concepts clearly" },
  { level: 10, name: "Sapling", emoji: "🌳", desc: "Gained analysis capabilities" },
  { level: 20, name: "Tree", emoji: "🌲", desc: "Can plan and use tools" },
  { level: 30, name: "Grove", emoji: "🏔️", desc: "Commands a swarm of sub-agents" },
  { level: 40, name: "Forest", emoji: "🌌", desc: "Self-reflecting autonomous system" },
];

export default function MyAgentPage() {
  const [agent, setAgent] = useState(null);
  const [capabilities, setCapabilities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyAgent(), getAgentCapabilities(), getXPProfile()])
      .then(([agentData, capData, profileData]) => {
        setAgent(agentData);
        setCapabilities(Array.isArray(capData) ? capData : capData.results || []);
        setProfile(profileData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const userLevel = profile?.level || 1;

  function getCurrentStage() {
    let stage = AGENT_STAGES[0];
    for (const s of AGENT_STAGES) {
      if (userLevel >= s.level) stage = s;
    }
    return stage;
  }

  const stage = getCurrentStage();

  return (
    <Layout>
      <Head>
        <title>My Agent — Scwripts</title>
      </Head>

      <AuthGuard>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
          <h1
            style={{
              fontSize: "2rem",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 8,
            }}
          >
            My Agent
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: 32 }}>
            Your personal AI agent evolves as you learn. Complete lessons to
            unlock new capabilities.
          </p>

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading your agent...</p>
          ) : (
            <>
              {/* Agent Avatar */}
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(96,165,250,0.15)",
                  borderRadius: 20,
                  marginBottom: 32,
                }}
              >
                <div style={{ fontSize: "5rem", marginBottom: 12 }}>
                  {stage.emoji}
                </div>
                <h2
                  style={{
                    color: "#e2e8f0",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {agent?.name || "Agent"} — {stage.name}
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: 16 }}>
                  {stage.desc}
                </p>
                <div
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    padding: "4px 16px",
                    borderRadius: 12,
                  }}
                >
                  Level {userLevel}
                </div>
              </div>

              {/* Evolution Timeline */}
              <h3
                style={{
                  color: "#e2e8f0",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                Evolution Path
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 32,
                }}
              >
                {AGENT_STAGES.map((s, i) => {
                  const unlocked = userLevel >= s.level;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "12px 16px",
                        background: unlocked
                          ? "rgba(96,165,250,0.06)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${
                          unlocked
                            ? "rgba(96,165,250,0.2)"
                            : "rgba(255,255,255,0.05)"
                        }`,
                        borderRadius: 12,
                        opacity: unlocked ? 1 : 0.5,
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{s.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: unlocked ? "#e2e8f0" : "#64748b",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          {s.name}
                        </div>
                        <div
                          style={{
                            color: unlocked ? "#94a3b8" : "#475569",
                            fontSize: "0.8rem",
                          }}
                        >
                          {s.desc}
                        </div>
                      </div>
                      <div
                        style={{
                          color: unlocked ? "#4ade80" : "#475569",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {unlocked ? "Unlocked" : `Lv ${s.level}`}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Capabilities */}
              <h3
                style={{
                  color: "#e2e8f0",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                Capabilities
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 10,
                }}
              >
                {capabilities.map((cap) => {
                  const unlocked = userLevel >= (cap.required_level || cap.required_user_level || 0);
                  const slug = cap.slug || "";
                  return (
                    <div
                      key={cap.id || cap.slug}
                      style={{
                        padding: "16px",
                        background: unlocked
                          ? "rgba(74,222,128,0.06)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${
                          unlocked
                            ? "rgba(74,222,128,0.2)"
                            : "rgba(255,255,255,0.05)"
                        }`,
                        borderRadius: 12,
                        opacity: unlocked ? 1 : 0.45,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>
                        {CAPABILITY_ICONS[slug] || "⚡"}
                      </div>
                      <div
                        style={{
                          color: unlocked ? "#e2e8f0" : "#64748b",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          marginBottom: 4,
                        }}
                      >
                        {cap.name}
                      </div>
                      <div
                        style={{
                          color: unlocked ? "#94a3b8" : "#475569",
                          fontSize: "0.75rem",
                        }}
                      >
                        {unlocked
                          ? "Active"
                          : `Requires Lv ${cap.required_level || cap.required_user_level}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </AuthGuard>
    </Layout>
  );
}
