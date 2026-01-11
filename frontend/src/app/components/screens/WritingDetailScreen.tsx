import { useState } from 'react';
import { Button } from '../ui/button';
import Timer from '../Timer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { progressService } from '../../services/progressService';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface WritingDetailScreenProps {
  itemId: string | null;
  onBack: () => void;
}

export default function WritingDetailScreen({ onBack }: WritingDetailScreenProps) {
  const [userResponse, setUserResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const writing = {
    title: 'Advantages and Disadvantages of Remote Work',
    level: 'Medium',
    taskType: 'Task 2 - Opinion',
    prompt: `Many companies now allow their employees to work from home instead of commuting to an office every day.

Do the advantages of this trend outweigh the disadvantages?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    image: null,
    sampleAnswer: `In recent years, remote work has become increasingly prevalent, with many organizations embracing flexible working arrangements. While this trend offers several benefits, it also presents certain challenges. In my opinion, the advantages of working from home generally outweigh the drawbacks.

One of the primary advantages of remote work is the elimination of daily commuting. Employees save considerable time and money that would otherwise be spent on transportation, while also reducing their carbon footprint. Additionally, working from home often allows for greater flexibility in managing personal and professional responsibilities, leading to improved work-life balance. For instance, parents can more easily attend to their children's needs while maintaining their productivity.

Furthermore, remote work can enhance productivity for many individuals. Without the distractions common in traditional office environments, such as unnecessary meetings or office politics, employees can focus more effectively on their tasks. Companies also benefit from reduced overhead costs related to maintaining physical office spaces.

However, remote work does have some disadvantages. The lack of face-to-face interaction can lead to feelings of isolation and may hinder team collaboration. Some employees struggle with self-discipline and time management when working independently. Moreover, the blurring of boundaries between work and personal life can result in longer working hours and increased stress.

Despite these challenges, I believe the benefits of remote work are more significant. The key lies in finding the right balance and implementing effective communication strategies. With proper management and support systems in place, remote work can be highly beneficial for both employees and employers.`,
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Mock evaluation result
    setEvaluationResult({
      score: 7.5,
      feedback: {
        taskResponse: 'Good coverage of both advantages and disadvantages. Clear position stated.',
        coherenceCohesion: 'Well-organized paragraphs with appropriate linking words.',
        lexicalResource: 'Good range of vocabulary with some less common items.',
        grammaticalRange: 'Mix of simple and complex sentence structures with good accuracy.',
      },
    });
    try { progressService.complete('WRITING'); } catch (e) { console.warn(e); }
  };

  const wordCount = userResponse.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-start">
        <div className="flex-1">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Writing List
      </Button>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-gray-900">{writing.title}</h1>
          <div className="flex gap-2">
            <Badge className="bg-amber-100 text-amber-700">{writing.level}</Badge>
            <Badge variant="outline">{writing.taskType}</Badge>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Writing Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {writing.prompt.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Response</CardTitle>
            <Badge variant={wordCount >= 250 ? 'default' : 'secondary'}>
              {wordCount} / 250 words
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your essay here..."
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            className="min-h-96 font-mono"
            disabled={submitted}
          />
        </CardContent>
      </Card>

      {!submitted ? (
        <Button onClick={handleSubmit} size="lg" className="w-full mb-6" disabled={wordCount < 100}>
          <Send className="w-4 h-4 mr-2" />
          Submit for Evaluation
        </Button>
      ) : (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Evaluation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="text-5xl text-blue-600 mb-2">{evaluationResult.score}</div>
                <p className="text-gray-600">Band Score</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Task Response</h4>
                  <p className="text-sm text-gray-700">{evaluationResult.feedback.taskResponse}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Coherence and Cohesion</h4>
                  <p className="text-sm text-gray-700">{evaluationResult.feedback.coherenceCohesion}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Lexical Resource</h4>
                  <p className="text-sm text-gray-700">{evaluationResult.feedback.lexicalResource}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Grammatical Range and Accuracy</h4>
                  <p className="text-sm text-gray-700">{evaluationResult.feedback.grammaticalRange}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

        </div>

        <aside className="w-64 ml-8 sticky top-24 self-start hidden lg:block">
          <Timer initialMinutes={60} />
        </aside>

      </div>

      <Collapsible open={showSample} onOpenChange={setShowSample}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle>Sample Answer (Band 8.0)</CardTitle>
                {showSample ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="prose max-w-none">
                {writing.sampleAnswer.split('\n\n').map((paragraph, index) => (
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
