import { Crown } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../services/authService';
import NotificationBell from './NotificationBell';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Screen } from './Dashboard';

interface HeaderProps {
  user: {
    firstName: string;
    email: string;
    isPremium: boolean;
    emailVerified?: boolean;
  };
  onNavigate: (screen: Screen) => void;
}

export default function Header({ user, onNavigate }: HeaderProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [sending, setSending] = useState(false);

  const handleResend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessage(null);
    setMessageType(null);
    setSending(true);
    try {
      const res = await authService.resendVerification(user.email);
      if (res?.dev) {
        setMessage('Verification link generated (dev mode). Check backend logs for the link.');
        setMessageType('success');
      } else {
        setMessage('Verification email sent.');
        setMessageType('success');
      }
    } catch (err: any) {
      setMessage(err?.response?.data || err?.message || 'Failed to resend verification email.');
      setMessageType('error');
    } finally {
      setSending(false);
      setTimeout(() => { setMessage(null); setMessageType(null); }, 7000);
    }
  };
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Continue your IELTS preparation journey
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationBell />

          <button 
            onClick={() => onNavigate('settings')}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                {user.firstName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-900">{user.firstName}</p>
                {!user.emailVerified && (
                  <span className="text-xs text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">Unverified</span>
                )}
                {user.isPremium && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              {!user.emailVerified && (
                <div className="text-xs mt-1 flex items-center space-x-3">
                  <button
                    onClick={handleResend}
                    disabled={sending}
                    className="text-blue-600 hover:underline"
                  >
                    {sending ? 'Sending...' : 'Resend verification'}
                  </button>
                  {message && (
                    <span className={`${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</span>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500">
                {user.isPremium ? 'Premium Member' : 'Free Member'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
