import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [expression, setExpression] = useState("Loading...");

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

  // 🎥 Start Webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();
  }, []);

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
    if (sad > 0.2) return "😔 Sad"
    if(angry > 0.7) return "😡 Angry"

    return "😐 Neutral";
  };

  // 🔍 Detection Loop
  useEffect(() => {
    let animationFrameId;

    const detect = () => {
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

    detect();

    return () => cancelAnimationFrame(animationFrameId);
  }, [faceLandmarker]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Expression Detector 😎</h2>

      <video
        ref={videoRef}
        width="400"
        height="300"
        autoPlay
        muted
        style={{
          border: "2px solid green",
          borderRadius: "10px",
        }}
      />

      <h3>Expression: {expression}</h3>
    </div>
  );
};

export default FaceExpression;