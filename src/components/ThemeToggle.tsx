import React from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <label className="theme-toggle-switch" title="Toggle light/dark mode">
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <span className="slider" />
      <span className="theme-toggle-label">{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
    </label>
  );
};

export default ThemeToggle;
