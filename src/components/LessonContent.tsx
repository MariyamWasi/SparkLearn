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
      {/* Lesson header with clear hierarchy */}
      <div className="border-b border-border px-8 py-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Module {currentModuleIndex + 1} · {currentModule.title}
        </p>
        <h1 className="text-2xl font-semibold text-foreground leading-tight">{currentLesson.title}</h1>
      </div>

      {/* Content area with generous padding */}
      <ScrollArea className="flex-1 px-8 py-10">
        <div className="max-w-[720px] mx-auto">
          {isLoading && !content ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-success mb-10">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Generating content...</span>
              </div>
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="h-6" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/90 prose-p:leading-[1.7] prose-p:mb-5 prose-li:text-foreground/90 prose-li:leading-[1.65] prose-ul:my-4 prose-ol:my-4 prose-strong:text-foreground prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
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

      {/* Navigation footer - minimal, functional */}
      <div className="border-t border-border px-8 py-5 flex justify-between items-center bg-card">
        <button
          onClick={onPrevious}
          disabled={isFirstLesson || isLoading}
          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-xs text-muted-foreground">
          {currentLessonIndex + 1} / {currentModule.lessons.length}
        </span>

        <Button
          onClick={onNext}
          disabled={isLastLesson || isLoading}
          size="sm"
          className="px-5"
        >
          {isLastLesson ? 'Complete' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
