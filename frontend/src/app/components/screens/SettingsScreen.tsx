import { useState, useEffect } from 'react';
import { progressService } from '../../services/progressService';
import { notificationSettingsService } from '../../services/notificationSettingsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { User, Mail, Crown, Moon, Sun, LogOut, Info } from 'lucide-react';
import { Badge } from '../ui/badge';

interface SettingsScreenProps {
  user: {
    firstName: string;
    email: string;
    isPremium: boolean;
  };
  onLogout: () => void;
}

export default function SettingsScreen({ user, onLogout }: SettingsScreenProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<boolean>(false);
  const [emailUpdates, setEmailUpdates] = useState<boolean>(false);

  // Ensure handlers are available for both Radix's onCheckedChange and native clicks
  const handleToggleDarkMode = (val?: boolean) => {
    setDarkMode(val ?? !darkMode);
  };

  const handleTogglePush = async (val?: boolean) => {
    const newVal = Boolean(val ?? !notifications);
    setNotifications(newVal);
    try {
      const res = await notificationSettingsService.updateSettings({ pushNotificationsEnabled: newVal });
      setNotifications(Boolean(res.pushNotificationsEnabled));
    } catch (e) {
      console.warn('Failed to update push notification setting', e);
      setNotifications(!newVal);
    }
  };

  const handleToggleEmail = async (val?: boolean) => {
    const newVal = Boolean(val ?? !emailUpdates);
    setEmailUpdates(newVal);
    try {
      const res = await notificationSettingsService.updateSettings({ emailUpdatesEnabled: newVal });
      setEmailUpdates(Boolean(res.emailUpdatesEnabled));
    } catch (e) {
      console.warn('Failed to update email setting', e);
      setEmailUpdates(!newVal);
    }
  };
  const [exercisesCompleted, setExercisesCompleted] = useState<number>(0);
  const [hoursPracticed, setHoursPracticed] = useState<number>(0);
  const [vocabularyWords, setVocabularyWords] = useState<number>(0);
  const [dayStreak, setDayStreak] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const stats = await progressService.dashboardStats();
        if (!mounted) return;
        setExercisesCompleted(stats.completedExercises ?? 0);
        setHoursPracticed(stats.hoursPracticed ?? 0);
        setVocabularyWords(stats.vocabularyWords ?? 0);
        setDayStreak(stats.dayStreak ?? 0);
      } catch (e) {
        // keep defaults on error
        console.warn('Failed to load dashboard stats', e);
      }
    };

    const fetchNotifications = async () => {
      try {
        const n = await notificationSettingsService.getSettings();
        if (!mounted) return;
        setNotifications(Boolean(n.pushNotificationsEnabled));
        setEmailUpdates(Boolean(n.emailUpdatesEnabled));
      } catch (e) {
        console.warn('Failed to load notification settings', e);
      }
    };

    fetchStats();
    fetchNotifications();

    const onProgress = () => fetchStats();
    window.addEventListener('progress:changed', onProgress as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener('progress:changed', onProgress as EventListener);
    };
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  value={user.firstName}
                  className="pl-10"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  className="pl-10"
                  readOnly
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Crown className={`w-5 h-5 ${user.isPremium ? 'text-amber-500' : 'text-gray-400'}`} />
                <div>
                  <p className="font-semibold text-gray-900">Account Status</p>
                  <p className="text-sm text-gray-600">
                    {user.isPremium ? 'Premium Member' : 'Free Member'}
                  </p>
                </div>
              </div>
              {user.isPremium ? (
                <Badge className="bg-amber-100 text-amber-700">Premium</Badge>
              ) : (
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500">
                  Upgrade
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-gray-700" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Toggle dark mode theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleToggleDarkMode}
                onClick={() => handleToggleDarkMode()}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications about your progress</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleTogglePush}
                onClick={() => handleTogglePush()}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Email Updates</p>
                <p className="text-sm text-gray-600">Receive study tips and updates via email</p>
              </div>
              <Switch
                checked={emailUpdates}
                onCheckedChange={handleToggleEmail}
                onClick={() => handleToggleEmail()}
              />
            </div>
          </CardContent>
        </Card>

        {/* Study Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Study Statistics</CardTitle>
            <CardDescription>Your learning progress overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl text-blue-600 mb-1">{exercisesCompleted}</div>
                <p className="text-sm text-gray-600">Exercises Completed</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl text-green-600 mb-1">{hoursPracticed.toFixed(1)}</div>
                <p className="text-sm text-gray-600">Hours Practiced</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl text-purple-600 mb-1">{vocabularyWords}</div>
                <p className="text-sm text-gray-600">Vocabulary Words</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl text-orange-600 mb-1">{dayStreak}</div>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Application information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">IELTS Prep Platform</p>
                <p className="text-sm text-gray-600">Version 1.0.0</p>
              </div>
            </div>
            <Separator />
            <div className="text-sm text-gray-600">
              <p className="mb-2">Computer Engineering Graduation Project</p>
              <p className="mb-2">Built with React and Java Spring Boot</p>
              <p>© 2025 IELTS Preparation Platform</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
