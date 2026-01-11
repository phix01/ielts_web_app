import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { authService } from '../../services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setStatus('sending');
    try {
      await authService.forgotPassword(email.trim());
      setStatus('sent');
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Forgot Password</h2>
        {status === 'sent' ? (
          <div className="text-sm text-green-700">
            <p>If an account with that email exists, a password reset link has been sent. Check your email (or backend logs in dev mode).</p>
            <div className="mt-4">
              <a href="/" className="text-blue-600 hover:underline">Back to Sign In</a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-700">{error}</div>}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <div className="text-center text-sm">
              <a href="/" className="text-blue-600 hover:underline">Back to Sign In</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
