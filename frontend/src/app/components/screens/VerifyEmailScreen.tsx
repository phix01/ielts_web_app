import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../ui/button';

export default function VerifyEmailScreen() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const verify = async () => {
      setStatus('loading');
      try {
        const res = await api.get('/auth/verify-email', { params: { token } });
        // If backend returns an AuthResponse, store token and user and reload app to sync state
        if (res?.data && res.data.token) {
          const data = res.data as any;
          const user = {
            id: data.id?.toString(),
            email: data.email,
            firstName: data.firstName,
            isPremium: data.isPremium || false,
            token: data.token,
            uid: data.uid,
            userImage: data.userImage,
            emailVerified: data.emailVerified || false,
          };
          localStorage.setItem('jwtToken', data.token);
          localStorage.setItem('user', JSON.stringify(user));
          setStatus('success');
          setMessage('Email verified successfully. You are now signed in. Redirecting...');
          // Give user a moment to read, then redirect so App reloads and picks up new auth state
          setTimeout(() => { window.location.href = '/'; }, 1200);
          return;
        }
        setStatus('success');
        setMessage('Email verified successfully. You can now sign in.');
      } catch (e: any) {
        setStatus('error');
        const err = e?.response?.data || e?.message || 'Verification failed or token expired.';
        setMessage(typeof err === 'string' ? err : 'Verification failed or token expired.');
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Email Verification</h2>
        {status === 'loading' && <p className="text-gray-600">Verifying your email...</p>}
        {status === 'success' && (
          <div className="text-sm text-green-700">
            <p>{message}</p>
            <div className="mt-4">
              <a href="/" className="text-blue-600 hover:underline">Go to Sign In</a>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="text-sm text-red-700">
            <p>{message}</p>
            <div className="mt-4">
              <a href="/" className="text-blue-600 hover:underline">Go to Sign In</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
