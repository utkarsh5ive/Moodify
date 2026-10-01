import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const FaceExpression = ({ onMoodDetected }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [expression, setExpression] = useState("Loading...");
  const [isDetecting, setIsDetecting] = useState(true);

  // Trigger callback when expression changes
  useEffect(() => {
    if (onMoodDetected && expression !== "Loading..." && expression !== "Detection Paused") {
      onMoodDetected(expression);
    }
  }, [expression, onMoodDetected]);

  // 🔥 Initialize MediaPipe
  useEffect(() => {
    const init = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );

      setFaceLandmarker(landmarker);
    };

    init();
  }, []);

  // 🎥 Start/Stop Webcam
  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      if (!isDetecting) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        
        // If the component unmounted while waiting for camera permissions
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    if (isDetecting) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    // Cleanup on unmount or when isDetecting changes
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isDetecting]);

  // 🧠 Expression Logic
  const getExpression = (blendshapes) => {
    let smile = 0;
    let surprise = 0;
    let sad = 0;
    let angry = 0;

    blendshapes.forEach((shape) => {
      if (
        shape.categoryName === "mouthSmileLeft" ||
        shape.categoryName === "mouthSmileRight"
      ) {
        smile += shape.score;
      }

      if (
        shape.categoryName === "jawOpen" ||
        shape.categoryName === "eyeWideOpen"
      ) {
        surprise += shape.score;
      }
      
      if(
        shape.categoryName === "mouthShrugUpper" ||
        shape.categoryName === "mouthShrugLower"
      ) {
        sad += shape.score;
      }

      if(
        shape.categoryName === "browDownLeft" ||
        shape.categoryName === "browDownRight"
      ){
        angry += shape.score;
      }
    });

    if (smile > 0.7) return "😊 Happy";
    if (surprise > 0.4) return "😲 Surprised";
    if (sad > 0.2) return "😔 Sad"; //0.2
    if(angry > 0.7) return "😡 Angry";

    return "😐 Neutral";
  };

  // 🔍 Detection Loop
  useEffect(() => {
    let animationFrameId;

    const detect = () => {
      if (!isDetecting) return;
      
      if (
        faceLandmarker &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        const results = faceLandmarker.detectForVideo(
          videoRef.current,
          performance.now()
        );

        if (results.faceBlendshapes.length > 0) {
          const blendshapes =
            results.faceBlendshapes[0].categories;

          const detectedExpression = getExpression(blendshapes);
          setExpression(detectedExpression);
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    };

    if (isDetecting) {
      detect();
    } else {
      setExpression("Detection Paused");
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [faceLandmarker, isDetecting]);

  return (
    <div className="face-expression-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <video
        ref={videoRef}
        width="400"
        height="300"
        autoPlay
        muted
        className="camera-video"
      />

    </div>
  );
};

export default FaceExpression;