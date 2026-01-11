import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Users, Activity } from 'lucide-react';
import { Screen } from '../Dashboard';
import { studyService, StudyRoom } from '../../services/studyService';
import { Alert, AlertDescription } from '../ui/alert';

interface StudyRoomsScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

export default function StudyRoomsScreen({ onNavigate }: StudyRoomsScreenProps) {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await studyService.listStudyRooms();
        setRooms(list || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load study rooms');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return (
    <div className="p-8">
      <Alert variant="destructive">
        <Activity className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Study Rooms</h1>
        <p className="text-gray-600">Join demo study rooms (read-only demo)</p>
      </div>

      {rooms.length === 0 ? (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>No study rooms available.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <Card key={r.id} className="hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-gray-700" />
                  <CardTitle>{r.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Participants: {r.participantCount}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
