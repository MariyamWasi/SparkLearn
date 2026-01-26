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
    <div className="flex-1 flex flex-col h-screen">
      <div className="border-b p-4">
        <p className="text-sm text-muted-foreground mb-1">
          Module {currentModuleIndex + 1}: {currentModule.title}
        </p>
        <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {isLoading && !content ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary mb-6">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm">Generating lesson content...</span>
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-2/3 mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1" />
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstLesson || isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Lesson {currentLessonIndex + 1} of {currentModule.lessons.length}
        </div>

        <Button
          onClick={onNext}
          disabled={isLastLesson || isLoading}
        >
          {isLastLesson ? 'Complete' : 'Next'}
          {!isLastLesson && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
