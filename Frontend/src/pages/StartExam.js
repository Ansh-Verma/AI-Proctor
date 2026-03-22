// src/pages/StartExam.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  // Warning counter for leaving full screen or switching tabs (use state so it persists across renders)
  const [warningCount, setWarningCount] = useState(0);
  const WARNING_LIMIT = 3;

  // Lock exam (useCallback so it's stable across effects)
  const handleLockExam = useCallback(() => {
    setExamLocked(true);
    alert('Exam locked due to suspicious activity.');
  }, []);

  // Full-screen request (triggered by button click in modal)
  const requestFullScreen = async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { // Safari
        // @ts-ignore
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE11
        // @ts-ignore
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

    const checkWarnings = (currentCount) => {
      if (currentCount >= WARNING_LIMIT) {
        // Lock exam when limit reached
        handleLockExam();
      }
    };

    const handleVisibilityChange = () => {
      setWarningCount(prev => {
        const newCount = prev + 1;
        alert(`Warning ${newCount}: Do not switch tabs or minimize the window.`);
        checkWarnings(newCount);
        return newCount;
      });
    };

    const handleFullscreenChange = () => {
      // If full-screen is exited
      if (!document.fullscreenElement) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          alert(`Warning ${newCount}: Please remain in full-screen mode.`);
          checkWarnings(newCount);
          return newCount;
        });
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
  }, [isFullScreen, handleLockExam]);

  // Fetch exam details using examId from URL
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`https://ai-proctor-backend-qy09.onrender.com/api/exams/${examId}`);
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
    if (examId) fetchExam();
  }, [examId]);

  // Callback from BehaviorMonitor (if additional behavioral warnings are needed)
  const handleWarning = (countFromMonitor) => {
    if (typeof countFromMonitor === 'number') {
      setWarningCount(countFromMonitor);
      if (countFromMonitor >= WARNING_LIMIT) {
        handleLockExam();
      } else {
        alert(`Warning ${countFromMonitor}: Please focus on the exam.`);
      }
    } else {
      setWarningCount(prev => {
        const newCount = prev + 1;
        if (newCount >= WARNING_LIMIT) handleLockExam();
        else alert(`Warning ${newCount}: Please focus on the exam.`);
        return newCount;
      });
    }
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
      responses: (exam.questions || []).map((q) => ({
        questionId: q._id || q.questionText,
        answer: responses[q._id || q.questionText] || ''
      }))
    };

    try {
      const res = await axios.post('https://ai-proctor-backend-qy09.onrender.com/api/exam-responses/submit', submission);
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
        <div className="exam-content" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>🔒 Exam Locked</h2>
          <p style={{ color: 'var(--text-secondary)' }}>The exam has been locked due to suspicious activity.</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="exam-container">
        <div className="exam-content" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>{message || 'Loading exam details...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      {showFullScreenModal && (
        <div className="fullscreen-modal">
          <h2>🖥️ Please allow full-screen mode to start the exam</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', textAlign: 'center', maxWidth: '450px' }}>
            Full-screen mode is required for exam integrity. You will receive warnings if you exit.
          </p>
          <button onClick={requestFullScreen} className="fullscreen-btn">
            Go Full Screen &amp; Start Exam
          </button>
        </div>
      )}
      {!showFullScreenModal && (
        <div className="exam-content">
          <div className="exam-left">
            <h2>{exam.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              ⏱ Duration: {exam.duration} minutes
            </p>
            <form onSubmit={handleSubmit} className="exam-form">
              {(exam.questions || []).map((question, index) => (
                <div key={index} className="question-group">
                  <p><strong>Q{index + 1}.</strong> {question.questionText}</p>
                  {question.options && question.options.length > 0 ? (
                    <div className="options-group">
                      {question.options.map((option, idx) => (
                        <label key={idx} className="option-label">
                          <input
                            type="radio"
                            name={question._id || question.questionText}
                            value={idx}
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
                      placeholder="Type your answer here..."
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
            <div style={{ marginTop: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              <strong style={{ color: warningCount > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                Warnings: {warningCount}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartExam;