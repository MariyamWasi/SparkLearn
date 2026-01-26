import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LearningOutline, Module, Lesson } from '@/types/learning';

interface LessonContentProps {
  outline: LearningOutline;
  currentModuleIndex: number;
  currentLessonIndex: number;
  content: string;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function LessonContent({
  outline,
  currentModuleIndex,
  currentLessonIndex,
  content,
  isLoading,
  onPrevious,
  onNext,
}: LessonContentProps) {
  const currentModule = outline.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const isFirstLesson = currentModuleIndex === 0 && currentLessonIndex === 0;
  const isLastLesson = 
    currentModuleIndex === outline.modules.length - 1 && 
    currentLessonIndex === currentModule?.lessons.length - 1;

  if (!currentModule || !currentLesson) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a lesson to begin</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      <div className="border-b border-border p-card-padding">
        <p className="text-small text-muted-foreground mb-1.5">
          Module {currentModuleIndex + 1}: {currentModule.title}
        </p>
        <h1 className="text-section-heading font-semibold text-foreground">{currentLesson.title}</h1>
      </div>

      <ScrollArea className="flex-1 p-card-padding">
        <div className="max-w-content mx-auto">
          {isLoading && !content ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-secondary mb-6">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-small font-medium">Generating lesson content...</span>
              </div>
              <Skeleton className="h-6 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-5/6 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-6 w-2/3 mt-6 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-4/5 bg-muted" />
            </div>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-li:text-foreground prose-strong:text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-2 h-5 bg-secondary animate-pulse ml-1 rounded-sm" />
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-card-padding flex justify-between items-center bg-card">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstLesson || isLoading}
          className="rounded-[10px] border-border hover:bg-muted transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-small text-muted-foreground">
          Lesson {currentLessonIndex + 1} of {currentModule.lessons.length}
        </div>

        <Button
          onClick={onNext}
          disabled={isLastLesson || isLoading}
          className="rounded-[10px] bg-primary hover:bg-primary/90 transition-colors duration-150"
        >
          {isLastLesson ? 'Complete' : 'Next'}
          {!isLastLesson && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
