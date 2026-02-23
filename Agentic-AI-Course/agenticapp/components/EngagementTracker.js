import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getEngagementConsent,
  updateEngagementConsent,
  analyzeEngagement,
  getEngagementLive,
} from "../lib/api";
import EngagementConsent from "./EngagementConsent";
import styles from "../styles/Engagement.module.css";

const CAPTURE_INTERVAL = 5000; // 5 seconds

export default function EngagementTracker({ courseSlug }) {
  const { user } = useAuth();
  const [consentStatus, setConsentStatus] = useState(null);
  const [showConsent, setShowConsent] = useState(false);
  const [engagement, setEngagement] = useState(null);
  const [suggestBreak, setSuggestBreak] = useState(false);
  const [breakDismissed, setBreakDismissed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  // Check consent on mount
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    getEngagementConsent()
      .then((data) => {
        if (!data || data.detail) {
          setConsentStatus(false);
          return;
        }
        setConsentStatus(data.enabled);
        if (!data.enabled) {
          const dismissed = localStorage.getItem("engagement_consent_dismissed");
          if (!dismissed) setShowConsent(true);
        }
      })
      .catch(() => setConsentStatus(false));
  }, [user]);

  // Start webcam when consent is granted
  useEffect(() => {
    if (!consentStatus || !courseSlug) return;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" },
        });
        streamRef.current = stream;

        // Hidden video for canvas capture
        if (!videoRef.current) {
          const video = document.createElement("video");
          video.srcObject = stream;
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          videoRef.current = video;
        }

        // Visible preview video
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }

        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas");
          canvasRef.current.width = 320;
          canvasRef.current.height = 240;
        }
      } catch {
        setConsentStatus(false);
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [consentStatus, courseSlug]);

  // Attach stream to preview video when it becomes visible
  useEffect(() => {
    if (showPreview && previewVideoRef.current && streamRef.current) {
      previewVideoRef.current.srcObject = streamRef.current;
    }
  }, [showPreview]);

  // Capture and analyze frames
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !consentStatus) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const base64 = canvasRef.current.toDataURL("image/jpeg", 0.6);

    try {
      const data = await analyzeEngagement(base64, courseSlug);
      if (data && !data.detail) {
        setEngagement(data);

        if (data.face_detected && !breakDismissed) {
          const liveData = await getEngagementLive(courseSlug);
          if (liveData && liveData.suggest_break) {
            setSuggestBreak(true);
          }
        }
      }
    } catch {
      // Silently fail
    }
  }, [consentStatus, courseSlug, breakDismissed]);

  useEffect(() => {
    if (!consentStatus) return;
    intervalRef.current = setInterval(captureFrame, CAPTURE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [consentStatus, captureFrame]);

  async function handleEnableConsent() {
    try {
      const data = await updateEngagementConsent(true);
      if (data && !data.detail) {
        setConsentStatus(true);
        setShowConsent(false);
      }
    } catch {
      // Failed
    }
  }

  function handleDismissConsent() {
    setShowConsent(false);
    localStorage.setItem("engagement_consent_dismissed", "true");
  }

  async function handleDisable() {
    try {
      await updateEngagementConsent(false);
    } catch {
      // Failed
    }

    setConsentStatus(false);
    setEngagement(null);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    clearInterval(intervalRef.current);
  }

  function getDotClass() {
    if (!engagement) return "";
    if (!engagement.face_detected) return styles.dotNoFace;
    const score = engagement.engagement_score;
    if (score >= 65) return styles.dotHigh;
    if (score >= 35) return styles.dotMedium;
    return styles.dotLow;
  }

  function getEmotionLabel() {
    if (!engagement) return "Starting...";
    if (!engagement.face_detected) return "No face detected";
    const map = {
      happy: "Engaged",
      neutral: "Neutral",
      surprise: "Curious",
      sad: "Low Energy",
      fear: "Anxious",
      angry: "Frustrated",
      disgust: "Disengaged",
      contempt: "Bored",
    };
    return map[engagement.emotion] || "Analyzing...";
  }

  function getScoreDisplay() {
    if (!engagement || !engagement.face_detected) return null;
    return Math.round(engagement.engagement_score);
  }

  if (!user) return null;

  return (
    <>
      {showConsent && (
        <EngagementConsent
          onEnable={handleEnableConsent}
          onDismiss={handleDismissConsent}
        />
      )}

      {consentStatus && (
        <div
          className={styles.trackerWrap}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <div className={`${styles.engagementDot} ${getDotClass()}`} />
          <span className={styles.trackerLabel}>{getEmotionLabel()}</span>
          {getScoreDisplay() !== null && (
            <span className={styles.trackerScore}>{getScoreDisplay()}%</span>
          )}
          <button className={styles.trackerToggle} onClick={handleDisable}>
            Disable
          </button>

          {showPreview && (
            <div className={styles.previewWrap}>
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className={styles.previewVideo}
              />
              <div className={styles.previewOverlay}>
                {engagement && engagement.face_detected && (
                  <span className={styles.previewScore}>
                    {Math.round(engagement.engagement_score)}% engaged
                  </span>
                )}
                {engagement && !engagement.face_detected && (
                  <span className={styles.previewNoFace}>
                    No face in frame
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {suggestBreak && !breakDismissed && (
        <div className={styles.breakBanner}>
          <p className={styles.breakText}>
            You&apos;ve been studying for a while. A short break can help you
            retain more!
          </p>
          <button
            className={styles.breakDismiss}
            onClick={() => {
              setSuggestBreak(false);
              setBreakDismissed(true);
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}
