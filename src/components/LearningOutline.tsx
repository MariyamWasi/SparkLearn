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
  // Flatten lessons for linear navigation
  const allLessons: { moduleIndex: number; lessonIndex: number; lesson: typeof outline.modules[0]['lessons'][0]; module: typeof outline.modules[0] }[] = [];
  outline.modules.forEach((module, moduleIndex) => {
    module.lessons.forEach((lesson, lessonIndex) => {
      allLessons.push({ moduleIndex, lessonIndex, lesson, module });
    });
  });

  const currentFlatIndex = allLessons.findIndex(
    l => l.moduleIndex === currentModuleIndex && l.lessonIndex === currentLessonIndex
  );

  return (
    <div className="w-72 border-r border-border bg-sidebar flex flex-col h-screen">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <button 
          onClick={onReset}
          className="mb-3 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Exit
        </button>
        <h2 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">{outline.title}</h2>
        
        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">{completedLessons.size}/{allLessons.length}</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Step list - linear, not nested */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {allLessons.map((item, flatIndex) => {
            const isActive = flatIndex === currentFlatIndex;
            const isCompleted = completedLessons.has(item.lesson.id);
            const isUpcoming = flatIndex > currentFlatIndex && !isCompleted;
            const showModuleHeader = flatIndex === 0 || allLessons[flatIndex - 1].moduleIndex !== item.moduleIndex;

            return (
              <div key={item.lesson.id}>
                {/* Module header - subtle */}
                {showModuleHeader && (
                  <div className="px-3 pt-4 pb-2 first:pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      {item.module.title}
                    </span>
                  </div>
                )}
                
                {/* Step item */}
                <button
                  onClick={() => onLessonSelect(item.moduleIndex, item.lessonIndex)}
                  disabled={isUpcoming && !isCompleted}
                  className={cn(
                    "w-full text-left py-2.5 px-3 rounded-lg transition-all duration-150 flex items-center gap-3 mb-0.5",
                    isActive && "bg-primary text-primary-foreground shadow-sm",
                    isCompleted && !isActive && "hover:bg-accent/50",
                    isUpcoming && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Step indicator */}
                  {isCompleted ? (
                    <CheckCircle2 className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive ? "text-primary-foreground" : "text-success"
                    )} />
                  ) : isActive ? (
                    <div className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-primary-foreground flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 flex-shrink-0 text-muted-foreground/40" />
                  )}
                  
                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "text-sm block truncate",
                      isActive && "font-medium",
                      !isActive && !isCompleted && "text-muted-foreground",
                      isCompleted && !isActive && "text-foreground"
                    )}>
                      {item.lesson.title}
                    </span>
                  </div>

                  {/* Current indicator */}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 flex-shrink-0 text-primary-foreground/70" />
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
