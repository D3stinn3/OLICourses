import base64
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Lazy-load models individually — RetinaFace uses ONNX, Emotion/MobileGaze need PyTorch
_detector = None
_detector_loaded = False
_emotion_model = None
_gaze_model = None
_haar_cascade = None


def _get_detector():
    """Load RetinaFace detector (ONNX-based, no PyTorch needed)."""
    global _detector, _detector_loaded
    if _detector_loaded:
        return _detector
    _detector_loaded = True
    try:
        from uniface.detection import RetinaFace
        _detector = RetinaFace(confidence_threshold=0.3)
        logger.info("RetinaFace detector loaded (confidence_threshold=0.3).")
    except ImportError:
        logger.warning("uniface not installed. Trying OpenCV Haar cascade fallback.")
    except Exception as e:
        logger.warning(f"RetinaFace init failed: {e}. Trying Haar cascade fallback.")
    return _detector


def _get_emotion_model():
    """Load Emotion model (requires PyTorch)."""
    global _emotion_model
    if _emotion_model is not None:
        return _emotion_model
    try:
        from uniface import Emotion
        _emotion_model = Emotion()
        logger.info("Emotion model loaded successfully.")
    except Exception:
        pass
    return _emotion_model


def _get_gaze_model():
    """Load MobileGaze model (requires PyTorch)."""
    global _gaze_model
    if _gaze_model is not None:
        return _gaze_model
    try:
        from uniface import MobileGaze
        _gaze_model = MobileGaze()
        logger.info("MobileGaze model loaded successfully.")
    except Exception:
        pass
    return _gaze_model


def _get_haar_cascade():
    """Fallback face detector using OpenCV Haar cascades."""
    global _haar_cascade
    if _haar_cascade is not None:
        return _haar_cascade
    try:
        import cv2
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        _haar_cascade = cv2.CascadeClassifier(cascade_path)
        if _haar_cascade.empty():
            _haar_cascade = None
            logger.warning("Haar cascade file not found.")
        else:
            logger.info("Haar cascade fallback loaded.")
    except Exception as e:
        logger.warning(f"Haar cascade init failed: {e}")
    return _haar_cascade


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

        try:
            # Decode base64 image
            if "," in base64_image:
                base64_image = base64_image.split(",")[1]

            image_data = base64.b64decode(base64_image)
            np_arr = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                return FaceService._no_face_result()

            # Try RetinaFace first, fall back to Haar cascade
            face_data = FaceService._detect_with_retinaface(frame)
            if face_data is None:
                face_data = FaceService._detect_with_haar(frame, cv2)
            if face_data is None:
                return FaceService._no_face_result()

            face_obj, bbox = face_data

            # Emotion analysis
            emotion = "neutral"
            confidence = 0.6
            emotion_model = _get_emotion_model()
            if emotion_model is not None and face_obj is not None:
                try:
                    emotion, confidence = emotion_model.predict(frame, face_obj.landmarks)
                    emotion = emotion.lower()
                except Exception:
                    pass

            # Gaze estimation
            gaze_pitch = 0.0
            gaze_yaw = 0.0
            gaze_model = _get_gaze_model()
            if gaze_model is not None and bbox is not None:
                try:
                    x1, y1, x2, y2 = bbox
                    face_crop = frame[max(0, y1):y2, max(0, x1):x2]
                    if face_crop.size > 0:
                        pitch, yaw = gaze_model.estimate(face_crop)
                        gaze_pitch = float(np.degrees(pitch))
                        gaze_yaw = float(np.degrees(yaw))
                except Exception:
                    pass

            # If no gaze model, estimate from face position in frame
            if gaze_model is None and bbox is not None:
                gaze_pitch, gaze_yaw = FaceService._estimate_gaze_from_position(
                    bbox, frame.shape
                )

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
    def _detect_with_retinaface(frame):
        """Try RetinaFace detection. Returns (face_obj, bbox) or None."""
        detector = _get_detector()
        if detector is None:
            return None
        try:
            faces = detector.detect(frame)
            if not faces or len(faces) == 0:
                return None
            face = faces[0]
            bbox = face.bbox.astype(int).tolist()
            return face, bbox
        except Exception as e:
            logger.warning(f"RetinaFace detection error: {e}")
            return None

    @staticmethod
    def _detect_with_haar(frame, cv2):
        """Fallback: Haar cascade detection. Returns (None, bbox) or None."""
        cascade = _get_haar_cascade()
        if cascade is None:
            return None
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = cascade.detectMultiScale(
                gray, scaleFactor=1.05, minNeighbors=3, minSize=(30, 30)
            )
            if len(faces) == 0:
                return None
            x, y, w, h = faces[0]
            bbox = [int(x), int(y), int(x + w), int(y + h)]
            return None, bbox
        except Exception as e:
            logger.warning(f"Haar cascade detection error: {e}")
            return None

    @staticmethod
    def _estimate_gaze_from_position(bbox, frame_shape):
        """Estimate gaze direction from face position relative to frame center."""
        x1, y1, x2, y2 = bbox
        face_cx = (x1 + x2) / 2
        face_cy = (y1 + y2) / 2
        frame_h, frame_w = frame_shape[:2]

        # Horizontal offset: face left of center = looking right, etc.
        yaw = ((face_cx - frame_w / 2) / (frame_w / 2)) * 15.0
        # Vertical offset: face above center = looking up, etc.
        pitch = ((face_cy - frame_h / 2) / (frame_h / 2)) * 10.0

        return pitch, yaw

    @staticmethod
    def compute_engagement_score(emotion, confidence, gaze_pitch, gaze_yaw, face_present):
        if not face_present:
            return 0.0

        # Emotion component (0-50 points)
        valence = EMOTION_VALENCE.get(emotion, 0.4)
        emotion_score = valence * confidence * 50

        # Gaze component (0-30 points) -- closer to center = more focused
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
