import { useState } from "react";
import styles from "../styles/Engagement.module.css";

export default function EngagementConsent({ onEnable, onDismiss }) {
  const [loading, setLoading] = useState(false);

  async function handleEnable() {
    setLoading(true);
    try {
      await onEnable();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.consentOverlay}>
      <div className={styles.consentModal}>
        <span className={styles.consentIcon}>🧠</span>
        <h2 className={styles.consentTitle}>Enable Smart Learning</h2>
        <p className={styles.consentDesc}>
          Scwripts can use your webcam to understand how you&apos;re feeling and
          adapt lessons in real-time. Focus drifting? We&apos;ll make things more
          engaging. Feeling stuck? We&apos;ll simplify.
        </p>

        <ul className={styles.consentFeatures}>
          <li className={styles.consentFeature}>
            <span className={styles.featureIcon}>🎯</span>
            <span>AI tutor adapts to your engagement level</span>
          </li>
          <li className={styles.consentFeature}>
            <span className={styles.featureIcon}>📊</span>
            <span>Personal engagement analytics dashboard</span>
          </li>
          <li className={styles.consentFeature}>
            <span className={styles.featureIcon}>😌</span>
            <span>Smart break suggestions when frustration is detected</span>
          </li>
          <li className={styles.consentFeature}>
            <span className={styles.featureIcon}>🔒</span>
            <span>No images are stored — only aggregated scores</span>
          </li>
        </ul>

        <div className={styles.consentPrivacy}>
          <p className={styles.privacyText}>
            Your privacy matters. Face images are processed instantly and never
            saved. Only engagement scores are stored. You own your data and can
            disable this anytime — all data is deleted when you opt out.
          </p>
        </div>

        <div className={styles.consentButtons}>
          <button
            className={styles.consentEnable}
            onClick={handleEnable}
            disabled={loading}
          >
            {loading ? "Enabling..." : "Enable Smart Learning"}
          </button>
          <button className={styles.consentDismiss} onClick={onDismiss}>
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
