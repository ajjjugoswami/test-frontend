import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import './App.css';

// Main App Component
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'dashboard'>('login'); // 'login', 'signup', 'dashboard'
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (isAuthenticated()) {
    return <Dashboard />;
  }

  // Show auth forms based on current view
  return (
    <div className="app">
      {currentView === 'login' ? (
        <Login onSwitchToSignup={() => setCurrentView('signup')} />
      ) : (
        <SignUp onSwitchToSignIn={() => setCurrentView('login')} />
      )}
    </div>
  );
}

// Main App with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;