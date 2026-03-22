// src/components/Navbar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles.css";

export default function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Which routes count as admin-only or student-only
  const adminPaths   = ["/admin-dashboard", "/create-exam", "/exam-responses", "/manual-review"];
  const studentPaths = ["/dashboard", "/my-exams", "/start-exam"];

  const isAdminArea   = adminPaths.some((p) => location.pathname.startsWith(p));
  const isStudentArea = studentPaths.some((p) => location.pathname.startsWith(p));

  // Hide logout on these routes:
  const noLogoutPaths = ["/", "/login/student", "/login/admin", "/register"];
  const showLogout   = !noLogoutPaths.includes(location.pathname);

  const handleLogout = () => {
    // clear whatever you need (e.g. auth tokens)
    navigate("/", { replace: true });
  };

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" onClick={closeMobileMenu}>AI Proctored Exam Portal</Link>
      </div>

      {/* Hamburger button for mobile */}
      <button
        className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile overlay backdrop */}
      {menuOpen && (
        <div className="navbar__mobile-overlay open" onClick={closeMobileMenu} />
      )}

      <ul className={`navbar__links ${menuOpen ? "open" : ""}`}>
        {/* always show Home */}
        <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>

        {/* if we're not in an admin-only area, let them see Student Login */}
        {!isAdminArea && (
          <li><Link to="/login/student" onClick={closeMobileMenu}>Student Login</Link></li>
        )}

        {/* if we're not in a student-only area, let them see Admin Login */}
        {!isStudentArea && (
          <li><Link to="/login/admin" onClick={closeMobileMenu}>Admin Login</Link></li>
        )}

        {/* show Register only on landing and login pages */}
        {["/", "/login/student", "/login/admin"].includes(location.pathname) && (
          <li><Link to="/register" onClick={closeMobileMenu}>Register</Link></li>
        )}

        {/* finally, show Logout everywhere else */}
        {showLogout && (
          <li>
            <button className="logout-btn" onClick={() => { handleLogout(); closeMobileMenu(); }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
