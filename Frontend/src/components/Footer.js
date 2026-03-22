// src/components/Footer.js
import React from 'react'
import '../styles.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} AI‑Proctored Exam Portal. All rights reserved.</p>
      <div className="footer__links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/contact">Contact Us</a>
      </div>
    </footer>
  )
}
