import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MessageSquare, Clock, User, Plus, Lock, Crown } from 'lucide-react';
import { Screen } from '../Dashboard';

interface ForumListScreenProps {
  user: {
    isPremium: boolean;
  };
  onNavigate: (screen: Screen, itemId?: string) => void;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  timeAgo: string;
  category: string;
  replies: number;
  views: number;
  isPopular: boolean;
}

const forumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'How to improve writing task 2 band score from 6.5 to 7.5?',
    author: 'Alex Thompson',
    timeAgo: '2 hours ago',
    category: 'Writing',
    replies: 15,
    views: 234,
    isPopular: true
  },
  {
    id: '2',
    title: 'Best resources for practicing listening Section 4',
    author: 'Maria Garcia',
    timeAgo: '5 hours ago',
    category: 'Listening',
    replies: 8,
    views: 156,
    isPopular: false
  },
  {
    id: '3',
    title: 'Speaking Part 2: Tips for describing a person',
    author: 'John Kumar',
    timeAgo: '1 day ago',
    category: 'Speaking',
    replies: 23,
    views: 489,
    isPopular: true
  },
  {
    id: '4',
    title: 'Common mistakes in reading True/False/Not Given questions',
    author: 'Emily Chen',
    timeAgo: '1 day ago',
    category: 'Reading',
    replies: 12,
    views: 301,
    isPopular: false
  },
  {
    id: '5',
    title: 'Study schedule: 3 months to test day',
    author: 'David Park',
    timeAgo: '2 days ago',
    category: 'General',
    replies: 31,
    views: 672,
    isPopular: true
  },
];

export default function ForumListScreen({ user, onNavigate }: ForumListScreenProps) {
  if (!user.isPremium) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl text-gray-900 mb-2">Forum Discussions</h1>
          <p className="text-gray-600">Connect with other learners and share experiences</p>
        </div>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-6">
              <Lock className="w-16 h-16 mx-auto text-amber-600 mb-4" />
              <h2 className="text-2xl text-gray-900 mb-2">Premium Feature</h2>
              <p className="text-gray-600 mb-6">
                Upgrade to Premium to access forum discussions, connect with other learners, and get community support.
              </p>
            </div>

            <div className="max-w-md mx-auto mb-6">
              <div className="bg-white rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Premium Benefits:</h3>
                <ul className="text-left space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Crown className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span>Access to all forum discussions</span>
                  </li>
                  <li className="flex items-start">
                    <Crown className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span>Create and participate in discussions</span>
                  </li>
                  <li className="flex items-start">
                    <Crown className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span>Get help from experienced learners</span>
                  </li>
                  <li className="flex items-start">
                    <Crown className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span>Share your knowledge and help others</span>
                  </li>
                  <li className="flex items-start">
                    <Crown className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span>Ad-free experience</span>
                  </li>
                </ul>
              </div>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900 mb-2">Forum Discussions</h1>
            <p className="text-gray-600">Connect with other learners and share experiences</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {forumPosts.map((post) => (
          <Card 
            key={post.id}
            className="hover:shadow-lg transition-all cursor-pointer border hover:border-blue-300"
            onClick={() => onNavigate('forum-detail', post.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    {post.isPopular && (
                      <Badge className="bg-orange-100 text-orange-700">Popular</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.timeAgo}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {post.replies} replies
                </div>
                <div>
                  {post.views} views
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
