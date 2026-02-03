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
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Minimal header showing progress */}
      <div className="border-b border-border px-8 py-6 flex items-center justify-between bg-card/50">
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">
            Step {currentStepNumber} of {totalSteps}
          </p>
          <h1 className="text-2xl font-semibold text-foreground leading-tight">{currentLesson.title}</h1>
        </div>
        
        {/* Back button - subtle, not competing with primary action */}
        {!isFirstLesson && (
          <button
            onClick={onPrevious}
            disabled={isLoading}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-accent"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-8 py-10 max-w-[720px] mx-auto">
          {isLoading && !content ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-muted-foreground mb-8">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-base">Generating lesson content...</span>
              </div>
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-full mt-4" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ) : (
            <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/90 prose-p:leading-[1.8] prose-p:mb-5 prose-p:text-base prose-li:text-foreground/90 prose-li:leading-[1.75] prose-li:text-base prose-ul:my-5 prose-ol:my-5 prose-strong:text-foreground prose-code:text-sm prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-2 h-6 bg-success animate-pulse ml-1 rounded-sm" />
              )}
            </article>
          )}
        </div>
      </ScrollArea>

      {/* Primary action footer - prominent CTA */}
      <div className="border-t border-border bg-card px-8 py-6 shadow-lg">
        <div className="max-w-[720px] mx-auto">
          {isLastLesson ? (
            <div className="flex items-center justify-center gap-3 py-3 px-6 bg-accent rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-base font-medium text-foreground">Course Complete!</span>
            </div>
          ) : (
            <Button
              onClick={onNext}
              disabled={isLoading}
              size="lg"
              className="w-full py-6 text-base font-medium shadow-md hover:shadow-lg transition-shadow"
            >
              Continue to Next Lesson
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
