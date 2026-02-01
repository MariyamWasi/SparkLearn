import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, BookOpen, Clock, Trash2, ChevronRight } from 'lucide-react';
import { SavedPlan } from '@/hooks/useSavedPlans';
import { formatDistanceToNow } from 'date-fns';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  onLoadPlan: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  savedPlans: SavedPlan[];
  isLoadingPlans: boolean;
  isLoading: boolean;
}

export function TopicInput({ 
  onSubmit, 
  onLoadPlan, 
  onDeletePlan,
  savedPlans, 
  isLoadingPlans,
  isLoading 
}: TopicInputProps) {
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
        <h1 className="text-[30px] font-semibold tracking-tight text-foreground mb-3 leading-tight">
          What would you like to learn?
        </h1>
        <p className="text-muted-foreground text-sm">
          We'll create a personalized path just for you.
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
              'Go'
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

      {/* Saved Plans Section */}
      {!isLoadingPlans && savedPlans.length > 0 && (
        <div className="w-full max-w-xl mt-12">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
            Continue where you left off
          </h2>
          <div className="space-y-2">
            {savedPlans.slice(0, 5).map((plan) => (
              <div
                key={plan.id}
                className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors duration-150"
              >
                <button
                  onClick={() => onLoadPlan(plan.id)}
                  className="flex-1 flex items-center gap-4 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{plan.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(plan.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePlan(plan.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
