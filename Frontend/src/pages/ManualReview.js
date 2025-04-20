// src/pages/ManualReview.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const ManualReview = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const [examData, setExamData] = useState(null);
  const [error, setError] = useState('');
  const [overrideScore, setOverrideScore] = useState('');

  // Fetch the exam response by ID
  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/exam-responses/${responseId}`);
        setResponseData(res.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching response details.');
      }
    };
    fetchResponse();
  }, [responseId]);

  // Once the response is loaded, fetch the exam details to get question texts
  useEffect(() => {
    if (responseData && responseData.examId) {
      const fetchExam = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/exams/${responseData.examId}`);
          setExamData(res.data);
        } catch (err) {
          console.error(err);
          setError('Error fetching exam details.');
        }
      };
      fetchExam();
    }
  }, [responseData]);

  // Compute marks per question (assuming total marks = 100)
  const marksPerQuestion = examData && examData.questions && examData.questions.length
    ? 100 / examData.questions.length
    : 0;

  const handleOverrideSubmit = async () => {
    try {
      // Update the response score in the backend
      const res = await axios.put(`http://localhost:5000/api/exam-responses/${responseId}`, {
        score: Number(overrideScore)
      });
      alert(`Override submitted: new score = ${overrideScore}`);
      navigate('/exam-responses');
    } catch (err) {
      console.error('Error overriding score:', err);
      setError('Failed to override score.');
    }
  };

  if (error) {
    return (
      <div className="responses-container">
        <div className="responses-content">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!responseData || !examData) {
    return (
      <div className="responses-container">
        <div className="responses-content">
          <p>Loading details...</p>
        </div>
      </div>
    );
  }

  // Create a mapping from questionId to question text and type from the exam data
  const questionMapping = {};
  examData.questions.forEach(q => {
    questionMapping[q._id] = {
      text: q.questionText,
      type: q.type
    };
  });

  // Filter only descriptive responses
  const descriptiveResponses = responseData.responses.filter(r => {
    const q = questionMapping[r.questionId];
    return q && q.type === 'descriptive';
  });

  return (
    <div className="responses-container">
      {/* Custom header for manual review */}
      <h1 className="review-header">Your Review Matters</h1>
      <div className="responses-content">
        <h2>Response Details</h2>
        <button onClick={() => navigate('/exam-responses')} className="back-btn">
          Back to Responses
        </button>
        <div className="review-details">
          <p><strong>Student Username:</strong> {responseData.studentId}</p>
          <p><strong>Exam ID:</strong> {responseData.examId}</p>
          <p><strong>Submission Time:</strong> {new Date(responseData.submittedAt).toLocaleString()}</p>
          <p><strong>Plagiarism Score:</strong> {responseData.plagiarismScore ?? 'N/A'}</p>
          <p><strong>Current Score:</strong> {responseData.score ?? 'N/A'}</p>
          
          <h3>Descriptive Answers</h3>
          {descriptiveResponses.length === 0 ? (
            <p>No descriptive responses to review.</p>
          ) : (
            descriptiveResponses.map((r, idx) => (
              <div key={idx} className="review-answer-block">
                <p><strong>Question:</strong> {questionMapping[r.questionId]?.text || 'N/A'}</p>
                <p><strong>Student Answer:</strong> {r.descriptiveAnswer}</p>
                <p>
                  <strong>Similarity:</strong>{' '}{r.similarity !== undefined && r.similarity !== null
                    ? r.similarity.toFixed(2)
                    : 'N/A'}
                </p>
                <p><strong>Total Marks for Question:</strong> {marksPerQuestion.toFixed(2)}</p>
              </div>
            ))
          )}

          <div className="override-section-modal">
            <input
              type="number"
              placeholder="Enter new score (0-100)"
              value={overrideScore}
              onChange={(e) => setOverrideScore(e.target.value)}
            />
            <button onClick={handleOverrideSubmit}>Submit Override</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualReview;
