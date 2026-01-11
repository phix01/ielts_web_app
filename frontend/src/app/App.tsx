import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Dashboard from './components/Dashboard';
import VerifyEmailScreen from './components/screens/VerifyEmailScreen';

// Auth types - matching backend AuthResponse
interface User {
  id: string;
  email: string;
  firstName: string;
  isPremium: boolean;
  token: string;
  uid?: string;
  userImage?: string | null;
  emailVerified?: boolean;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'dashboard'>('login');
  const [user, setUser] = useState<User | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
      setCurrentScreen('dashboard');
    }
  }, []);

  // If this page is directly visited as a verification link, render the verification screen
  // Special path-based screens (verify, reset, forgot) are rendered directly
  if (window.location.pathname === '/verify-email') {
    return <VerifyEmailScreen />;
  }
  if (window.location.pathname === '/reset-password') {
    const ResetPasswordScreen = (require('./components/screens/ResetPasswordScreen').default);
    return <ResetPasswordScreen />;
  }
  if (window.location.pathname === '/forgot-password') {
    const ForgotPasswordScreen = (require('./components/screens/ForgotPasswordScreen').default);
    return <ForgotPasswordScreen />;
  }

  const handleLogin = (userData: User) => {
    localStorage.setItem('jwtToken', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentScreen('login');
  };

  // Guest login is handled by LoginScreen via anonymousSignIn API call
  // This function is kept for backward compatibility but not used
  const handleGuestLogin = () => {
    // This should not be called - LoginScreen handles anonymous login directly
    console.warn('handleGuestLogin called - this should be handled by LoginScreen');
  };

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onRegister={handleLogin}
        onBackToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentScreen('register')}
        onGuestLogin={handleGuestLogin}
      />
    );
  }

  return (
    <Dashboard user={user!} onLogout={handleLogout} />
  );
}

export default App;
