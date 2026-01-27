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
      <div className="text-center mb-10 max-w-lg">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent mb-8">
          <BookOpen className="w-7 h-7 text-accent-foreground" />
        </div>
        <h1 className="text-[30px] font-semibold tracking-tight text-foreground mb-4 leading-tight">
          Learn Anything
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
          Enter a topic and get a personalized learning plan with AI-generated content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="What do you want to learn today?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-12 text-base bg-card border-border focus:ring-ring"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="lg" 
            disabled={!topic.trim() || isLoading}
            className="h-12 px-6 rounded-lg"
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
          <span className="text-sm text-muted-foreground">Try:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setTopic(suggestion)}
              className="text-sm px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
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
