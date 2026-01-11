import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Screen } from '../Dashboard';
import { leaderboardService, LeaderboardEntry } from '../../services/leaderboardService';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface LeaderboardScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
  user?: { username?: string } | null;
}

const initials = (name?: string) => {
  if (!name) return '?';
  return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
};

export default function LeaderboardScreen({ onNavigate, user }: LeaderboardScreenProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await leaderboardService.listLeaderboard();
        setEntries(list || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load leaderboard');
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
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  const top3 = entries.slice(0,3);
  const rest = entries.slice(3);

  return (
    <div className="p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold inline-flex items-center gap-2">🏆 Leaderboard</h1>
        <p className="text-gray-600">Top learners (demo)</p>
      </div>

      {entries.length === 0 ? (
        <Alert>
          <AlertDescription>No leaderboard data</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex justify-center">
              {top3[1] ? (
                <Card className="w-full max-w-xs text-center">
                  <CardContent>
                    <div className="text-sm text-gray-600">#2</div>
                    <div className="mx-auto my-2 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-semibold">{initials(top3[1].username)}</div>
                    <div className="font-semibold">{top3[1].username}</div>
                    <div className="text-sm text-gray-500">{top3[1].points} points</div>
                  </CardContent>
                </Card>
              ) : <div />}
            </div>

            <div className="flex justify-center">
              {top3[0] ? (
                <Card className="w-full max-w-xs transform scale-105 border-yellow-200">
                  <CardContent>
                    <div className="text-sm text-gray-600">#1</div>
                    <div className="mx-auto my-2 w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center font-bold text-yellow-700">{initials(top3[0].username)}</div>
                    <div className="font-semibold">{top3[0].username}</div>
                    <div className="text-sm text-gray-500">{top3[0].points} points</div>
                  </CardContent>
                </Card>
              ) : <div />}
            </div>

            <div className="flex justify-center">
              {top3[2] ? (
                <Card className="w-full max-w-xs text-center">
                  <CardContent>
                    <div className="text-sm text-gray-600">#3</div>
                    <div className="mx-auto my-2 w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center font-semibold text-orange-700">{initials(top3[2].username)}</div>
                    <div className="font-semibold">{top3[2].username}</div>
                    <div className="text-sm text-gray-500">{top3[2].points} points</div>
                  </CardContent>
                </Card>
              ) : <div />}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rest.length === 0 && entries.slice(0,3).length <= 3 && (
                  <div className="text-sm text-gray-500">No additional entries.</div>
                )}

                {rest.map((e, idx) => {
                  const rank = idx + 4;
                  const isYou = user && user.username && user.username === e.username;
                  return (
                    <div key={e.username} className={`flex items-center justify-between p-3 rounded-lg border ${isYou ? 'bg-blue-50 border-blue-100' : 'bg-white hover:bg-gray-50'} transition`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 font-semibold">{rank}</div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold">{initials(e.username)}</div>
                        <div>
                          <div className="font-semibold">{e.username}</div>
                          <div className="text-sm text-gray-500">{e.points} points</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isYou && <div className="text-xs text-white bg-blue-600 px-2 py-1 rounded">You</div>}
                        <div className="text-sm font-semibold">{e.points}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
