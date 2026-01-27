import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, BookOpen } from 'lucide-react';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export function TopicInput({ onSubmit, isLoading }: TopicInputProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const suggestions = [
    'JavaScript Fundamentals',
    'Machine Learning Basics',
    'Digital Marketing',
    'Photography Composition',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Learn Anything
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Enter a topic and get a personalized learning plan with AI-generated content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="What do you want to learn today?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-12 text-lg"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="lg" 
            disabled={!topic.trim() || isLoading}
            className="h-12 px-6"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Start Learning
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-muted-foreground">Try:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setTopic(suggestion)}
              className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
