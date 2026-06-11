// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      // If no username is found, redirect to login
      navigate('/', { replace: true });
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem('username');
    navigate('/', { replace: true });
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-avatar">
          {username ? username.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="profile-main">
          <h2>Your Profile</h2>
          <p className="profile-info">
            <strong>Username:</strong> {username}
          </p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

