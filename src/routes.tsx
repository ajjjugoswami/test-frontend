import { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/forms/LoginForm';
import SignupForm from './components/forms/SignupForm';
import Dashboard from './pages/Dashboard';

const LoginWrapper = () => {
  const navigate = useNavigate();
  return (
    <LoginForm
      onSwitchToSignup={() => navigate('/signup')}
      onLoginSuccess={() => navigate('/')}
    />
  );
};

const SignupWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignupForm
      onSwitchToLogin={() => navigate('/login')}
      onSignupSuccess={() => navigate('/login')}
    />
  );
};

export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
  requiresAuth: boolean;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: LoginWrapper,
    title: 'Login',
    requiresAuth: false,
  },
  {
    path: '/signup',
    component: SignupWrapper,
    title: 'Sign Up',
    requiresAuth: false,
  },
];

export const privateRoutes: RouteConfig[] = [
  {
    path: '/',
    component: Dashboard,
    title: 'Dashboard',
    requiresAuth: true,
  },
];

 export const allRoutes = [...publicRoutes, ...privateRoutes];

export const DEFAULT_PUBLIC_PATH = '/login';
export const DEFAULT_PRIVATE_PATH = '/';