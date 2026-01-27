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
      <div className="p-5 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Topic
        </Button>
        <h2 className="font-semibold text-lg leading-tight text-foreground">{outline.title}</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{outline.description}</p>
        <div className="mt-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion 
          type="multiple" 
          defaultValue={outline.modules.map(m => m.id)}
          className="p-3"
        >
          {outline.modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id} className="border-none">
              <AccordionTrigger className="py-2.5 px-3 hover:no-underline hover:bg-accent rounded-lg transition-colors duration-150">
                <div className="flex items-start gap-3 text-left">
                  <span className="text-xs font-medium text-muted-foreground mt-0.5 min-w-[1rem]">
                    {moduleIndex + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{module.title}</span>
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
                          "w-full text-left p-2.5 rounded-lg transition-colors duration-150 flex items-start gap-2.5 group",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            isActive ? "text-primary-foreground" : "text-success"
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
                            "text-xs flex items-center gap-1 mt-0.5",
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
