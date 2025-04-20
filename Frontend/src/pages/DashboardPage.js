import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        <h2>Welcome to AI Based: Proctored Examination Portal</h2>

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
