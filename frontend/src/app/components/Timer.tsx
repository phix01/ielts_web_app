import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

interface TimerProps {
  /** initial duration in minutes (default 60) */
  initialMinutes?: number;
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function Timer({ initialMinutes = 60 }: TimerProps) {
  const initialSeconds = initialMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning || isFinished) return;

    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          setIsFinished(true);
          // show an immediate alert and let the in-component alert be visible
          window.alert('Time is up');
          // create a notification for timer finishing
          try {
            notificationService.add({ message: 'Timer finished', type: 'test' });
          } catch {}
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, isFinished]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  const formatted = hours > 0
    ? `${pad(hours)}:${pad(displayMinutes)}:${pad(seconds)}`
    : `${pad(displayMinutes)}:${pad(seconds)}`;

  const handleStart = () => {
    if (isFinished) return;
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemainingSeconds(initialSeconds);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-mono text-gray-900">{formatted}</div>
          <div className="w-full flex space-x-2">
            <Button
              onClick={handleStart}
              disabled={isRunning || isFinished}
              className="flex-1"
            >
              {isFinished ? 'Time is up' : isRunning ? 'Running' : remainingSeconds < initialSeconds ? 'Resume' : 'Start'}
            </Button>

            <Button onClick={handleStop} disabled={!isRunning || isFinished} className="">
              Stop
            </Button>

            <Button onClick={handleReset} className="">
              Reset
            </Button>
          </div>

          {isFinished && (
            <div className="w-full">
              <Alert variant="destructive">
                <AlertTitle>Time is up</AlertTitle>
                <AlertDescription>The timer has reached 00:00.</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
