import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

interface BlogDetailScreenProps {
  itemId: string | null;
  onBack: () => void;
}

export default function BlogDetailScreen({ onBack }: BlogDetailScreenProps) {
  const blog = {
    title: '10 Tips for IELTS Success',
    author: 'Sarah Johnson',
    date: 'December 20, 2024',
    readTime: '5 min read',
    tags: ['Tips', 'General', 'Study Guide'],
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    content: `Preparing for the IELTS exam can be challenging, but with the right strategies and dedication, you can achieve your target band score. Here are ten essential tips to help you succeed.

## 1. Understand the Test Format

Before you start preparing, make sure you thoroughly understand the structure of the IELTS test. Familiarize yourself with the four sections: Listening, Reading, Writing, and Speaking. Know how many questions are in each section and how much time you have.

## 2. Practice Regularly

Consistency is key when preparing for IELTS. Set aside dedicated time each day to practice different skills. Even 30 minutes of focused practice daily is more effective than occasional long study sessions.

## 3. Expand Your Vocabulary

A strong vocabulary is essential for all sections of the IELTS test. Learn new words in context and practice using them in sentences. Focus on academic vocabulary and topic-specific words commonly used in IELTS.

## 4. Improve Your Time Management

Time management is crucial during the IELTS test. Practice completing tasks within the allocated time limits. This will help you pace yourself during the actual exam and ensure you complete all questions.

## 5. Take Mock Tests

Regular mock tests help you familiarize yourself with the test conditions and identify areas that need improvement. Analyze your performance after each mock test and work on your weak points.

## 6. Focus on All Four Skills

Don't neglect any of the four skills. Even if you're stronger in some areas, make sure to practice all sections equally. Your overall band score depends on your performance in all four components.

## 7. Listen to English Daily

Immerse yourself in English by listening to podcasts, watching English movies or TV shows, and listening to English music. This will help improve your listening skills and familiarize you with different accents.

## 8. Read Widely

Read a variety of materials including newspapers, academic journals, and novels. This will improve your reading speed, comprehension, and vocabulary. Pay attention to how arguments are structured and ideas are presented.

## 9. Practice Writing Under Pressure

The Writing section can be particularly challenging due to time constraints. Practice writing essays and reports within the time limit. Get feedback on your writing to identify areas for improvement.

## 10. Stay Calm and Confident

Test anxiety can negatively impact your performance. Practice relaxation techniques and maintain a positive attitude. Remember that adequate preparation is the best way to build confidence.

## Conclusion

Success in IELTS requires dedication, consistent practice, and the right strategies. Implement these tips in your study routine, and you'll be well on your way to achieving your target band score. Good luck!`
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Button>

      <article>
        <div className="mb-6">
          <img 
            src={blog.imageUrl} 
            alt={blog.title}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-3xl text-gray-900 mb-4">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {blog.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {blog.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {blog.readTime}
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              {blog.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl text-gray-900 mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                return (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
