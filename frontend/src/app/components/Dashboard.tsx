import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import HomeScreen from './screens/HomeScreen';
import ReadingListScreen from './screens/ReadingListScreen';
import ReadingDetailScreen from './screens/ReadingDetailScreen';
import WritingListScreen from './screens/WritingListScreen';
import WritingDetailScreen from './screens/WritingDetailScreen';
import ListeningListScreen from './screens/ListeningListScreen';
import ListeningDetailScreen from './screens/ListeningDetailScreen';
import SpeakingListScreen from './screens/SpeakingListScreen';
import SpeakingDetailScreen from './screens/SpeakingDetailScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import TestsScreen from './screens/TestsScreen';
import TestDetailScreen from './screens/TestDetailScreen';
import BlogListScreen from './screens/BlogListScreen';
import BandScoreCalculatorScreen from './screens/BandScoreCalculatorScreen';
import BlogDetailScreen from './screens/BlogDetailScreen';
import ForumListScreen from './screens/ForumListScreen';
import ForumDetailScreen from './screens/ForumDetailScreen';
import NotesScreen from './screens/NotesScreen';
import BooksScreen from './screens/BooksScreen';
import BookReaderScreen from './screens/BookReaderScreen';
import StudyRoomsScreen from './screens/StudyRoomsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatbotWidget from './ChatbotWidget';

interface User {
  id: string;
  email: string;
  firstName: string;
  isPremium: boolean;
  token: string;
  emailVerified?: boolean;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export type Screen = 
  | 'home'
  | 'reading-list'
  | 'reading-detail'
  | 'writing-list'
  | 'writing-detail'
  | 'listening-list'
  | 'listening-detail'
  | 'speaking-list'
  | 'speaking-detail'
  | 'vocabulary'
  | 'tests'
  | 'test-detail'
  | 'mock-tests'
  | 'blog-list'
  | 'blog-detail'
  | 'forum-list'
  | 'forum-detail'
  | 'notes'
  | 'books'
  | 'study-rooms'
  | 'leaderboard'
  | 'book-detail'
  | 'settings';

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleNavigate = (screen: Screen, itemId?: string) => {
    setCurrentScreen(screen);
    setSelectedItemId(itemId || null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'reading-list':
        return <ReadingListScreen onNavigate={handleNavigate} />;
      case 'reading-detail':
        return <ReadingDetailScreen itemId={selectedItemId} onBack={() => handleNavigate('reading-list')} />;
      case 'writing-list':
        return <WritingListScreen onNavigate={handleNavigate} />;
      case 'writing-detail':
        return <WritingDetailScreen itemId={selectedItemId} onBack={() => handleNavigate('writing-list')} />;
      case 'listening-list':
        return <ListeningListScreen onNavigate={handleNavigate} />;
      case 'listening-detail':
        return <ListeningDetailScreen itemId={selectedItemId} onBack={() => handleNavigate('listening-list')} />;
      case 'speaking-list':
        return <SpeakingListScreen onNavigate={handleNavigate} />;
      case 'speaking-detail':
        return <SpeakingDetailScreen itemId={selectedItemId} onBack={() => handleNavigate('speaking-list')} />;
      case 'vocabulary':
        return <VocabularyScreen />;
      case 'tests':
        return <TestsScreen onNavigate={handleNavigate} />;
      case 'test-detail':
        return <TestDetailScreen itemId={selectedItemId} onBack={() => handleNavigate('tests')} />;
      case 'mock-tests':
        return <BandScoreCalculatorScreen />;
      case 'blog-list':
        return <BlogListScreen onNavigate={handleNavigate} />;
      case 'blog-detail':
        return <BlogDetailScreen itemId={selectedItemId} onBack={() => handleNavigate('blog-list')} />;
      case 'forum-list':
        return <ForumListScreen user={user} onNavigate={handleNavigate} />;
      case 'forum-detail':
        return <ForumDetailScreen itemId={selectedItemId} user={user} onBack={() => handleNavigate('forum-list')} />;
      case 'notes':
        return <NotesScreen onNavigate={handleNavigate} />;
      case 'books':
        return <BooksScreen onNavigate={handleNavigate} />;
      case 'study-rooms':
        return <StudyRoomsScreen onNavigate={handleNavigate} />;
      case 'leaderboard':
        return <LeaderboardScreen onNavigate={handleNavigate} user={user} />;
      case 'book-detail':
        return <BookReaderScreen itemId={selectedItemId} onBack={() => handleNavigate('books')} />;
      case 'settings':
        return <SettingsScreen user={user} onLogout={onLogout} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate}
        isPremium={user.isPremium}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onNavigate={handleNavigate} />
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>
        <ChatbotWidget />
      </div>
    </div>
  );
}
