import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import '../styles/Navbar.css';

function Navbar() {
  const { theme } = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-brand">
        <Link to="/">Stretch Buddy</Link>
      </div>
      <div className="navbar-links">
        <Link to="/progress">Progress</Link>
        <Link to="/routine">Routines</Link>
        <Link to="/settings">Settings</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar; 