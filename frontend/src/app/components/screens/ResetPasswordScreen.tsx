import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { authService } from '../../services/authService';

export default function ResetPasswordScreen() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) setToken(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError('Missing or invalid token.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setStatus('submitting');
    try {
      await authService.resetPassword(token, password);
      setStatus('success');
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. The token may be invalid or expired.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
        {status === 'success' ? (
          <div className="text-sm text-green-700">
            <p>Your password has been reset. You can now <a href="/" className="text-blue-600 hover:underline">sign in</a> with your new password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-700">{error}</div>}
            <div>
              <Label htmlFor="token">Reset Token</Label>
              <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste token here if not provided in URL" />
            </div>
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Resetting...' : 'Reset Password'}
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
