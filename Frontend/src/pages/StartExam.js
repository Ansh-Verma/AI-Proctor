// src/pages/StartExam.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import BehaviorMonitor from '../components/BehaviorMonitor';
import '../styles.css';

const StartExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [responses, setResponses] = useState({});
  const [examLocked, setExamLocked] = useState(false);
  const [message, setMessage] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenModal, setShowFullScreenModal] = useState(true);
  
  // Warning counter for leaving full screen or switching tabs
  let warningCount = 0;

  // Full-screen request (triggered by button click in modal)
  const requestFullScreen = async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { // Safari
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE11
        await elem.msRequestFullscreen();
      }
      setIsFullScreen(true);
      setShowFullScreenModal(false);
    } catch (err) {
      console.error('Full-screen request failed:', err);
      // If user denies full-screen, send them back to My Exams
      alert('Full-screen mode is required to take the exam. Redirecting back to My Exams.');
      navigate('/my-exams');
    }
  };

  // Proctoring: if user leaves full screen or switches tab, issue warning
  useEffect(() => {
    if (!isFullScreen) return;

    const checkWarnings = () => {
      if (warningCount >= 3) {
        alert('Maximum warnings reached. The exam will now be locked.');
        handleLockExam();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        warningCount++;
        alert(`Warning ${warningCount}: Do not switch tabs or minimize the window.`);
        checkWarnings();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        warningCount++;
        alert(`Warning ${warningCount}: Please remain in full-screen mode.`);
        checkWarnings();
      }
    };

    const handleKeyDown = (e) => {
      // Disable copy, paste, and cut without showing alert
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
      }
    };

    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isFullScreen, navigate]);

  // Fetch exam details using examId from URL
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/exams/${examId}`);
        if (res.data) {
          setExam(res.data);
        } else {
          setMessage('No exam available.');
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
        setMessage('Error fetching exam details.');
      }
    };
    fetchExam();
  }, [examId]);

  // Callback from BehaviorMonitor (if additional behavioral warnings are needed)
  const handleWarning = (count) => {
    alert(`Warning ${count}: Please focus on the exam.`);
  };

  // Lock exam if warnings exceed threshold
  const handleLockExam = () => {
    setExamLocked(true);
    alert('Exam locked due to suspicious activity.');
  };

  // Capture student's answer for each question
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  // Handle exam submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exam) return;
    
    const submission = {
      examId: exam._id,
      studentId: localStorage.getItem('username') || 'student123',
      responses: exam.questions.map((q) => ({
        questionId: q._id || q.questionText,
        answer: responses[q._id || q.questionText] || ''
      }))
    };

    try {
      const res = await axios.post('http://localhost:5000/api/exam-responses/submit', submission);
      setMessage('Exam submitted successfully!');
      console.log('Submission response:', res.data);
    } catch (error) {
      console.error('Error submitting exam:', error);
      setMessage('Error submitting exam.');
    }
  };

  if (examLocked) {
    return (
      <div className="exam-container">
        <Header />
        <div className="exam-content">
          <h2>Exam Locked</h2>
          <p>The exam has been locked due to suspicious activity.</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="exam-container">
        <Header />
        <div className="exam-content">
          <p>{message || 'Loading exam details...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      <Header />
      {showFullScreenModal && (
        <div className="fullscreen-modal">
          <h2>Please allow full-screen mode to start the exam</h2>
          <button onClick={requestFullScreen} className="fullscreen-btn">
            Go Full Screen & Start Exam
          </button>
        </div>
      )}
      {!showFullScreenModal && (
        <div className="exam-content">
          <div className="exam-left">
            <h2>{exam.title}</h2>
            <p>Duration: {exam.duration} minutes</p>
            <form onSubmit={handleSubmit} className="exam-form">
              {exam.questions.map((question, index) => (
                <div key={index} className="question-group">
                  <p>{question.questionText}</p>
                  {question.options && question.options.length > 0 ? (
                    <div className="options-group">
                      {question.options.map((option, idx) => (
                        <label key={idx} className="option-label">
                          <input
                            type="radio"
                            name={question._id || question.questionText}
                            value={idx}  // Use index as value
                            onChange={(e) =>
                              handleResponseChange(
                                question._id || question.questionText,
                                Number(e.target.value)
                              )
                            }
                            required
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Your answer"
                      onChange={(e) =>
                        handleResponseChange(
                          question._id || question.questionText,
                          e.target.value
                        )
                      }
                      required
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="submit-exam-btn">
                Submit Exam
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
          <div className="exam-right">
            <BehaviorMonitor onWarning={handleWarning} onLockExam={handleLockExam} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StartExam;
