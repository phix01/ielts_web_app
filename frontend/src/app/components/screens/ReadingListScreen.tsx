import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Screen } from '../Dashboard';
import { contentService, Reading, ReadingType } from '../../services/contentService';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';

interface ReadingListScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

export default function ReadingListScreen({ onNavigate }: ReadingListScreenProps) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch readings for all types
        const allReadings: Reading[] = [];
        const readingTypes = Object.values(ReadingType);
        
        for (const type of readingTypes) {
          try {
            const typeReadings = await contentService.getReadingsByType(type);
            if (Array.isArray(typeReadings) && typeReadings.length > 0) {
              allReadings.push(...typeReadings);
            }
          } catch (err) {
            // Continue if one type fails
            console.warn(`Failed to fetch readings for type ${type}:`, err);
          }
        }
        setReadings(allReadings);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load readings');
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);
  const getLevelColor = (level: string) => {
    const levelLower = level.toLowerCase();
    switch (levelLower) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getQuestionsCount = (reading: Reading): number => {
    const initialCount = reading.initialQuestions?.length || 0;
    const endingCount = reading.endingQuestions?.length || 0;
    return initialCount + endingCount;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Reading Practice</h1>
        <p className="text-gray-600">Improve your reading comprehension with diverse passages</p>
      </div>

      {readings.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No readings available at the moment.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {readings.map((reading) => (
            <Card 
              key={reading.id}
              className="hover:shadow-lg transition-all cursor-pointer border hover:border-blue-300"
              onClick={() => onNavigate('reading-detail', reading.id.toString())}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getLevelColor(reading.level)}>
                    {reading.level || 'N/A'}
                  </Badge>
                  <Badge variant="outline">{reading.type}</Badge>
                </div>
                <CardTitle>{reading.title || 'Untitled Reading'}</CardTitle>
                <CardDescription>
                  {reading.summary ? reading.summary.substring(0, 100) + '...' : 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {getQuestionsCount(reading)} questions
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
