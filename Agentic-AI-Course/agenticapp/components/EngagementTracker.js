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
  const [mirrorOpen, setMirrorOpen] = useState(false);
  const videoRef = useRef(null);
  const mirrorVideoRef = useRef(null);
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
          video: { width: 640, height: 480, facingMode: "user" },
        });
        streamRef.current = stream;

        // Hidden video for canvas capture
        if (!videoRef.current) {
          const video = document.createElement("video");
          video.srcObject = stream;
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          await video.play();
          videoRef.current = video;
        }

        // Attach to mirror if visible
        if (mirrorVideoRef.current) {
          mirrorVideoRef.current.srcObject = stream;
        }

        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas");
          canvasRef.current.width = 640;
          canvasRef.current.height = 480;
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

  // Attach stream to mirror video when toggled on
  useEffect(() => {
    if (mirrorOpen && mirrorVideoRef.current && streamRef.current) {
      mirrorVideoRef.current.srcObject = streamRef.current;
    }
  }, [mirrorOpen]);

  // Capture and analyze frames
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !consentStatus) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const base64 = canvasRef.current.toDataURL("image/jpeg", 0.8);

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
    setMirrorOpen(false);

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

  function getMirrorBorderClass() {
    if (!engagement) return styles.mirrorBorderNeutral;
    if (!engagement.face_detected) return styles.mirrorBorderNoFace;
    return styles.mirrorBorderDetected;
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
        <div className={styles.trackerWrap}>
          <div className={`${styles.engagementDot} ${getDotClass()}`} />
          <span className={styles.trackerLabel}>{getEmotionLabel()}</span>
          {getScoreDisplay() !== null && (
            <span className={styles.trackerScore}>{getScoreDisplay()}%</span>
          )}
          <button
            className={styles.trackerCameraBtn}
            onClick={() => setMirrorOpen((v) => !v)}
            title={mirrorOpen ? "Hide camera preview" : "Show camera preview"}
            aria-label={mirrorOpen ? "Hide camera preview" : "Show camera preview"}
          >
            {mirrorOpen ? "\u25A0" : "\u25CB"}
          </button>
          <button className={styles.trackerToggle} onClick={handleDisable}>
            Disable
          </button>
        </div>
      )}

      {consentStatus && mirrorOpen && (
        <div
          className={`${styles.mirrorWrap} ${getMirrorBorderClass()}`}
          role="status"
          aria-label="Camera preview for engagement tracking"
        >
          <video
            ref={mirrorVideoRef}
            autoPlay
            playsInline
            muted
            className={styles.mirrorVideo}
          />
          <div className={styles.mirrorOverlay}>
            {engagement && engagement.face_detected && (
              <div className={styles.mirrorStatus}>
                <span className={styles.mirrorDetected}>
                  Face detected
                </span>
                <span className={styles.mirrorScore}>
                  {Math.round(engagement.engagement_score)}% engaged
                </span>
              </div>
            )}
            {engagement && !engagement.face_detected && (
              <div className={styles.mirrorStatus}>
                <span className={styles.mirrorNotDetected}>
                  No face in frame
                </span>
                <span className={styles.mirrorHint}>
                  Position your face in the camera view
                </span>
              </div>
            )}
            {!engagement && (
              <div className={styles.mirrorStatus}>
                <span className={styles.mirrorStarting}>
                  Initializing...
                </span>
              </div>
            )}
          </div>
          <button
            className={styles.mirrorClose}
            onClick={() => setMirrorOpen(false)}
            aria-label="Close camera preview"
          >
            &times;
          </button>
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
