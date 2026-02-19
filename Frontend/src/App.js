// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import ExamResponses from "./pages/ExamResponses";
import ManualReview from "./pages/ManualReview";
import StartExam from "./pages/StartExam";
import ProfilePage from "./pages/ProfilePage";
import CreateExam from "./pages/CreateExam";
import MyExams from "./pages/MyExams";
import RegisterPage from "./pages/RegisterPage";
import UserTypeSelection from "./pages/UserTypeSelection";
import "./styles.css";

const App = () => {
  return (
    <Router>
      <NavBar />

      <div className="app-container">
        <Routes>
          <Route path="/" element={<UserTypeSelection />} />

          <Route path="/login/student" element={<LoginPage userType="student" />} />
          <Route path="/login/admin" element={<LoginPage userType="admin" />} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/exam-responses" element={<ExamResponses />} />
          <Route path="/manual-review/:responseId" element={<ManualReview />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/start-exam/:examId" element={<StartExam />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/my-exams" element={<MyExams />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App;