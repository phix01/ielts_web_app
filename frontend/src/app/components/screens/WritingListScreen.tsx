import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, PenLine } from 'lucide-react';
import { Screen } from '../Dashboard';

interface WritingListScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

interface WritingItem {
  id: string;
  title: string;
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  taskType: string;
  duration: string;
  wordCount: number;
}

const writingItems: WritingItem[] = [
  {
    id: '1',
    title: 'Advantages and Disadvantages of Remote Work',
    description: 'Discuss both views and give your opinion',
    level: 'Medium',
    taskType: 'Task 2 - Opinion',
    duration: '40 min',
    wordCount: 250
  },
  {
    id: '2',
    title: 'Describe a Chart Showing Population Trends',
    description: 'Summarize the information by selecting key features',
    level: 'Medium',
    taskType: 'Task 1 - Graph',
    duration: '20 min',
    wordCount: 150
  },
  {
    id: '3',
    title: 'The Role of Technology in Education',
    description: 'To what extent do you agree or disagree?',
    level: 'Hard',
    taskType: 'Task 2 - Agree/Disagree',
    duration: '40 min',
    wordCount: 250
  },
  {
    id: '4',
    title: 'Letter to a Friend About a Recent Event',
    description: 'Write an informal letter describing your experience',
    level: 'Easy',
    taskType: 'Task 1 - Letter',
    duration: '20 min',
    wordCount: 150
  },
];

export default function WritingListScreen({ onNavigate }: WritingListScreenProps) {
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
        <h1 className="text-2xl text-gray-900 mb-2">Writing Practice</h1>
        <p className="text-gray-600">Master essay writing and task responses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {writingItems.map((item) => (
          <Card 
            key={item.id}
            className="hover:shadow-lg transition-all cursor-pointer border hover:border-green-300"
            onClick={() => onNavigate('writing-detail', item.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={getLevelColor(item.level)}>
                  {item.level}
                </Badge>
                <Badge variant="outline">{item.taskType}</Badge>
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.duration}
                </div>
                <div className="flex items-center">
                  <PenLine className="w-4 h-4 mr-1" />
                  {item.wordCount} words
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}