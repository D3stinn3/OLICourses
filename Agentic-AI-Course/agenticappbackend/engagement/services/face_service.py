import base64
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Lazy-load UniFace models to avoid import errors if not installed
_detector = None
_emotion_model = None
_gaze_model = None


def _get_models():
    global _detector, _emotion_model, _gaze_model
    if _detector is None:
        try:
            from uniface.detection import RetinaFace
            from uniface import Emotion, MobileGaze
            _detector = RetinaFace()
            _emotion_model = Emotion()
            _gaze_model = MobileGaze()
        except ImportError:
            logger.warning("UniFace not installed. Engagement analysis unavailable.")
        except Exception as e:
            logger.warning(f"Failed to initialize UniFace: {e}")
    return _detector, _emotion_model, _gaze_model


# Emotion valence mapping (positive = engaged, negative = disengaged)
EMOTION_VALENCE = {
    "happy": 0.9,
    "neutral": 0.6,
    "surprise": 0.7,
    "sad": 0.2,
    "fear": 0.15,
    "disgust": 0.1,
    "angry": 0.1,
    "contempt": 0.15,
}


class FaceService:
    @staticmethod
    def analyze_frame(base64_image):
        """Analyze a base64-encoded image frame for emotion and gaze."""
        try:
            import cv2
        except ImportError:
            return FaceService._fallback_result()

        detector, emotion_model, gaze_model = _get_models()
        if detector is None:
            return FaceService._fallback_result()

        try:
            # Decode base64 image
            if "," in base64_image:
                base64_image = base64_image.split(",")[1]

            image_data = base64.b64decode(base64_image)
            np_arr = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                return FaceService._no_face_result()

            # Detect faces
            faces = detector.detect(frame)
            if not faces or len(faces) == 0:
                return FaceService._no_face_result()

            face = faces[0]

            # Emotion analysis
            emotion = "neutral"
            confidence = 0.5
            try:
                emotion, confidence = emotion_model.predict(frame, face.landmarks)
                emotion = emotion.lower()
            except Exception:
                pass

            # Gaze estimation
            gaze_pitch = 0.0
            gaze_yaw = 0.0
            try:
                bbox = face.bbox.astype(int)
                x1, y1, x2, y2 = bbox
                face_crop = frame[max(0, y1):y2, max(0, x1):x2]
                if face_crop.size > 0:
                    pitch, yaw = gaze_model.estimate(face_crop)
                    gaze_pitch = float(np.degrees(pitch))
                    gaze_yaw = float(np.degrees(yaw))
            except Exception:
                pass

            engagement_score = FaceService.compute_engagement_score(
                emotion, confidence, gaze_pitch, gaze_yaw, True
            )

            return {
                "emotion": emotion,
                "emotion_confidence": round(float(confidence), 3),
                "gaze_pitch": round(gaze_pitch, 1),
                "gaze_yaw": round(gaze_yaw, 1),
                "engagement_score": round(engagement_score, 1),
                "face_detected": True,
            }

        except Exception as e:
            logger.error(f"Frame analysis failed: {e}")
            return FaceService._fallback_result()

    @staticmethod
    def compute_engagement_score(emotion, confidence, gaze_pitch, gaze_yaw, face_present):
        if not face_present:
            return 0.0

        # Emotion component (0-50 points)
        valence = EMOTION_VALENCE.get(emotion, 0.4)
        emotion_score = valence * confidence * 50

        # Gaze component (0-30 points) — closer to center = more focused
        gaze_deviation = abs(gaze_pitch) + abs(gaze_yaw)
        gaze_score = max(0, 30 - gaze_deviation * 0.8)

        # Presence component (0-20 points)
        presence_score = 20.0

        return min(100, emotion_score + gaze_score + presence_score)

    @staticmethod
    def get_adaptive_hint(emotion, engagement_score):
        if engagement_score < 30:
            if emotion in ("sad", "fear", "angry"):
                return "frustrated"
            return "disengaged"
        elif engagement_score < 50:
            if emotion == "surprise":
                return "confused"
            return "drifting"
        elif engagement_score >= 75:
            return "engaged"
        return "neutral"

    @staticmethod
    def _no_face_result():
        return {
            "emotion": "unknown",
            "emotion_confidence": 0.0,
            "gaze_pitch": 0.0,
            "gaze_yaw": 0.0,
            "engagement_score": 0.0,
            "face_detected": False,
        }

    @staticmethod
    def _fallback_result():
        return {
            "emotion": "neutral",
            "emotion_confidence": 0.5,
            "gaze_pitch": 0.0,
            "gaze_yaw": 0.0,
            "engagement_score": 50.0,
            "face_detected": False,
        }
