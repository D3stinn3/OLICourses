import { useState, useEffect } from "react";
import {
  getEngagementConsent,
  updateEngagementConsent,
  getEngagementSummary,
} from "../lib/api";
import styles from "../styles/Engagement.module.css";

const EMOTION_EMOJI = {
  happy: "😊",
  neutral: "😐",
  surprise: "😲",
  sad: "😢",
  fear: "😰",
  angry: "😠",
  disgust: "🤢",
  contempt: "😒",
};

export default function EngagementDashboard({ courseSlug }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [engagementEnabled, setEngagementEnabled] = useState(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setEngagementEnabled(false);
      return;
    }

    getEngagementConsent()
      .then((data) => {
        if (data && !data.detail) setEngagementEnabled(!!data.enabled);
        else setEngagementEnabled(false);
      })
      .catch(() => setEngagementEnabled(false));
  }, []);

  useEffect(() => {
    if (!courseSlug) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getEngagementSummary(courseSlug)
      .then((data) => {
        if (Array.isArray(data)) setSummaries(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseSlug]);

  async function handleToggleEngagement() {
    setToggling(true);
    const newValue = !engagementEnabled;

    try {
      const data = await updateEngagementConsent(newValue);
      if (data && !data.detail) {
        setEngagementEnabled(newValue);
        if (newValue) {
          localStorage.removeItem("engagement_consent_dismissed");
        }
      }
    } catch {
      // Failed to update
    } finally {
      setToggling(false);
    }
  }

  if (loading) return null;

  if (summaries.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🧠</div>
        <p className={styles.emptyText}>No engagement data yet</p>
        <p className={styles.emptyHint}>
          Enable Smart Learning to get real-time emotion and attention tracking
          while you study. Your webcam analyzes focus levels and adapts the AI
          tutor to your engagement.
        </p>
        <button
          className={
            engagementEnabled ? styles.toggleDisable : styles.toggleEnable
          }
          onClick={handleToggleEngagement}
          disabled={toggling}
        >
          {toggling
            ? "Updating..."
            : engagementEnabled
            ? "Disable Smart Learning"
            : "Enable Smart Learning"}
        </button>
        {engagementEnabled && (
          <p className={styles.emptyHint} style={{ marginTop: "12px" }}>
            Smart Learning is active. Go to a course&apos;s Slides or Chat page
            to see it in action.
          </p>
        )}
      </div>
    );
  }

  // Compute stats
  const avgEngagement =
    summaries.reduce((sum, s) => sum + s.avg_engagement, 0) / summaries.length;
  const totalMinutes = summaries.reduce((sum, s) => sum + s.total_minutes, 0);
  const totalDrops = summaries.reduce((sum, s) => sum + s.attention_drops, 0);

  // Emotion distribution
  const emotionCounts = {};
  summaries.forEach((s) => {
    emotionCounts[s.dominant_emotion] =
      (emotionCounts[s.dominant_emotion] || 0) + 1;
  });

  // Insights
  const insights = [];
  if (avgEngagement >= 70) {
    insights.push(
      "You maintain strong focus during your study sessions. Keep it up!"
    );
  } else if (avgEngagement < 40) {
    insights.push(
      "Your engagement tends to be low. Try shorter, more focused sessions."
    );
  }
  if (totalDrops > summaries.length * 3) {
    insights.push(
      "You experience frequent attention drops. Consider enabling break suggestions."
    );
  }
  const topEmotion = Object.entries(emotionCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];
  if (topEmotion) {
    insights.push(
      `Your most common state is "${topEmotion[0]}" (${topEmotion[1]} sessions).`
    );
  }

  function scoreClass(score) {
    if (score >= 65) return "High";
    if (score >= 35) return "Medium";
    return "Low";
  }

  return (
    <div>
      <h3 className={styles.sectionTitle}>Engagement Overview</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{Math.round(avgEngagement)}%</div>
          <div className={styles.statLabel}>Avg Engagement</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{summaries.length}</div>
          <div className={styles.statLabel}>Sessions Tracked</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{Math.round(totalMinutes)}m</div>
          <div className={styles.statLabel}>Total Study Time</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalDrops}</div>
          <div className={styles.statLabel}>Attention Drops</div>
        </div>
      </div>

      {Object.keys(emotionCounts).length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>Emotion Distribution</h3>
          <div className={styles.emotionGrid}>
            {Object.entries(emotionCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([emotion, count]) => (
                <div key={emotion} className={styles.emotionCard}>
                  <div className={styles.emotionEmoji}>
                    {EMOTION_EMOJI[emotion] || "🔵"}
                  </div>
                  <div className={styles.emotionName}>{emotion}</div>
                  <div className={styles.emotionCount}>
                    {count} session{count !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {insights.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>Personal Insights</h3>
          {insights.map((insight, i) => (
            <div key={i} className={styles.insightCard}>
              <p className={styles.insightText}>{insight}</p>
            </div>
          ))}
        </>
      )}

      <h3 className={styles.sectionTitle}>Session History</h3>
      <div className={styles.sessionList}>
        {summaries.map((s, i) => {
          const level = scoreClass(s.avg_engagement);
          return (
            <div key={i} className={styles.sessionRow}>
              <span className={styles.sessionDate}>{s.session_date}</span>
              <span className={styles.sessionEmotion}>
                {EMOTION_EMOJI[s.dominant_emotion] || "🔵"}
              </span>
              <div className={styles.sessionBar}>
                <div
                  className={`${styles.sessionFill} ${
                    level === "High"
                      ? styles.fillHigh
                      : level === "Medium"
                      ? styles.fillMedium
                      : styles.fillLow
                  }`}
                  style={{ width: `${Math.min(100, s.avg_engagement)}%` }}
                />
              </div>
              <span
                className={`${styles.sessionScore} ${
                  level === "High"
                    ? styles.scoreHigh
                    : level === "Medium"
                    ? styles.scoreMedium
                    : styles.scoreLow
                }`}
              >
                {Math.round(s.avg_engagement)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.toggleSection}>
        <button
          className={
            engagementEnabled ? styles.toggleDisable : styles.toggleEnable
          }
          onClick={handleToggleEngagement}
          disabled={toggling}
        >
          {toggling
            ? "Updating..."
            : engagementEnabled
            ? "Disable Smart Learning"
            : "Enable Smart Learning"}
        </button>
      </div>
    </div>
  );
}
