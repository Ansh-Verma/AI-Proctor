// src/components/Footer.js
import React from 'react'
import { Link } from 'react-router-dom';
import '../styles.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} AI‑Proctored Exam Portal. All rights reserved.</p>
      <div className="footer__links">
        <Link to="/">Privacy Policy</Link>
        <Link to="/">Contact Us</Link>
      </div>
    </footer>
  )
}
