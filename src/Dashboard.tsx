import React from 'react';
import { useAuth } from './AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Profile</h3>
            <p>Manage your account settings and preferences</p>
            <button className="card-button">View Profile</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Analytics</h3>
            <p>View your activity and usage statistics</p>
            <button className="card-button">View Analytics</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure your application preferences</p>
            <button className="card-button">Open Settings</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Activity</h3>
            <p>Check your recent activity and notifications</p>
            <button className="card-button">View Activity</button>
          </div>
        </div>

        <div className="user-details-card">
          <h3>Account Information</h3>
          <div className="user-details">
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user?.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">User ID:</span>
              <span className="detail-value">{user?.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Account Status:</span>
              <span className="detail-value status-active">Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;