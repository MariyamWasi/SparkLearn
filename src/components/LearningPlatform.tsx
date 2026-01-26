import { useLearning } from '@/hooks/useLearning';
import { TopicInput } from '@/components/TopicInput';
import { LearningOutline } from '@/components/LearningOutline';
import { LessonContent } from '@/components/LessonContent';
import { Skeleton } from '@/components/ui/skeleton';

export function LearningPlatform() {
  const {
    state,
    isGeneratingOutline,
    isGeneratingContent,
    currentContent,
    progress,
    generateOutline,
    generateLessonContent,
    goToNextLesson,
    goToPreviousLesson,
    resetLearning,
  } = useLearning();

  // Show topic input when no outline exists
  if (!state.outline) {
    if (isGeneratingOutline) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-background">
          <div className="text-center space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-section-heading font-semibold text-foreground">Creating your learning plan...</h2>
            <p className="text-muted-foreground text-body">AI is designing a personalized curriculum for you</p>
            <div className="max-w-sm mx-auto space-y-3 mt-8">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-5/6 bg-muted" />
            </div>
          </div>
        </div>
      );
    }

    return <TopicInput onSubmit={generateOutline} isLoading={isGeneratingOutline} />;
  }

  // Show learning interface with outline and content
  return (
    <div className="flex h-screen">
      <LearningOutline
        outline={state.outline}
        currentModuleIndex={state.currentModuleIndex}
        currentLessonIndex={state.currentLessonIndex}
        completedLessons={state.completedLessons}
        progress={progress}
        onLessonSelect={generateLessonContent}
        onReset={resetLearning}
      />
      <LessonContent
        outline={state.outline}
        currentModuleIndex={state.currentModuleIndex}
        currentLessonIndex={state.currentLessonIndex}
        content={currentContent}
        isLoading={isGeneratingContent}
        onPrevious={goToPreviousLesson}
        onNext={goToNextLesson}
      />
    </div>
  );
}
