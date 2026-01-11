import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Mic } from 'lucide-react';
import { Screen } from '../Dashboard';

interface SpeakingListScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

interface SpeakingItem {
  id: string;
  title: string;
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  partType: string;
  duration: string;
}

const speakingItems: SpeakingItem[] = [
  {
    id: '1',
    title: 'Describe Your Hometown',
    description: 'Talk about the place where you grew up',
    level: 'Easy',
    partType: 'Part 1',
    duration: '4-5 min'
  },
  {
    id: '2',
    title: 'A Book You Recently Read',
    description: 'Describe a book that made an impact on you',
    level: 'Medium',
    partType: 'Part 2',
    duration: '3-4 min'
  },
  {
    id: '3',
    title: 'Technology and Society',
    description: 'Discuss how technology affects modern life',
    level: 'Hard',
    partType: 'Part 3',
    duration: '4-5 min'
  },
  {
    id: '4',
    title: 'Your Favorite Hobby',
    description: 'Talk about an activity you enjoy doing',
    level: 'Easy',
    partType: 'Part 1',
    duration: '4-5 min'
  },
  {
    id: '5',
    title: 'A Memorable Journey',
    description: 'Describe a trip that was special to you',
    level: 'Medium',
    partType: 'Part 2',
    duration: '3-4 min'
  },
  {
    id: '6',
    title: 'Education Systems',
    description: 'Compare different approaches to education',
    level: 'Hard',
    partType: 'Part 3',
    duration: '4-5 min'
  },
];

export default function SpeakingListScreen({ onNavigate }: SpeakingListScreenProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-amber-100 text-amber-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Speaking Practice</h1>
        <p className="text-gray-600">Practice speaking topics and get feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakingItems.map((item) => (
          <Card 
            key={item.id}
            className="hover:shadow-lg transition-all cursor-pointer border hover:border-orange-300"
            onClick={() => onNavigate('speaking-detail', item.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={getLevelColor(item.level)}>
                  {item.level}
                </Badge>
                <Badge variant="outline">{item.partType}</Badge>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.duration}
                </div>
                <div className="flex items-center">
                  <Mic className="w-4 h-4 mr-1" />
                  Practice
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
