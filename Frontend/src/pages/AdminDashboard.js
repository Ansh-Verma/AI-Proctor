// src/pages/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-actions">
          <button className="action-btn" onClick={() => navigate('/create-exam')}>
            Create Exam
          </button>
          <button className="action-btn" onClick={() => navigate('/exam-responses')}>
            Exam Responses
          </button>
          <button className="action-btn" onClick={() => navigate('/profile')}>
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;