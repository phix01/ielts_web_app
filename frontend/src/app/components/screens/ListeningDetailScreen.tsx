import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { progressService } from '../../services/progressService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ListeningDetailScreenProps {
  itemId: string | null;
  onBack: () => void;
}

export default function ListeningDetailScreen({ onBack }: ListeningDetailScreenProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('section1');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef<boolean>(false);
  const playOnLoadRef = useRef<boolean>(false);

  const listening = {
    title: 'Academic Lecture: Marine Biology',
    level: 'Hard',
    sections: [
      {
        id: 'section1',
        title: 'Section 1: Introduction to Marine Ecosystems',
        instructions: 'Listen to the first part of the lecture and answer questions 1-10',
        audioUrl: '/audio/listening/marine-biology/section1.mp3',
        questions: [
          { id: 'q1', question: 'What is the main focus of marine biology?', answer: 'ocean life' },
          { id: 'q2', question: 'How many major ocean zones are there?', answer: '5' },
          { id: 'q3', question: 'What percentage of Earth is covered by oceans?', answer: '71' },
        ]
      },
      {
        id: 'section2',
        title: 'Section 2: Coral Reef Systems',
        instructions: 'Listen to the second part and answer questions 11-20',
        audioUrl: '/audio/listening/marine-biology/section2.mp3',
        questions: [
          { id: 'q4', question: 'Coral reefs are found in which type of water?', answer: 'warm shallow' },
          { id: 'q5', question: 'What do corals primarily feed on?', answer: 'plankton' },
        ]
      },
      {
        id: 'section3',
        title: 'Section 3: Deep Ocean Exploration',
        instructions: 'Listen to the third part and answer questions 21-30',
        audioUrl: '/audio/listening/marine-biology/section3.mp3',
        questions: [
          { id: 'q6', question: 'At what depth does the midnight zone begin?', answer: '1000 meters' },
          { id: 'q7', question: 'What special adaptation do deep-sea creatures have?', answer: 'bioluminescence' },
        ]
      },
      {
        id: 'section4',
        title: 'Section 4: Conservation Challenges',
        instructions: 'Listen to the final part and answer questions 31-40',
        audioUrl: '/audio/listening/marine-biology/section4.mp3',
        questions: [
          { id: 'q8', question: 'What is the biggest threat to marine life?', answer: 'pollution' },
          { id: 'q9', question: 'Which international agreement protects marine areas?', answer: 'marine protected areas' },
        ]
      },
    ]
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      notificationService.add({ message: `Completed listening: ${listening.title}`, type: 'listening' });
    } catch {}
    try { progressService.complete('LISTENING'); } catch (e) { console.warn(e); }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // autoplay might be blocked by browser; just keep state consistent
        });
      }
      setIsPlaying(true);
    }
  };

  const handleResetAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const allQuestions = listening.sections.flatMap(s => s.questions);
  const correctAnswers = allQuestions.filter(q => 
    answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()
  ).length;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [activeSection]);

  // When activeSection changes, switch audio source and reset playback state
  useEffect(() => {
    // Remember whether audio was playing before switching or a play was requested on load
    const wasPlaying = wasPlayingRef.current || playOnLoadRef.current;
    const audio = audioRef.current;
    const section = listening.sections.find(s => s.id === activeSection);
    if (!section) return;

    // Pause any existing audio element (if present)
    if (audio) {
      try {
        audio.pause();
      } catch {}
      audio.currentTime = 0;
    }

    // If the new audio element is mounted (audioRef points to it), set up source and play if needed
    // Note: audioRef is set after render, so this effect runs after the new audio exists in DOM
    if (audio) {
      if (audio.src !== section.audioUrl && audio.src !== window.location.origin + section.audioUrl) {
        audio.src = section.audioUrl;
        audio.load();
      }

      setCurrentTime(0);
      setDuration(isFinite(audio.duration) ? audio.duration : 0);

      if (wasPlaying) {
        const p = audio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      // clear any pending play request
      playOnLoadRef.current = false;
    }
  }, [activeSection]);

  // keep a ref of playing state so we know to auto-play when switching sections
  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const formatTime = (t: number) => {
    if (!isFinite(t) || t <= 0) return '0:00';
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listening List
      </Button>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-gray-900">{listening.title}</h1>
          <Badge className="bg-red-100 text-red-700">{listening.level}</Badge>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={(v: string) => setActiveSection(v)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {listening.sections.map((section, index) => (
            <TabsTrigger key={section.id} value={section.id}>
              Section {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

          {/* Single audio element shared by all sections */}
          <audio ref={audioRef} preload="metadata" className="hidden" />

        {listening.sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">{section.instructions}</p>
              </CardHeader>
              <CardContent>
                {/* Audio Player */}
                <div className="bg-gray-100 rounded-lg p-6 mb-6">
                  {/* audio element is shared and declared above */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        if (activeSection !== section.id) {
                          // request play after the new source loads
                          playOnLoadRef.current = true;
                          setActiveSection(section.id);
                        } else {
                          togglePlayPause();
                        }
                      }}
                      className="w-16 h-16 rounded-full"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </Button>
                    <Button size="lg" variant="ghost" onClick={handleResetAudio}>
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {section.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <label className="block mb-2 text-sm text-gray-900">
                        Question {index + 1}: {question.question}
                      </label>
                      <Input
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Type your answer..."
                        disabled={submitted}
                        className={
                          submitted
                            ? answers[question.id]?.toLowerCase().trim() === question.answer.toLowerCase().trim()
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : ''
                        }
                      />
                      {submitted && (
                        <p className="mt-2 text-sm text-gray-600">
                          Correct answer: <span className="text-green-700">{question.answer}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {!submitted ? (
        <Button onClick={handleSubmit} size="lg" className="w-full">
          Submit All Answers
        </Button>
      ) : (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl text-gray-900 mb-2">Results</h3>
              <p className="text-3xl text-purple-600 mb-2">
                {correctAnswers} / {allQuestions.length}
              </p>
              <p className="text-gray-600">
                You got {Math.round((correctAnswers / allQuestions.length) * 100)}% correct!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
