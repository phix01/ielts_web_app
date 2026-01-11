import { BookOpen, FileText, Headphones, Mic, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import { progressService } from '../../services/progressService';
import { goalsService } from '../../services/goalsService';
import { Badge } from '../ui/badge';
import { Screen } from '../Dashboard';

function TodaysPlanCard() {
  const [goal, setGoal] = useState<any | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({ readingMinutesTarget: 0, listeningMinutesTarget: 0, writingTasksTarget: 0, vocabularyTarget: 0, completed: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const g = await goalsService.getToday();
        if (!mounted) return;
        setGoal(g);
      } catch (e) {
        // ignore
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const startEdit = () => {
    setForm({ readingMinutesTarget: goal?.readingMinutesTarget || 20, listeningMinutesTarget: goal?.listeningMinutesTarget || 15, writingTasksTarget: goal?.writingTasksTarget || 1, vocabularyTarget: goal?.vocabularyTarget || 10, completed: goal?.completed || false });
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const save = async () => {
    setLoading(true);
    try {
      const updated = await goalsService.updateToday(form);
      setGoal(updated);
      setEditing(false);
    } catch (e) {
      // ignore errors for now
    } finally { setLoading(false); }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle>Today's Plan</CardTitle>
            <p className="text-sm text-gray-500">Daily study targets</p>
          </div>
          <div className="flex items-center space-x-2">
            {!editing ? (
              <button onClick={startEdit} className="text-xs px-3 py-1 rounded bg-blue-600 text-white">Edit plan</button>
            ) : (
              <>
                <button onClick={save} className="text-xs px-3 py-1 rounded bg-blue-600 text-white">{loading ? '...' : 'Save'}</button>
                <button onClick={cancel} className="text-xs px-3 py-1 rounded bg-gray-200">Cancel</button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!editing ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Reading</div>
              <div className="text-sm text-gray-900">{goal?.readingMinutesTarget || 0} min</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Listening</div>
              <div className="text-sm text-gray-900">{goal?.listeningMinutesTarget || 0} min</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Writing</div>
              <div className="text-sm text-gray-900">{goal?.writingTasksTarget || 0} task{(goal?.writingTasksTarget || 0) !== 1 ? 's' : ''}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Vocabulary</div>
              <div className="text-sm text-gray-900">{goal?.vocabularyTarget || 0} words</div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-500">Status</div>
              <div>
                {goal?.completed ? (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Completed</span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">Not completed</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-36 text-sm text-gray-600">Reading (min)</div>
              <input type="number" value={form.readingMinutesTarget} onChange={(e) => setForm({...form, readingMinutesTarget: parseInt(e.target.value || '0')})} className="border px-2 py-1 rounded w-24" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-36 text-sm text-gray-600">Listening (min)</div>
              <input type="number" value={form.listeningMinutesTarget} onChange={(e) => setForm({...form, listeningMinutesTarget: parseInt(e.target.value || '0')})} className="border px-2 py-1 rounded w-24" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-36 text-sm text-gray-600">Writing tasks</div>
              <input type="number" value={form.writingTasksTarget} onChange={(e) => setForm({...form, writingTasksTarget: parseInt(e.target.value || '0')})} className="border px-2 py-1 rounded w-24" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-36 text-sm text-gray-600">Vocabulary</div>
              <input type="number" value={form.vocabularyTarget} onChange={(e) => setForm({...form, vocabularyTarget: parseInt(e.target.value || '0')})} className="border px-2 py-1 rounded w-24" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm"><input type="checkbox" checked={form.completed} onChange={(e) => setForm({...form, completed: e.target.checked})} /> Mark complete</label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


interface HomeScreenProps {
  onNavigate: (screen: Screen, itemId?: string) => void;
}

interface SkillCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  level: 'Easy' | 'Medium' | 'Hard';
  screen: Screen;
}

function RecentProgress({ progress }: { progress: Record<string, number> }) {
  const pct = (count: number) => `${Math.min(100, Math.round((count / 10) * 100))}%`;

  return (
    <div className="space-y-4">
      {[
        { key: 'READING', label: 'Reading', color: 'bg-blue-600' },
        { key: 'WRITING', label: 'Writing', color: 'bg-green-600' },
        { key: 'LISTENING', label: 'Listening', color: 'bg-purple-600' },
        { key: 'SPEAKING', label: 'Speaking', color: 'bg-orange-600' },
      ].map(({ key, label, color }) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{label}</span>
            <span className="text-gray-900">{pct(progress[key] || 0)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: pct(progress[key] || 0) }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [progress, setProgress] = useState<Record<string, number>>({ READING: 0, LISTENING: 0, WRITING: 0, SPEAKING: 0 });
  const [dashboardStats, setDashboardStats] = useState<{ completedExercises: number; practiceTimeHours: number; vocabularyWords: number; testsCompleted: number }>({ completedExercises: 0, practiceTimeHours: 0, vocabularyWords: 0, testsCompleted: 0 });

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const data = await progressService.summary();
        if (!mounted) return;
        setProgress({ READING: data.READING || 0, LISTENING: data.LISTENING || 0, WRITING: data.WRITING || 0, SPEAKING: data.SPEAKING || 0 });
        try {
          const ds = await progressService.dashboardStats();
          if (!mounted) return;
          setDashboardStats(ds);
        } catch (e) {
          // fallback already handled inside service
        }
      } catch (e) {
        if (!mounted) return;
        setProgress({ READING: 0, LISTENING: 0, WRITING: 0, SPEAKING: 0 });
      }
    };

    fetch();

    const onChange = () => fetch();
    window.addEventListener('progress:changed', onChange as EventListener);
    return () => { mounted = false; window.removeEventListener('progress:changed', onChange as EventListener); };
  }, []);
  const skills: SkillCard[] = [
    {
      title: 'Reading',
      description: 'Improve your reading comprehension with diverse passages',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      level: 'Medium',
      screen: 'reading-list'
    },
    {
      title: 'Writing',
      description: 'Master essay writing and task responses',
      icon: <FileText className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      level: 'Hard',
      screen: 'writing-list'
    },
    {
      title: 'Listening',
      description: 'Enhance listening skills with real-world scenarios',
      icon: <Headphones className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      level: 'Medium',
      screen: 'listening-list'
    },
    {
      title: 'Speaking',
      description: 'Practice speaking topics and get feedback',
      icon: <Mic className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      level: 'Easy',
      screen: 'speaking-list'
    },
  ];

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
        <h1 className="text-2xl text-gray-900 mb-2">IELTS Preparation Dashboard</h1>
        <p className="text-gray-600">Choose a skill to practice and improve your IELTS score</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {skills.map((skill) => (
          <Card 
            key={skill.title}
            className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200"
            onClick={() => onNavigate(skill.screen)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`${skill.bgColor} ${skill.color} p-3 rounded-xl`}>
                  {skill.icon}
                </div>
                <Badge className={getLevelColor(skill.level)}>
                  {skill.level}
                </Badge>
              </div>
              <CardTitle className="mt-4">{skill.title}</CardTitle>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                <span className="text-sm">Start practicing</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentProgress progress={progress} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-5xl mb-2">🔥</div>
              <div className="text-3xl text-gray-900 mb-1">{progress.STREAK || 0}</div>
              <p className="text-sm text-gray-600">Days in a row</p>
              <p className="text-xs text-gray-500 mt-4">Keep it up! Practice daily to maintain your streak.</p>
            </div>
          </CardContent>
        </Card>

        <TodaysPlanCard />

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Exercises</span>
                <span className="text-gray-900">{dashboardStats.completedExercises}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Practice Time</span>
                <span className="text-gray-900">{dashboardStats.practiceTimeHours} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vocabulary Words</span>
                <span className="text-gray-900">{dashboardStats.vocabularyWords}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tests Completed</span>
                <span className="text-gray-900">{dashboardStats.testsCompleted}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
