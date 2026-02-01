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
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Header - clean and minimal */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Your path</p>
            <h1 className="text-[32px] font-semibold text-foreground leading-tight mb-4">{outline.title}</h1>
            <p className="text-sm text-muted-foreground">
              {totalLessons} lessons · {totalMinutes} min total
            </p>
          </div>

          {/* Module list with increased spacing */}
          <ScrollArea className="h-[calc(100vh-420px)]">
            <div className="space-y-5">
              {outline.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="border-border shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
                        {moduleIndex + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-foreground">{module.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{module.description}</p>
                        <div className="mt-4 space-y-2.5">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                {lessonIndex + 1}
                              </span>
                              <span className="flex-1 text-muted-foreground">{lesson.title}</span>
                              <span className="text-xs text-muted-foreground/70">{lesson.estimatedMinutes} min</span>
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

      {/* Footer with single primary CTA */}
      <div className="border-t border-border bg-card px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onReset}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start over
          </button>
          <Button
            onClick={onApprove}
            size="lg"
            className="px-6"
          >
            Begin Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
