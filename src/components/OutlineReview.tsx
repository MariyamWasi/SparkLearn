import { LearningOutline } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Check, RotateCcw, Clock } from 'lucide-react';

interface OutlineReviewProps {
  outline: LearningOutline;
  topic: string;
  onApprove: () => void;
  onReset: () => void;
}

export function OutlineReview({ outline, topic, onApprove, onReset }: OutlineReviewProps) {
  const totalLessons = outline.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalMinutes = outline.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + l.estimatedMinutes, 0),
    0
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-2">Learning Path for</p>
            <h1 className="text-2xl font-semibold text-foreground mb-2">{outline.title}</h1>
            <p className="text-muted-foreground">{outline.description}</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>{totalLessons} lessons</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                ~{totalMinutes} min total
              </span>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="space-y-4">
              {outline.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
                        {moduleIndex + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">{module.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                        <div className="mt-3 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                                {lessonIndex + 1}
                              </span>
                              <span className="flex-1">{lesson.title}</span>
                              <span className="text-xs">{lesson.estimatedMinutes} min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="border-t border-border bg-background px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
          <Button
            onClick={onApprove}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Approve & Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
