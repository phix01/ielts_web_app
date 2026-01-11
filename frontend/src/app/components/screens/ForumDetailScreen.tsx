import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, User, Clock, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ForumDetailScreenProps {
  itemId: string | null;
  user: {
    firstName: string;
    isPremium: boolean;
  };
  onBack: () => void;
}

interface Message {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
  likes: number;
}

export default function ForumDetailScreen({ user, onBack }: ForumDetailScreenProps) {
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'Alex Thompson',
      timeAgo: '2 hours ago',
      content: `I've been stuck at band 6.5 for writing task 2 for the past few months. I practice regularly and get feedback, but I can't seem to improve my score. My main issues are with coherence and cohesion, and sometimes task response.

Has anyone else experienced this? What strategies helped you break through to band 7 or higher? I'd really appreciate any advice or resources you can recommend.`,
      likes: 8
    },
    {
      id: '2',
      author: 'Maria Garcia',
      timeAgo: '1 hour ago',
      content: `I had the same problem! What really helped me was focusing on paragraph structure. Make sure each paragraph has:
1. A clear topic sentence
2. Supporting points with examples
3. A concluding sentence that links to the next paragraph

Also, use a variety of linking words, but don't overuse them. Quality over quantity!`,
      likes: 12
    },
    {
      id: '3',
      author: 'John Kumar',
      timeAgo: '45 minutes ago',
      content: `I recommend reading high-scoring sample essays and analyzing their structure. Pay attention to:
- How they introduce their position
- How they develop arguments
- How they conclude

Also, time yourself when practicing. You need to finish within 40 minutes, leaving time to proofread.`,
      likes: 5
    },
  ]);

  const forum = {
    title: 'How to improve writing task 2 band score from 6.5 to 7.5?',
    category: 'Writing',
    author: 'Alex Thompson',
    timeAgo: '2 hours ago',
  };

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: user.firstName,
        timeAgo: 'Just now',
        content: replyText,
        likes: 0
      };
      setMessages([...messages, newMessage]);
      setReplyText('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Forum
      </Button>

      <div className="mb-6">
        <Badge variant="outline" className="mb-3">{forum.category}</Badge>
        <h1 className="text-2xl text-gray-900 mb-3">{forum.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            {messages.length} replies
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    {message.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{message.author}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {message.timeAgo}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {message.likes}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {message.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                {user.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{user.firstName}</p>
              <p className="text-sm text-gray-500">Add your reply</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your thoughts, experiences, or advice..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mb-4 min-h-32"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitReply} disabled={!replyText.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post Reply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
