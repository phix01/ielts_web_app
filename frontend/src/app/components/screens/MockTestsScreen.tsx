import { useEffect, useState } from 'react';
import { mockTestsService, MockTestResult } from '../../services/mockTestsService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Screen } from '../Dashboard';

interface Props { onNavigate: (s: Screen, id?: string) => void }

export default function MockTestsScreen({ onNavigate }: Props) {
  const [list, setList] = useState<MockTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<MockTestResult>({ readingBand: 6, listeningBand: 6, writingBand: 6, speakingBand: 6 });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await mockTestsService.list();
      setList(data || []);
    } catch (e: any) {
      setError(e?.response?.data || 'Failed to load mock tests');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await mockTestsService.create(form);
      setForm({ readingBand: 6, listeningBand: 6, writingBand: 6, speakingBand: 6 });
      await load();
    } catch (e: any) { setError(e?.response?.data || 'Failed to create'); }
  };

  const del = async (id?: number) => {
    if (!id) return;
    try {
      await mockTestsService.delete(id);
      await load();
    } catch (e: any) { setError(e?.response?.data || 'Failed to delete'); }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Mock Tests</h1>
        <p className="text-gray-600">Save mock test scores to track your progress (demo)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[['Reading','readingBand'], ['Listening','listeningBand'], ['Writing','writingBand'], ['Speaking','speakingBand']].map(([label, key]) => (
                <div key={String(key)} className="flex items-center space-x-2">
                  <div className="w-32 text-sm text-gray-700">{label}</div>
                  <input type="number" step="0.1" min="0" max="9" value={(form as any)[key]} onChange={(e) => setForm({...form, [(key as string)]: parseFloat(e.target.value || '0')})} className="border px-2 py-1 rounded w-24" />
                </div>
              ))}

              {error && <div className="text-xs text-red-500">{error}</div>}

              <div className="flex space-x-2 mt-3">
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={submit}>Add</button>
                <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setForm({ readingBand: 6, listeningBand: 6, writingBand: 6, speakingBand: 6 })}>Reset</button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div>Loading...</div> : (
                <div className="space-y-3">
                  {list.length === 0 && <div className="text-sm text-gray-500">No results yet.</div>}
                  {list.map(r => (
                    <div key={r.id} className="p-3 border rounded flex justify-between items-center bg-white">
                      <div>
                        <div className="font-semibold">{r.overallBand || Math.round(((r.readingBand + r.listeningBand + r.writingBand + r.speakingBand)/4.0)*10)/10.0} overall</div>
                        <div className="text-sm text-gray-500">Taken: {r.takenAt ? new Date(r.takenAt).toLocaleString() : '—'}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-700">R {r.readingBand} L {r.listeningBand} W {r.writingBand} S {r.speakingBand}</div>
                        <button className="text-xs text-red-600" onClick={() => del(r.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
