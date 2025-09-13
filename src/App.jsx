import React, { useState } from 'react';
import SignUp from './SignUp';
import './App.css';

function SignIn({ onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Sign in successful!');
        localStorage.setItem('token', data.token);
        // In a real app, you'd redirect to dashboard or home page
      } else {
        setMessage(data.message || 'Sign in failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn} className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={isLoading} className="signin-btn">
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="switch-link">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp} className="link-btn">
          Sign Up
        </button>
      </p>
    </div>
  );
}

function App() {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSwitchToSignIn = () => setIsSignUp(false);
  const handleSwitchToSignUp = () => setIsSignUp(true);

  return (
    <div className="app">
      {isSignUp ? (
        <SignUp onSwitchToSignIn={handleSwitchToSignIn} />
      ) : (
        <SignIn onSwitchToSignUp={handleSwitchToSignUp} />
      )}
    </div>
  );
}

export default App;