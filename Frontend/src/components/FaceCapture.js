// src/components/FaceCapture.js
import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import * as faceapi from 'face-api.js';
import '../styles.css';

const FaceCapture = React.forwardRef(({ onCapture }, ref) => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Error loading face detection models.');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    let localStream;
    if (modelsLoaded) {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then((stream) => {
          localStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
          setError('Error accessing webcam.');
        });
    }
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [modelsLoaded]);
  

  // Capture face descriptor and convert to plain array
  const captureFace = async () => {
    setError('');
    if (videoRef.current) {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detection && detection.descriptor) {
        const descriptorArray = Array.from(detection.descriptor);
        onCapture(descriptorArray);
      } else {
        setError('No face detected. Please try again.');
      }
    }
  };

  // Expose captureFace function to parent via ref
  useImperativeHandle(ref, () => ({
    captureFace
  }));

  return (
    <div className="face-capture">
      <video ref={videoRef} autoPlay muted width="300" height="225" />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
});

export default FaceCapture;
