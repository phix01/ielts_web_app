import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Volume2, BookMarked, RotateCcw } from 'lucide-react';
import { Badge } from '../ui/badge';

interface VocabularyWord {
  id: string;
  word: string;
  description: string;
  example: string;
  pronunciation: string;
  category: string;
}

// Mock vocabulary data
const vocabularyWords: VocabularyWord[] = [
  {
    id: '1',
    word: 'Abundant',
    description: 'Existing or available in large quantities; plentiful',
    example: 'The region is abundant in natural resources and mineral deposits.',
    pronunciation: 'ə-ˈbən-dənt',
    category: 'Academic'
  },
  {
    id: '2',
    word: 'Ambiguous',
    description: 'Open to more than one interpretation; not having one obvious meaning',
    example: 'The politician gave an ambiguous answer to avoid controversy.',
    pronunciation: 'am-ˈbi-gyə-wəs',
    category: 'Academic'
  },
  {
    id: '3',
    word: 'Comprehensive',
    description: 'Complete and including everything that is necessary',
    example: 'The report provides a comprehensive overview of the current situation.',
    pronunciation: 'ˌkäm-pri-ˈhen-siv',
    category: 'Academic'
  },
  {
    id: '4',
    word: 'Deteriorate',
    description: 'Become progressively worse',
    example: 'The building has deteriorated significantly over the past decade.',
    pronunciation: 'di-ˈtir-ē-ə-ˌrāt',
    category: 'Academic'
  },
  {
    id: '5',
    word: 'Eloquent',
    description: 'Fluent or persuasive in speaking or writing',
    example: 'She delivered an eloquent speech that moved the entire audience.',
    pronunciation: 'ˈe-lə-kwənt',
    category: 'Advanced'
  },
  {
    id: '6',
    word: 'Feasible',
    description: 'Possible to do easily or conveniently',
    example: 'The proposed project is economically feasible and environmentally sustainable.',
    pronunciation: 'ˈfē-zə-bəl',
    category: 'Academic'
  },
  {
    id: '7',
    word: 'Implement',
    description: 'Put a decision or plan into effect',
    example: 'The government plans to implement new education policies next year.',
    pronunciation: 'ˈim-plə-mənt',
    category: 'Academic'
  },
  {
    id: '8',
    word: 'Prosperity',
    description: 'The state of being prosperous; success or wealth',
    example: 'The country experienced unprecedented prosperity during the economic boom.',
    pronunciation: 'prä-ˈsper-ə-tē',
    category: 'Advanced'
  },
];

export default function VocabularyScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = vocabularyWords[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % vocabularyWords.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + vocabularyWords.length) % vocabularyWords.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const playPronunciation = () => {
    // In a real app, this would play actual audio
    // Using Web Speech API for text-to-speech as a demo
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl text-gray-900 mb-2">Vocabulary Builder</h1>
            <p className="text-gray-600">Master essential IELTS vocabulary with interactive flashcards</p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            <BookMarked className="w-4 h-4 mr-2" />
            {currentWord.category}
          </Badge>
          <span className="text-sm text-gray-500">
            Card {currentIndex + 1} of {vocabularyWords.length}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div 
          className="relative h-96 cursor-pointer perspective-1000"
          onClick={handleFlip}
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front of card */}
            <Card className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : 'visible'} border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50`}>
              <CardContent className="h-full flex flex-col items-center justify-center p-8">
                <div className="text-center">
                  <h2 className="text-5xl text-gray-900 mb-6">{currentWord.word}</h2>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPronunciation();
                    }}
                    className="mb-4"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    /{currentWord.pronunciation}/
                  </Button>
                  <p className="text-gray-500 mt-8">Click to see definition</p>
                </div>
              </CardContent>
            </Card>

            {/* Back of card */}
            <Card className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'visible' : 'invisible'} border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50`}>
              <CardContent className="h-full flex flex-col justify-center p-8">
                <div>
                  <h3 className="text-3xl text-gray-900 mb-6">{currentWord.word}</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-500 mb-2">DEFINITION</h4>
                    <p className="text-lg text-gray-800">{currentWord.description}</p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                    <h4 className="text-sm text-gray-500 mb-2">EXAMPLE</h4>
                    <p className="text-gray-800 italic">"{currentWord.example}"</p>
                  </div>

                  <p className="text-gray-500 mt-8 text-center">Click to flip back</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {vocabularyWords.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsFlipped(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={currentIndex === vocabularyWords.length - 1}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Progress Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Words Studied</span>
                <span className="text-gray-900">{currentIndex + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cards Reviewed</span>
                <span className="text-gray-900">15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${((currentIndex + 1) / vocabularyWords.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Review cards daily for better retention</li>
              <li>• Practice pronunciation out loud</li>
              <li>• Create your own example sentences</li>
              <li>• Use new words in writing exercises</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
