import { useState } from 'react';
import './Sidebar.css';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  href?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
  width?: string;
  collapsedWidth?: string;
}

export function Sidebar({
  items,
  isCollapsed = false,
  onToggle,
  width = '250px',
  collapsedWidth = '60px'
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle?.();
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <div 
      className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
      style={{ 
        width: collapsed ? collapsedWidth : width 
      }}
    >
      <div className="sidebar__header">
        <button 
          className="sidebar__toggle"
          onClick={handleToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {items.map((item) => (
            <li key={item.id} className="sidebar__item">
              <button
                className="sidebar__link"
                onClick={() => handleItemClick(item)}
                title={collapsed ? item.label : ''}
              >
                {item.icon && (
                  <span className="sidebar__icon">{item.icon}</span>
                )}
                {!collapsed && (
                  <span className="sidebar__label">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}