import { LearningOutline as OutlineType } from '@/types/learning';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Circle, ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningOutlineProps {
  outline: OutlineType;
  currentModuleIndex: number;
  currentLessonIndex: number;
  completedLessons: Set<string>;
  progress: number;
  onLessonSelect: (moduleIndex: number, lessonIndex: number) => void;
  onReset: () => void;
}

export function LearningOutline({
  outline,
  currentModuleIndex,
  currentLessonIndex,
  completedLessons,
  progress,
  onLessonSelect,
  onReset,
}: LearningOutlineProps) {
  // Flatten lessons for linear navigation - with safety checks
  const allLessons: { moduleIndex: number; lessonIndex: number; lesson: typeof outline.modules[0]['lessons'][0]; module: typeof outline.modules[0] }[] = [];
  
  if (outline.modules && outline.modules.length > 0) {
    outline.modules.forEach((module, moduleIndex) => {
      if (module.lessons && module.lessons.length > 0) {
        module.lessons.forEach((lesson, lessonIndex) => {
          allLessons.push({ moduleIndex, lessonIndex, lesson, module });
        });
      }
    });
  }

  const currentFlatIndex = allLessons.findIndex(
    l => l.moduleIndex === currentModuleIndex && l.lessonIndex === currentLessonIndex
  );

  // Show empty state if no lessons
  if (allLessons.length === 0) {
    return (
      <div className="w-80 min-w-80 border-r border-border bg-sidebar flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <button 
            onClick={onReset}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </button>
          <h2 className="font-semibold text-base leading-snug text-foreground">{outline.title}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-base text-muted-foreground text-center">No lessons available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 min-w-80 border-r border-border bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <button 
          onClick={onReset}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit
        </button>
        <h2 className="font-semibold text-base leading-snug text-foreground">{outline.title}</h2>
        
        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{completedLessons.size} of {allLessons.length} completed</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Step list - linear, not nested */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {allLessons.map((item, flatIndex) => {
            const isActive = flatIndex === currentFlatIndex;
            const isCompleted = completedLessons.has(item.lesson.id);
            const isUpcoming = flatIndex > currentFlatIndex && !isCompleted;
            const showModuleHeader = flatIndex === 0 || allLessons[flatIndex - 1].moduleIndex !== item.moduleIndex;

            return (
              <div key={item.lesson.id}>
                {/* Module header - subtle */}
                {showModuleHeader && (
                  <div className="px-3 pt-5 pb-3 first:pt-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {item.module.title}
                    </span>
                  </div>
                )}
                
                {/* Step item */}
                <button
                  onClick={() => onLessonSelect(item.moduleIndex, item.lessonIndex)}
                  disabled={isUpcoming && !isCompleted}
                  className={cn(
                    "w-full text-left py-3 px-4 rounded-xl transition-all duration-150 flex items-start gap-3 mb-1",
                    isActive && "bg-primary text-primary-foreground shadow-md",
                    isCompleted && !isActive && "hover:bg-accent/60 bg-accent/30",
                    isUpcoming && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {/* Step indicator */}
                  {isCompleted ? (
                    <CheckCircle2 className={cn(
                      "w-5 h-5 flex-shrink-0 mt-0.5",
                      isActive ? "text-primary-foreground" : "text-success"
                    )} />
                  ) : isActive ? (
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5 rounded-full border-2 border-primary-foreground flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground/50" />
                  )}
                  
                  {/* Step content - allow text wrap */}
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "text-sm leading-relaxed block",
                      isActive && "font-medium",
                      !isActive && !isCompleted && "text-muted-foreground",
                      isCompleted && !isActive && "text-foreground"
                    )}>
                      {item.lesson.title}
                    </span>
                  </div>

                  {/* Current indicator */}
                  {isActive && (
                    <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-foreground/80" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
