import { useEffect, useRef, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Mic, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface SpeakingDetailScreenProps {
  itemId: string | null;
  onBack: () => void;
}

export default function SpeakingDetailScreen({ onBack }: SpeakingDetailScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [progressReported, setProgressReported] = useState<boolean>(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const speaking = {
    title: 'Describe Your Hometown',
    level: 'Easy',
    partType: 'Part 1',
    topic: 'Talk about the place where you grew up and what makes it special to you.',
    thingsToTalkAbout: [
      'Where it is located',
      'What it looks like',
      'What people do there',
      'Why it is important to you',
      'What has changed over the years',
      'Your favorite places in the area'
    ],
    suggestedVocabulary: [
      'urban',
      'suburban',
      'countryside',
      'community',
      'nostalgic',
      'landmarks',
      'architecture',
      'diverse',
      'vibrant',
      'tranquil',
      'picturesque',
      'bustling'
    ],
    sampleAnswer: `I'd like to talk about my hometown, which is a medium-sized city in the northern part of my country. It's a place that holds many special memories for me.

The city is situated near a beautiful lake and is surrounded by rolling hills, which makes the scenery quite picturesque. The architecture is a mix of modern buildings and historical structures that date back several centuries, giving the city a unique character.

Most people in my hometown work in the service sector, though there's also a growing tech industry. The city has a vibrant cultural scene with theaters, museums, and art galleries that attract visitors from across the region.

What makes my hometown particularly special to me is the sense of community. Despite being a fairly large city, people are generally friendly and there's a strong neighborhood spirit. I have fond memories of walking through the old town with my family and visiting the local markets.

Over the years, the city has changed quite a bit. New shopping centers and residential areas have been developed, and public transportation has improved significantly. However, the historic center has been well-preserved, which I really appreciate.

My favorite place in my hometown is definitely the lakeside promenade. It's a peaceful area where people go to relax, exercise, and enjoy the natural beauty. I often go there when I visit home to reflect and reconnect with my roots.`
  };

  const startRecording = async () => {
    setRecordingError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const options: MediaRecorderOptions = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm')) options.mimeType = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) options.mimeType = 'audio/ogg';
      }

      const mr = new MediaRecorder(stream, options as MediaRecorderOptions);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onerror = () => setRecordingError('Recording error');

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || 'audio/webm' });
        if (recordedUrl) {
          try { URL.revokeObjectURL(recordedUrl); } catch {}
        }
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedUrl(url);
        // report speaking progress once per recording
        try {
          if (!progressReported) {
            // lazy import to avoid circular issues
            import('../../services/progressService').then(({ progressService }) => progressService.complete('SPEAKING'));
            setProgressReported(true);
          }
        } catch (e) { console.warn(e); }
        // attach to audio player if present
        if (audioPlayerRef.current) audioPlayerRef.current.src = url;
      };

      mr.start();
      setIsRecording(true);
    } catch (err: any) {
      setRecordingError(err?.message || 'Microphone access denied');
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') mr.stop();

    const stream = mediaStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
      if (mediaStreamRef.current) {
        try { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
        mediaStreamRef.current = null;
      }
      if (recordedUrl) {
        try { URL.revokeObjectURL(recordedUrl); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Speaking List
      </Button>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-gray-900">{speaking.title}</h1>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-700">{speaking.level}</Badge>
            <Badge variant="outline">{speaking.partType}</Badge>
          </div>
        </div>
      </div>

      <Card className="mb-6 bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle>Speaking Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900">{speaking.topic}</p>
        </CardContent>
      </Card>

      {/* Recorded audio playback / download */}
      {recordingError && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertTitle>Recording error</AlertTitle>
            <AlertDescription>{recordingError}</AlertDescription>
          </Alert>
        </div>
      )}

      {recordedUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <audio ref={audioPlayerRef} controls src={recordedUrl} className="w-full" />
              <div className="flex items-center space-x-2">
                <a href={recordedUrl} download={`speaking-recording${recordedBlob?.type?.includes('ogg') ? '.ogg' : recordedBlob?.type?.includes('wav') ? '.wav' : '.webm'}`}>
                  <Button>Download</Button>
                </a>
                <Button
                  variant="ghost"
                  onClick={() => {
                    // revoke url and clear recorded blob
                    try { if (recordedUrl) URL.revokeObjectURL(recordedUrl); } catch {}
                    setRecordedUrl(null);
                    setRecordedBlob(null);
                    setProgressReported(false);
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Things to Talk About</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {speaking.thingsToTalkAbout.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Suggested Vocabulary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {speaking.suggestedVocabulary.map((word, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {word}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
        <CardHeader>
          <CardTitle>Practice Recording</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Button
              size="lg"
              variant={isRecording ? 'destructive' : 'default'}
              onClick={toggleRecording}
              className="w-32 h-32 rounded-full text-lg"
            >
              {isRecording ? (
                <>
                  <Square className="w-8 h-8" />
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8" />
                </>
              )}
            </Button>
            <p className="mt-4 text-gray-600">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
            </p>
            {isRecording && (
              <div className="mt-4 flex justify-center items-center space-x-1">
                <div className="w-1 h-8 bg-orange-500 animate-pulse"></div>
                <div className="w-1 h-12 bg-orange-500 animate-pulse delay-75"></div>
                <div className="w-1 h-6 bg-orange-500 animate-pulse delay-150"></div>
                <div className="w-1 h-10 bg-orange-500 animate-pulse"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Collapsible open={showSample} onOpenChange={setShowSample}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle>Sample Answer (Band 7.5)</CardTitle>
                {showSample ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="prose max-w-none">
                {speaking.sampleAnswer.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
