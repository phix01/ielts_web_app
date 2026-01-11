import { BookOpen, FileText, Headphones, Mic, BookMarked, FileQuestion, Newspaper, MessageSquare, Settings, Home, Lock, Users, Award } from 'lucide-react';
import { cn } from './ui/utils';
import { Screen } from './Dashboard';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isPremium: boolean;
}

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ReactNode;
  premiumOnly?: boolean;
}

export default function Sidebar({ currentScreen, onNavigate, isPremium }: SidebarProps) {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'reading-list', label: 'Reading', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'writing-list', label: 'Writing', icon: <FileText className="w-5 h-5" /> },
    { id: 'listening-list', label: 'Listening', icon: <Headphones className="w-5 h-5" /> },
    { id: 'speaking-list', label: 'Speaking', icon: <Mic className="w-5 h-5" /> },
    { id: 'vocabulary', label: 'Vocabulary', icon: <BookMarked className="w-5 h-5" /> },
    { id: 'tests', label: 'IELTS Tests', icon: <FileQuestion className="w-5 h-5" /> },
    { id: 'mock-tests', label: 'Band Score', icon: <FileText className="w-5 h-5" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'study-rooms', label: 'Study Rooms', icon: <Users className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Award className="w-5 h-5" /> },
    { id: 'blog-list', label: 'Blog', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'forum-list', label: 'Forum', icon: <MessageSquare className="w-5 h-5" />, premiumOnly: true },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">IELTS Prep</h1>
            <p className="text-xs text-gray-500">Learning Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isLocked = item.premiumOnly && !isPremium;
          const isActive = currentScreen === item.id || 
                          (item.id === 'reading-list' && currentScreen === 'reading-detail') ||
                          (item.id === 'writing-list' && currentScreen === 'writing-detail') ||
                          (item.id === 'listening-list' && currentScreen === 'listening-detail') ||
                          (item.id === 'speaking-list' && currentScreen === 'speaking-detail') ||
                          (item.id === 'tests' && currentScreen === 'test-detail') ||
                          (item.id === 'blog-list' && currentScreen === 'blog-detail') ||
                          (item.id === 'forum-list' && currentScreen === 'forum-detail') ||
                          (item.id === 'books' && currentScreen === 'book-detail');

          return (
            <button
              key={item.id}
              onClick={() => !isLocked && onNavigate(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : isLocked
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {isLocked && <Lock className="w-4 h-4" />}
            </button>
          );
        })}
      </nav>

      {!isPremium && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Upgrade to Premium</h3>
            <p className="text-xs text-gray-600 mb-3">Access forum discussions and remove ads</p>
            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:from-amber-600 hover:to-orange-600 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
