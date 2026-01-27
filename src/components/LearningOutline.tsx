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
    <div className="w-80 border-r bg-muted/30 flex flex-col h-screen">
      <div className="p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="mb-3 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Topic
        </Button>
        <h2 className="font-semibold text-lg leading-tight">{outline.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{outline.description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion 
          type="multiple" 
          defaultValue={outline.modules.map(m => m.id)}
          className="p-2"
        >
          {outline.modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id} className="border-none">
              <AccordionTrigger className="py-2 px-2 hover:no-underline hover:bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2 text-left">
                  <span className="text-xs font-medium text-muted-foreground mt-0.5">
                    {moduleIndex + 1}
                  </span>
                  <span className="text-sm font-medium">{module.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-1 ml-4">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isActive = moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                    const isCompleted = completedLessons.has(lesson.id);
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(moduleIndex, lessonIndex)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2 group",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted/50"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            isActive ? "text-primary-foreground" : "text-primary"
                          )} />
                        ) : (
                          <Circle className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{lesson.title}</p>
                          <p className={cn(
                            "text-xs flex items-center gap-1",
                            isActive ? "text-primary-foreground/70" : "text-muted-foreground"
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
