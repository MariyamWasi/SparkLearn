import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  // Early return if no modules/lessons
  if (!outline.modules || outline.modules.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No lessons available. Generate a new learning path.</p>
      </div>
    );
  }

  const currentModule = outline.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons?.[currentLessonIndex];

  if (!currentModule || !currentLesson) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a lesson to begin</p>
      </div>
    );
  }

  const isFirstLesson = currentModuleIndex === 0 && currentLessonIndex === 0;
  const isLastLesson = 
    currentModuleIndex === outline.modules.length - 1 && 
    currentLessonIndex === currentModule.lessons.length - 1;

  // Calculate total step number
  let totalSteps = 0;
  let currentStepNumber = 0;
  outline.modules.forEach((mod, mIdx) => {
    if (mod.lessons) {
      mod.lessons.forEach((_, lIdx) => {
        totalSteps++;
        if (mIdx < currentModuleIndex || (mIdx === currentModuleIndex && lIdx <= currentLessonIndex)) {
          currentStepNumber = totalSteps;
        }
      });
    }
  });

  // Get next lesson title
  let nextLessonTitle = '';
  if (!isLastLesson && currentModule.lessons) {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      nextLessonTitle = currentModule.lessons[currentLessonIndex + 1].title;
    } else if (currentModuleIndex < outline.modules.length - 1) {
      const nextModule = outline.modules[currentModuleIndex + 1];
      if (nextModule.lessons && nextModule.lessons.length > 0) {
        nextLessonTitle = nextModule.lessons[0].title;
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Minimal header showing progress */}
      <div className="border-b border-border px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            Step {currentStepNumber} of {totalSteps}
          </p>
          <h1 className="text-xl font-semibold text-foreground leading-tight">{currentLesson.title}</h1>
        </div>
        
        {/* Back button - subtle, not competing with primary action */}
        {!isFirstLesson && (
          <button
            onClick={onPrevious}
            disabled={isLoading}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-8 py-10">
        <div className="max-w-[680px] mx-auto">
          {isLoading && !content ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-8">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Loading...</span>
              </div>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/85 prose-p:leading-[1.75] prose-p:mb-5 prose-li:text-foreground/85 prose-li:leading-[1.7] prose-ul:my-4 prose-ol:my-4 prose-strong:text-foreground prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-1.5 h-5 bg-success animate-pulse ml-0.5 rounded-sm" />
              )}
            </article>
          )}
        </div>
      </ScrollArea>

      {/* Primary action footer - single CTA */}
      <div className="border-t border-border bg-card px-8 py-5">
        <div className="max-w-[680px] mx-auto">
          {isLastLesson ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Complete</span>
            </div>
          ) : (
            <Button
              onClick={onNext}
              disabled={isLoading}
              size="lg"
              className="w-full max-w-xs mx-auto flex"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
