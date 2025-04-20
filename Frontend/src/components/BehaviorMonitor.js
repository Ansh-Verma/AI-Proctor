// src/components/BehaviorMonitor.js
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import '../styles.css';

const BehaviorMonitor = ({ onWarning = () => {}, onLockExam = () => {} }) => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState(null);

  // Pause duration after a warning (in milliseconds)
  const pauseDuration = 30000; // 30 seconds

  // Load face-api.js models from public/models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log('Models loaded');
      } catch (err) {
        console.error('Error loading models:', err);
      }
    };
    loadModels();
  }, []);

  // Access the webcam once models are loaded
  useEffect(() => {
    let localStream;
    if (modelsLoaded) {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then((s) => {
          localStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    }
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [modelsLoaded]);

  // Periodically check the video feed and monitor behavior
  useEffect(() => {
    let interval;
    if (modelsLoaded && !isPaused) {
      interval = setInterval(async () => {
        if (videoRef.current) {
          const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (!detection) {
            // Issue warning and pause monitoring automatically
            setWarningCount(prevCount => {
              const newCount = prevCount + 1;
              onWarning(newCount); // Let parent know a warning has been issued
              if (newCount >= 3) {
                onLockExam(); // Lock exam after 3 warnings
              } else {
                setIsPaused(true);
                setTimeout(() => {
                  setIsPaused(false);
                }, pauseDuration);
              }
              return newCount;
            });
          }
        }
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [modelsLoaded, isPaused, onWarning, onLockExam]);

  return (
    <div className="behavior-monitor">
      <video ref={videoRef} autoPlay muted width="300" height="225" />
      <p>Warnings: {warningCount}</p>
    </div>
  );
};

export default BehaviorMonitor;
