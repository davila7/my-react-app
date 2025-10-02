import React from 'react';
import './Navbar.css';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>TodoApp</h2>
        </div>
        <div className="navbar-menu">
          <a href="#" className="navbar-item">Home</a>
          <a href="#" className="navbar-item">About</a>
          <a href="#" className="navbar-item">Contact</a>
          <a href="#" className="navbar-item navbar-profile">Profile</a>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
