import React, { useState, useRef, useEffect, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';  // Add useLocation
import { AuthContext } from '../AuthContext';
import Sidebar from './sidebar/sidebar';
import { 
  FiCalendar,
  FiMessageSquare,
  FiBell,
  FiUser,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import './opticiendash.css';

const OpticienDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();  // Get current location

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if current route is the dashboard
  const isDashboard = location.pathname === '/opticien' || location.pathname === '/opticien/';

  return (
    <div className="opticien-dashboard">
      <Sidebar />
      
      <div className="dashboard-main">
        {/* Header Component */}
        <header className="opticien-header">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
          
          <div className="header-right">
            <div className="header-icons">
              <button className="icon-btn" aria-label="Calendar">
                <FiCalendar className="header-icon" />
              </button>
              <button className="icon-btn" aria-label="Messages">
                <FiMessageSquare className="header-icon" />
                <span className="notification-badge">3</span>
              </button>
              <button className="icon-btn" aria-label="Notifications">
                <FiBell className="header-icon" />
                <span className="notification-badge">5</span>
              </button>
            </div>
            
            <div className="profile-dropdown" ref={dropdownRef}>
              <div 
                className="profile-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-label="User profile"
              >
                <div className="profile-icon-wrapper">
                  <FiUser className="profile-icon" />
                </div>
                <span className="profile-email">{user?.email}</span>
                <FiChevronDown className={`dropdown-chevron ${showDropdown ? 'open' : ''}`} />
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <button 
                    onClick={logout} 
                    className="dropdown-item"
                    aria-label="Log out"
                  >
                    <FiLogOut className="dropdown-icon" />
                    <span>Se Déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="dashboard-content">
          {/* Conditionally render stats cards only on dashboard */}
          {isDashboard && (
            <div className="stats-row">
              <div className="stats-card">
                <h3>Clients</h3>
                <div className="card-content">
                  <p className="card-value">42</p>
                </div>
              </div>
              <div className="stats-card">
                <h3>Rendez-vous</h3>
                <div className="card-content">
                  <p className="card-value">18</p>
                </div>
              </div>
              <div className="stats-card">
                <h3>Ventes</h3>
                <div className="card-content">
                  <p className="card-value">245</p>
                </div>
              </div>
              <div className="stats-card">
                <h3>Ordonnances</h3>
                <div className="card-content">
                  <p className="card-value">27</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Nested routes content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OpticienDashboard;