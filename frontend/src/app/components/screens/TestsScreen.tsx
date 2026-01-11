import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, FileQuestion } from 'lucide-react';
import { Screen } from '../Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface TestsScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

interface Test {
  id: string;
  title: string;
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  questionsCount: number;
  duration: string;
  category: string;
}

const tests: Test[] = [
  {
    id: '1',
    title: 'General English Proficiency Test',
    description: 'Assess your overall English language skills',
    level: 'Easy',
    questionsCount: 30,
    duration: '45 min',
    category: 'Easy'
  },
  {
    id: '2',
    title: 'Academic Vocabulary Assessment',
    description: 'Test your knowledge of academic English',
    level: 'Easy',
    questionsCount: 25,
    duration: '30 min',
    category: 'Easy'
  },
  {
    id: '3',
    title: 'IELTS Practice Test - Full',
    description: 'Complete IELTS simulation with all sections',
    level: 'Medium',
    questionsCount: 40,
    duration: '60 min',
    category: 'Medium'
  },
  {
    id: '4',
    title: 'Reading Comprehension Advanced',
    description: 'Challenge yourself with complex passages',
    level: 'Medium',
    questionsCount: 35,
    duration: '50 min',
    category: 'Medium'
  },
  {
    id: '5',
    title: 'IELTS Academic Module - Full Test',
    description: 'Complete academic IELTS practice test',
    level: 'Hard',
    questionsCount: 50,
    duration: '90 min',
    category: 'Hard'
  },
  {
    id: '6',
    title: 'Advanced Grammar and Usage',
    description: 'Master complex grammatical structures',
    level: 'Hard',
    questionsCount: 40,
    duration: '60 min',
    category: 'Hard'
  },
];

export default function TestsScreen({ onNavigate }: TestsScreenProps) {
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

  const getTestsByLevel = (category: string) => {
    return tests.filter(test => test.category === category);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">IELTS Tests</h1>
        <p className="text-gray-600">Take comprehensive tests to evaluate your progress</p>
      </div>

      <Tabs defaultValue="Easy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Easy">Easy</TabsTrigger>
          <TabsTrigger value="Medium">Medium</TabsTrigger>
          <TabsTrigger value="Hard">Hard</TabsTrigger>
        </TabsList>

        {['Easy', 'Medium', 'Hard'].map((level) => (
          <TabsContent key={level} value={level}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getTestsByLevel(level).map((test) => (
                <Card 
                  key={test.id}
                  className="hover:shadow-lg transition-all cursor-pointer border hover:border-indigo-300"
                  onClick={() => onNavigate('test-detail', test.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getLevelColor(test.level)}>
                        {test.level}
                      </Badge>
                    </div>
                    <CardTitle>{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {test.duration}
                      </div>
                      <div className="flex items-center">
                        <FileQuestion className="w-4 h-4 mr-1" />
                        {test.questionsCount} questions
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
