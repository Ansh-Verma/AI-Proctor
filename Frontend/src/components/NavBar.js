// src/components/NavBar.js
import React from 'react'
import { Link } from 'react-router-dom'
import '../styles.css'

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        {/* You can swap this out for your own logo */}
        <Link to="/">AI ‑ Proctored Examination Portal</Link>
      </div>
      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><a href="#about">About Us</a></li>
        <li><Link to="/login/student">Student Login</Link></li>
        <li><Link to="/login/admin">Admin Login</Link></li>
      </ul>
    </nav>
  )
}
