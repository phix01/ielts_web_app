import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, CircleCheck, CircleX, Loader2, AlertCircle } from 'lucide-react';
import { contentService, Reading, ReadingType } from '../../services/contentService';
import { Alert, AlertDescription } from '../ui/alert';
import { notificationService } from '../../services/notificationService';
import { progressService } from '../../services/progressService';
import { Skeleton } from '../ui/skeleton';

interface ReadingDetailScreenProps {
  itemId: string | null;
  onBack: () => void;
}

export default function ReadingDetailScreen({ itemId, onBack }: ReadingDetailScreenProps) {
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchReading = async () => {
      if (!itemId) {
        setError('No reading ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await contentService.getReadingById(parseInt(itemId));
        setReading(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load reading');
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [itemId]);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-32 w-full mb-4" />
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reading List
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Reading not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform backend data to UI format
  const initialQuestions = reading.initialQuestions || [];
  const endingQuestions = reading.endingQuestions || [];
  const mcqQuestions = reading.mcqQuestions || [];
  const isMCQType = reading.type === ReadingType.MCQS && mcqQuestions.length > 0;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      notificationService.add({ message: `Completed reading: ${reading?.title || 'Untitled'}`, type: 'reading' });
    } catch {}
    // report progress (non-blocking)
    try { progressService.complete('READING'); } catch (e) { console.warn(e); }
  };

  const allQuestions = isMCQType ? mcqQuestions : [...initialQuestions, ...endingQuestions];
  const totalQuestions = isMCQType ? mcqQuestions.length : allQuestions.length;

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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Reading List
      </Button>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-gray-900">{reading.title || 'Untitled Reading'}</h1>
          <div className="flex gap-2">
            <Badge className={getLevelColor(reading.level)}>
              {reading.level || 'N/A'}
            </Badge>
            {reading.type && (
              <Badge variant="outline">{reading.type}</Badge>
            )}
          </div>
        </div>
        
        {reading.whatToDo && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-700">{reading.whatToDo}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {reading.paragraph && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reading Passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {reading.paragraph.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {allQuestions.length > 0 && (
        <div className="space-y-6 mb-8">
          <h2 className="text-xl text-gray-900">Questions</h2>
          
          {isMCQType ? (
            // Render MCQ questions with radio buttons (A, B, C, D)
            <div className="space-y-6">
              {mcqQuestions.map((question, index) => {
                const questionId = `mcq-${question.id}`;
                const isCorrect = answers[questionId] === question.correctAnswer;
                const isSelected = answers[questionId] !== undefined;
                
                return (
                  <Card key={question.id} className="mb-4">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          Question {question.questionOrder || index + 1}: {question.questionText}
                        </CardTitle>
                        {submitted && (
                          isCorrect ? (
                            <CircleCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : isSelected ? (
                            <CircleX className="w-5 h-5 text-red-600 flex-shrink-0" />
                          ) : null
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={answers[questionId] || ''}
                        onValueChange={(value) => handleAnswerChange(questionId, value)}
                        disabled={submitted}
                      >
                        {question.options.map((option, optionIndex) => {
                          const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
                          const optionValue = optionLetter;
                          const isOptionCorrect = optionValue === question.correctAnswer;
                          const isOptionSelected = answers[questionId] === optionValue;
                          
                          return (
                            <div
                              key={optionIndex}
                              className={`flex items-center space-x-2 mb-2 p-2 rounded ${
                                submitted
                                  ? isOptionCorrect
                                    ? 'bg-green-50 border border-green-200'
                                    : isOptionSelected
                                    ? 'bg-red-50 border border-red-200'
                                    : ''
                                  : ''
                              }`}
                            >
                              <RadioGroupItem value={optionValue} id={`${questionId}-${optionIndex}`} />
                              <Label
                                htmlFor={`${questionId}-${optionIndex}`}
                                className={`flex-1 cursor-pointer ${
                                  submitted
                                    ? isOptionCorrect
                                      ? 'text-green-700 font-medium'
                                      : isOptionSelected
                                      ? 'text-red-700'
                                      : ''
                                    : ''
                                }`}
                              >
                                <span className="font-semibold mr-2">{optionLetter}.</span>
                                {option}
                              </Label>
                              {submitted && isOptionCorrect && (
                                <CircleCheck className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          );
                        })}
                      </RadioGroup>
                      {submitted && (
                        <p className="mt-3 text-sm text-gray-600">
                          Correct answer: <span className="font-semibold text-green-700">{question.correctAnswer}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            // Render text-based questions (existing functionality)
            <>
              {initialQuestions.length > 0 && (
                <div>
                  <h3 className="text-lg text-gray-800 mb-4">Initial Questions</h3>
                  {initialQuestions.map((question, index) => (
                    <Card key={`initial-${index}`} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Question {index + 1}: {question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 italic">
                          Answer this question based on the reading passage above.
                        </p>
                        <div className="mt-4">
                          <Label htmlFor={`answer-${index}`}>Your Answer:</Label>
                          <textarea
                            id={`answer-${index}`}
                            className="w-full mt-2 p-2 border rounded"
                            value={answers[`initial-${index}`] || ''}
                            onChange={(e) => handleAnswerChange(`initial-${index}`, e.target.value)}
                            disabled={submitted}
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {endingQuestions.length > 0 && (
                <div>
                  <h3 className="text-lg text-gray-800 mb-4">Ending Questions</h3>
                  {endingQuestions.map((question, index) => (
                    <Card key={`ending-${index}`} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Question {initialQuestions.length + index + 1}: {question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 italic">
                          Answer this question based on the reading passage above.
                        </p>
                        <div className="mt-4">
                          <Label htmlFor={`answer-ending-${index}`}>Your Answer:</Label>
                          <textarea
                            id={`answer-ending-${index}`}
                            className="w-full mt-2 p-2 border rounded"
                            value={answers[`ending-${index}`] || ''}
                            onChange={(e) => handleAnswerChange(`ending-${index}`, e.target.value)}
                            disabled={submitted}
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {reading.summary && (
        <Card className="mb-6 bg-gray-50">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{reading.summary}</p>
          </CardContent>
        </Card>
      )}

      {!isMCQType && reading.answers && reading.answers.length > 0 && submitted && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle>Correct Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {reading.answers.map((answer, index) => (
                <li key={index} className="text-gray-700">
                  Question {index + 1}: {answer}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!submitted ? (
        <Button onClick={handleSubmit} size="lg" className="w-full">
          Submit Answers
        </Button>
      ) : (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl text-gray-900 mb-2">Answers Submitted</h3>
              <p className="text-gray-600">
                You answered {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}