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
    <div className="w-80 border-r border-border bg-card flex flex-col h-screen shadow-soft">
      <div className="p-card-padding border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="mb-3 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Topic
        </Button>
        <h2 className="font-semibold text-section-heading text-foreground leading-tight">{outline.title}</h2>
        <p className="text-small text-muted-foreground mt-2">{outline.description}</p>
        <div className="mt-5">
          <div className="flex justify-between text-small mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion 
          type="multiple" 
          defaultValue={outline.modules.map(m => m.id)}
          className="p-3"
        >
          {outline.modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id} className="border-none mb-1">
              <AccordionTrigger className="py-2.5 px-3 hover:no-underline hover:bg-muted rounded-lg transition-colors duration-150">
                <div className="flex items-start gap-2.5 text-left">
                  <span className="text-small font-semibold text-primary mt-0.5 min-w-[1.25rem]">
                    {moduleIndex + 1}
                  </span>
                  <span className="text-small font-medium text-foreground">{module.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-1 ml-5">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isActive = moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                    const isCompleted = completedLessons.has(lesson.id);
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(moduleIndex, lessonIndex)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-lg transition-all duration-150 flex items-start gap-2.5 group",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-soft" 
                            : "hover:bg-muted"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            isActive ? "text-primary-foreground" : "text-secondary"
                          )} />
                        ) : (
                          <Circle className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-small truncate",
                            isActive ? "font-medium" : "text-foreground"
                          )}>{lesson.title}</p>
                          <p className={cn(
                            "text-[13px] flex items-center gap-1 mt-0.5",
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}>
                            <Clock className="w-3 h-3" />
                            {lesson.estimatedMinutes} min
                          </p>
                        </div>
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
