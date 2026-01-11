import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, User } from 'lucide-react';
import { Screen } from '../Dashboard';

interface BlogListScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Tips for IELTS Success',
    description: 'Essential strategies to help you achieve your target band score',
    author: 'Sarah Johnson',
    date: 'Dec 20, 2024',
    tags: ['Tips', 'General'],
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'
  },
  {
    id: '2',
    title: 'Understanding IELTS Band Scores',
    description: 'A comprehensive guide to how IELTS scoring works',
    author: 'Michael Chen',
    date: 'Dec 18, 2024',
    tags: ['Scoring', 'Guide'],
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'
  },
  {
    id: '3',
    title: 'Common Mistakes in IELTS Writing',
    description: 'Learn what to avoid in your writing tasks',
    author: 'Emma Williams',
    date: 'Dec 15, 2024',
    tags: ['Writing', 'Tips'],
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'
  },
  {
    id: '4',
    title: 'Improving Your Listening Skills',
    description: 'Practical exercises to enhance your listening comprehension',
    author: 'David Brown',
    date: 'Dec 12, 2024',
    tags: ['Listening', 'Practice'],
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400'
  },
  {
    id: '5',
    title: 'Speaking Fluency Techniques',
    description: 'Master the art of speaking naturally and confidently',
    author: 'Lisa Anderson',
    date: 'Dec 10, 2024',
    tags: ['Speaking', 'Tips'],
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400'
  },
  {
    id: '6',
    title: 'Reading Strategies for Academic Texts',
    description: 'Effective methods to tackle complex reading passages',
    author: 'James Wilson',
    date: 'Dec 8, 2024',
    tags: ['Reading', 'Academic'],
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
  },
];

export default function BlogListScreen({ onNavigate }: BlogListScreenProps) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">IELTS Blog</h1>
        <p className="text-gray-600">Tips, guides, and insights for your IELTS preparation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card 
            key={post.id}
            className="hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
            onClick={() => onNavigate('blog-detail', post.id)}
          >
            <div className="h-48 overflow-hidden bg-gray-200">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {post.date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
