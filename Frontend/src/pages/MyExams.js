// src/pages/MyExams.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../styles.css';

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/exams');
        if (res.data && res.data.length > 0) {
          // Sort exams by creation time (newest first)
          const sortedExams = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setExams(sortedExams);
        } else {
          setError('No exams available.');
        }
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Error fetching exam details.');
      }
    };
    fetchExams();
  }, []);

  const handleExamClick = (examId) => {
    navigate(`/start-exam/${examId}`);
  };

  return (
    <div className="exams-container">
      <Header />
      <div className="exams-content">
        <h2>Available Exams</h2>
        {error && <p className="error-message">{error}</p>}
        {exams.length === 0 ? (
          <p>No exams available at this time.</p>
        ) : (
          <div className="exams-list">
            {exams.map((exam) => (
              <div 
                key={exam._id} 
                className="exam-card"
                onClick={() => handleExamClick(exam._id)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{exam.title}</h3>
                <p>Duration: {exam.duration} minutes</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExams;
