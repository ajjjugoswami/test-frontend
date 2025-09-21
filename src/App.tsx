import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginForm from './components/forms/LoginForm';
import SignupForm from './components/forms/SignupForm';
import Dashboard from './pages/Dashboard';
import AppLayout from './components/layout/AppLayout';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
  },
};

// Main App Component
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If user is authenticated, show dashboard with layout
  if (isAuthenticated()) {
    return (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    );
  }

  // Show auth forms based on current view
  return (
    <div>
      {currentView === 'login' ? (
        <LoginForm onSwitchToSignup={() => setCurrentView('signup')} />
      ) : (
        <SignupForm onSwitchToLogin={() => setCurrentView('login')} />
      )}
    </div>
  );
};

// Main App with AuthProvider and Ant Design ConfigProvider
const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;