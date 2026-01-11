import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { authService, AuthResponse } from '../services/authService';
import { Alert, AlertDescription } from './ui/alert';

interface LoginScreenProps {
  onLogin: (user: any) => void;
  onNavigateToRegister: () => void;
  onGuestLogin: () => void;
}

export default function LoginScreen({ onLogin, onNavigateToRegister, onGuestLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Basic validation
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      const response: AuthResponse = await authService.signIn({ 
        email: email.trim(), 
        password 
      });
      
      // Validate response has required fields
      if (!response.token || !response.id) {
        throw new Error('Invalid response from server');
      }
      
      // Map backend response to frontend user format
      const user = {
        id: response.id.toString(),
        email: response.email,
        firstName: response.firstName,
        isPremium: response.isPremium || false,
        token: response.token,
        emailVerified: response.emailVerified || false,
        uid: response.uid,
        userImage: response.userImage,
      };
      
      onLogin(user);
    } catch (err: any) {
      // Extract error message
      const errorMessage = err.message || err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Google OAuth integration needed - for now show error
      setError('Google sign-in is not yet configured. Please use email/password or continue as guest.');
      setIsLoading(false);
      return;
      
      // TODO: Integrate Google OAuth
      // const idToken = await getGoogleIdToken();
      // const response: AuthResponse = await authService.googleSignIn({
      //   idToken,
      //   displayName: user.displayName,
      //   photoUrl: user.photoURL,
      // });
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      console.error('Google login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: AuthResponse = await authService.anonymousSignIn();
      
      // Validate response
      if (!response.token || !response.id) {
        throw new Error('Invalid response from server');
      }
      
      const user = {
        id: response.id.toString(),
        email: response.email,
        firstName: response.firstName,
        isPremium: false, // Anonymous users are never premium
        token: response.token,
        uid: response.uid,
        userImage: response.userImage,
      };
      
      onLogin(user);
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || 'Anonymous sign-in failed. Please try again.';
      setError(errorMessage);
      console.error('Anonymous login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl">IELTS Prep Platform</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to continue your learning journey
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => { window.location.href = '/forgot-password'; }}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleAnonymousLogin}
            disabled={isLoading}
          >
            Continue as Guest
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
