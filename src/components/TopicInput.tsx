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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-page-title text-foreground tracking-tight mb-3">
          Learn Anything
        </h1>
        <p className="text-muted-foreground text-body max-w-md">
          Enter a topic and get a personalized learning plan with AI-generated content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-content space-y-5">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="What do you want to learn today?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-12 text-body rounded-[10px] border-border focus:ring-2 focus:ring-primary/20 transition-all duration-150"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="lg" 
            disabled={!topic.trim() || isLoading}
            className="h-12 px-6 rounded-[10px] bg-primary hover:bg-primary/90 transition-colors duration-150"
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

        <div className="flex flex-wrap gap-2 justify-center pt-2">
          <span className="text-small text-muted-foreground">Try:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setTopic(suggestion)}
              className="text-small px-4 py-1.5 rounded-full bg-muted hover:bg-accent text-foreground transition-colors duration-150"
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
