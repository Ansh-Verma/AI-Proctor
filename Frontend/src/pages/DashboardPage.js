// src/pages/DashboardPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        <h2>Welcome to AI Proctored Examination Portal</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Select an option below to get started.
        </p>

        {/* Action Buttons */}
        <div className="dashboard-actions">
          <button className="action-btn" onClick={() => navigate("/my-exams")}>
            🎯 My Exams
          </button>
          <button className="action-btn" onClick={() => navigate("/profile")}>
            👤 Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
