import { useLearning } from '@/hooks/useLearning';
import { TopicInput } from '@/components/TopicInput';
import { LearningOutline } from '@/components/LearningOutline';
import { LessonContent } from '@/components/LessonContent';
import { AuthenticatedNavbar } from '@/components/AuthenticatedNavbar';
import { Skeleton } from '@/components/ui/skeleton';

export function LearningPlatform() {
  const {
    state,
    isGeneratingOutline,
    isGeneratingContent,
    isLoadingPlans,
    currentContent,
    progress,
    savedPlans,
    generateOutline,
    generateLessonContent,
    loadSavedPlan,
    deletePlan,
    goToNextLesson,
    goToPreviousLesson,
    resetLearning,
  } = useLearning();

  // Show topic input when no outline exists
  if (!state.outline) {
    if (isGeneratingOutline) {
      return (
        <div className="min-h-screen bg-background">
          <AuthenticatedNavbar />
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6">
            <div className="text-center space-y-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent mb-4">
                <div className="w-6 h-6 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Creating your learning plan...</h2>
              <p className="text-muted-foreground text-base">AI is designing a personalized curriculum for you</p>
              <div className="max-w-sm mx-auto space-y-3 mt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNavbar />
        <TopicInput 
          onSubmit={generateOutline} 
          onLoadPlan={loadSavedPlan}
          onDeletePlan={deletePlan}
          savedPlans={savedPlans}
          isLoadingPlans={isLoadingPlans}
          isLoading={isGeneratingOutline} 
        />
      </div>
    );
  }

  // Show learning interface with outline and content
  return (
    <div className="flex flex-col h-screen">
      <AuthenticatedNavbar />
      <div className="flex flex-1 overflow-hidden">
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
    </div>
  );
}
