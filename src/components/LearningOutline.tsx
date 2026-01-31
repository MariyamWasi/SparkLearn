import { LearningOutline as OutlineType } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { CheckCircle2, Circle, Clock, ArrowLeft } from 'lucide-react';
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
  return (
    <div className="w-80 border-r border-border bg-sidebar flex flex-col h-screen">
      {/* Sidebar header */}
      <div className="p-6 border-b border-border">
        <button 
          onClick={onReset}
          className="mb-5 -ml-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          New topic
        </button>
        <h2 className="font-semibold text-base leading-snug text-foreground">{outline.title}</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{outline.description}</p>
        
        {/* Progress indicator - subtle */}
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Module list */}
      <ScrollArea className="flex-1">
        <Accordion 
          type="multiple" 
          defaultValue={outline.modules.map(m => m.id)}
          className="p-4"
        >
          {outline.modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id} className="border-none">
              <AccordionTrigger className="py-3 px-3 hover:no-underline hover:bg-accent/50 rounded-lg transition-colors duration-150">
                <div className="flex items-start gap-3 text-left">
                  <span className="text-xs text-muted-foreground mt-0.5 min-w-[1rem] tabular-nums">
                    {moduleIndex + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground leading-snug">{module.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="space-y-0.5 ml-6">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isActive = moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                    const isCompleted = completedLessons.has(lesson.id);
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(moduleIndex, lessonIndex)}
                        className={cn(
                          "w-full text-left py-2 px-3 rounded-lg transition-colors duration-150 flex items-center gap-3",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent/50"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className={cn(
                            "w-3.5 h-3.5 flex-shrink-0",
                            isActive ? "text-primary-foreground" : "text-success"
                          )} />
                        ) : (
                          <Circle className={cn(
                            "w-3.5 h-3.5 flex-shrink-0",
                            isActive ? "text-primary-foreground/70" : "text-muted-foreground/50"
                          )} />
                        )}
                        <span className={cn(
                          "text-sm flex-1 truncate",
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        )}>
                          {lesson.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
