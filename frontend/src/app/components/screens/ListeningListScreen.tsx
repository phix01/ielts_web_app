import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Headphones } from 'lucide-react';
import { Screen } from '../Dashboard';

interface ListeningListScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

interface ListeningItem {
  id: string;
  title: string;
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  sections: number;
  duration: string;
  questionsCount: number;
}

const listeningItems: ListeningItem[] = [
  {
    id: '1',
    title: 'Academic Lecture: Marine Biology',
    description: 'Listen to a university lecture about ocean ecosystems',
    level: 'Hard',
    sections: 4,
    duration: '30 min',
    questionsCount: 40
  },
  {
    id: '2',
    title: 'Conversation: Apartment Rental',
    description: 'A conversation between a landlord and potential tenant',
    level: 'Easy',
    sections: 4,
    duration: '30 min',
    questionsCount: 40
  },
  {
    id: '3',
    title: 'Academic Discussion: Climate Policy',
    description: 'Panel discussion about environmental regulations',
    level: 'Medium',
    sections: 4,
    duration: '30 min',
    questionsCount: 40
  },
  {
    id: '4',
    title: 'Tour Guide: Historical Museum',
    description: 'Guided tour through a local history museum',
    level: 'Medium',
    sections: 4,
    duration: '30 min',
    questionsCount: 40
  },
];

export default function ListeningListScreen({ onNavigate }: ListeningListScreenProps) {
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
        <h1 className="text-2xl text-gray-900 mb-2">Listening Practice</h1>
        <p className="text-gray-600">Enhance listening skills with real-world scenarios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listeningItems.map((item) => (
          <Card 
            key={item.id}
            className="hover:shadow-lg transition-all cursor-pointer border hover:border-purple-300"
            onClick={() => onNavigate('listening-detail', item.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={getLevelColor(item.level)}>
                  {item.level}
                </Badge>
                <Badge variant="outline">{item.sections} sections</Badge>
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
                  <Headphones className="w-4 h-4 mr-1" />
                  {item.questionsCount} questions
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
