import { useState } from 'react';
import { Button } from '../ui/button';
import { notificationService } from '../../services/notificationService';
import Timer from '../Timer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CircleCheck, CircleX } from 'lucide-react';

interface TestDetailScreenProps {
  itemId: string | null;
  onBack: () => void;
}

export default function TestDetailScreen({ onBack }: TestDetailScreenProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const test = {
    title: 'General English Proficiency Test',
    level: 'Easy',
    duration: '45 min',
    questions: [
      {
        id: 'q1',
        question: 'Which word is a synonym for "happy"?',
        options: ['Sad', 'Joyful', 'Angry', 'Tired'],
        correctAnswer: 'Joyful'
      },
      {
        id: 'q2',
        question: 'Choose the correct form: "She ___ to school every day."',
        options: ['go', 'goes', 'going', 'gone'],
        correctAnswer: 'goes'
      },
      {
        id: 'q3',
        question: 'What is the past tense of "write"?',
        options: ['writed', 'wrote', 'written', 'writing'],
        correctAnswer: 'wrote'
      },
      {
        id: 'q4',
        question: 'Which sentence is grammatically correct?',
        options: [
          'He don\'t like pizza',
          'He doesn\'t like pizza',
          'He not like pizza',
          'He no like pizza'
        ],
        correctAnswer: 'He doesn\'t like pizza'
      },
      {
        id: 'q5',
        question: 'What does "procrastinate" mean?',
        options: [
          'To do something immediately',
          'To delay doing something',
          'To finish early',
          'To work efficiently'
        ],
        correctAnswer: 'To delay doing something'
      },
      {
        id: 'q6',
        question: 'Choose the correct preposition: "I\'m interested ___ learning Spanish."',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in'
      },
      {
        id: 'q7',
        question: 'Which word is an antonym for "difficult"?',
        options: ['Hard', 'Easy', 'Challenging', 'Complex'],
        correctAnswer: 'Easy'
      },
      {
        id: 'q8',
        question: 'What is the plural of "child"?',
        options: ['childs', 'childes', 'children', 'childrens'],
        correctAnswer: 'children'
      },
    ]
  };

  // parse minutes from the test duration if available (e.g. "45 min")
  const parsedMinutes = (() => {
    const m = test.duration.match(/(\d+)\s*min/i);
    return m ? Number(m[1]) : 60;
  })();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      notificationService.add({ message: `Completed test: ${test.title}`, type: 'test' });
    } catch {}
  };

  const correctAnswers = test.questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const score = Math.round((correctAnswers / test.questions.length) * 100);

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tests
      </Button>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-gray-900">{test.title}</h1>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-700">{test.level}</Badge>
            <Badge variant="outline">{test.duration}</Badge>
          </div>
        </div>

        {!submitted && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-700">
                Answer all questions and click submit when you're ready. You have {test.duration} to complete this test.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {submitted && (
        <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl text-gray-900 mb-4">Test Results</h3>
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-4">
                <div>
                  <div className="text-4xl text-indigo-600">{score}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">
                You answered {correctAnswers} out of {test.questions.length} questions correctly
              </p>
              <p className="text-sm text-gray-600">
                {score >= 80 ? 'Excellent work! 🎉' : score >= 60 ? 'Good job! Keep practicing. 👍' : 'Keep studying and try again! 💪'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {test.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">
                  Question {index + 1}: {question.question}
                </CardTitle>
                {submitted && (
                  answers[question.id] === question.correctAnswer ? (
                    <CircleCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <CircleX className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )
                )}
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                disabled={submitted}
              >
                {question.options.map((option, optionIndex) => {
                  const isCorrect = option === question.correctAnswer;
                  const isSelected = answers[question.id] === option;
                  
                  return (
                    <div 
                      key={optionIndex} 
                      className={`flex items-center space-x-2 mb-2 p-2 rounded ${
                        submitted
                          ? isCorrect
                            ? 'bg-green-50 border border-green-200'
                            : isSelected
                            ? 'bg-red-50 border border-red-200'
                            : ''
                          : ''
                      }`}
                    >
                      <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                      <Label 
                        htmlFor={`${question.id}-${optionIndex}`}
                        className={`flex-1 ${
                          submitted
                            ? isCorrect
                              ? 'text-green-700'
                              : isSelected
                              ? 'text-red-700'
                              : ''
                            : ''
                        }`}
                      >
                        {option}
                      </Label>
                      {submitted && isCorrect && (
                        <CircleCheck className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      {!submitted && (
        <Button 
          onClick={handleSubmit} 
          size="lg" 
          className="w-full mt-8"
          disabled={Object.keys(answers).length < test.questions.length}
        >
          Submit Test
        </Button>
      )}
      </div>

      {/* Fixed timer on the right side of the test detail screen */}
      <div className="fixed right-6 top-24 w-64 z-50">
        <Timer initialMinutes={parsedMinutes} />
      </div>
    </>
  );
}