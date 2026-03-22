// src/pages/UserTypeSelection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/login/student');
  };

  const handleAdminClick = () => {
    navigate('/login/admin');
  };

  return (
    <div className="user-type-page">
      <div className="hero-section">
        <h1>
          <span className="accent-text">AI Proctored</span>{' '}
          Exam Portal
        </h1>
        <p>
          A next-generation proctored examination portal with face recognition,
          real-time behavior monitoring, and intelligent auto-grading.
        </p>
      </div>

      <div className="user-type-container">
        <div className="user-type-card" onClick={handleStudentClick}>
          <span className="card-icon">📚</span>
          <h2>Student</h2>
          <p>Take exams securely with AI-powered proctoring</p>
        </div>
        <div className="user-type-card" onClick={handleAdminClick}>
          <span className="card-icon">🛡️</span>
          <h2>Admin</h2>
          <p>Create exams, review responses &amp; manage results</p>
        </div>
      </div>

      <div className="about-us">
        <h3>Why Choose Us?</h3>
        <p>
          Welcome to the AI‑Based Proctored Examination Portal—your secure, user‑friendly platform
          for creating and taking exams online. Our system combines face recognition, behavior
          monitoring, and automated grading to ensure integrity and ease for both students and administrators.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔍</span>
            <h4>Face Recognition</h4>
            <p>Verify identity before and during exams</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h4>Auto-Grading</h4>
            <p>Instant evaluation with similarity analysis</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👁️</span>
            <h4>Behavior Monitoring</h4>
            <p>Real-time tab switching &amp; focus detection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
