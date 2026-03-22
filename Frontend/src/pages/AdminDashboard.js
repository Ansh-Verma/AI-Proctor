// src/pages/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <h2>Administration Panel</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Manage your exams, review student responses, and view your profile.
        </p>
        <div className="dashboard-actions">
          <button className="action-btn" onClick={() => navigate('/create-exam')}>
            📝 Create Exam
          </button>
          <button className="action-btn" onClick={() => navigate('/exam-responses')}>
            📋 Exam Responses
          </button>
          <button className="action-btn" onClick={() => navigate('/profile')}>
            👤 Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;