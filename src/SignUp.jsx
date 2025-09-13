import React, { useState } from 'react';

function SignUp({ onSwitchToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Sign up successful! Please sign in.');
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(data.message || 'Sign up failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp} className="signup-form">
        <div className="form-group">
          <label htmlFor="signup-email">Email:</label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password:</label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
            minLength="6"
          />
        </div>
        <button type="submit" disabled={isLoading} className="signup-btn">
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="switch-link">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToSignIn} className="link-btn">
          Sign In
        </button>
      </p>
    </div>
  );
}

export default SignUp;