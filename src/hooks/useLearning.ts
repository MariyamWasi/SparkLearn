import { useState, useCallback } from 'react';
import { LearningOutline, LearningState } from '@/types/learning';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useLearning() {
  const { toast } = useToast();
  const [state, setState] = useState<LearningState>({
    topic: '',
    outline: null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    completedLessons: new Set(),
  });
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>('');

  const generateOutline = useCallback(async (topic: string) => {
    setIsGeneratingOutline(true);
    setCurrentContent('');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-outline', {
        body: { topic },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setState(prev => ({
        ...prev,
        topic,
        outline: data.outline,
        currentModuleIndex: 0,
        currentLessonIndex: 0,
        completedLessons: new Set(),
      }));

      toast({
        title: "Learning plan created!",
        description: `Your personalized course on "${topic}" is ready.`,
      });
    } catch (error) {
      console.error('Error generating outline:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate learning plan",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingOutline(false);
    }
  }, [toast]);

  const generateLessonContent = useCallback(async (moduleIndex: number, lessonIndex: number) => {
    if (!state.outline) return;

    const module = state.outline.modules[moduleIndex];
    const lesson = module?.lessons[lessonIndex];
    
    if (!module || !lesson) return;

    // Check if content already exists
    if (lesson.content) {
      setCurrentContent(lesson.content);
      setState(prev => ({
        ...prev,
        currentModuleIndex: moduleIndex,
        currentLessonIndex: lessonIndex,
      }));
      return;
    }

    setIsGeneratingContent(true);
    setCurrentContent('');
    setState(prev => ({
      ...prev,
      currentModuleIndex: moduleIndex,
      currentLessonIndex: lessonIndex,
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            topic: state.topic,
            moduleTitle: module.title,
            lessonTitle: lesson.title,
            lessonId: lesson.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate lesson');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setCurrentContent(fullContent);
            }
          } catch {
            // Incomplete JSON, put it back
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Update the lesson with content
      setState(prev => {
        if (!prev.outline) return prev;
        const newOutline = { ...prev.outline };
        newOutline.modules = newOutline.modules.map((m, mi) => {
          if (mi !== moduleIndex) return m;
          return {
            ...m,
            lessons: m.lessons.map((l, li) => {
              if (li !== lessonIndex) return l;
              return { ...l, content: fullContent };
            }),
          };
        });
        return { ...prev, outline: newOutline };
      });

    } catch (error) {
      console.error('Error generating lesson:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate lesson content",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  }, [state.outline, state.topic, toast]);

  const markLessonComplete = useCallback((lessonId: string) => {
    setState(prev => {
      const newCompleted = new Set(prev.completedLessons);
      newCompleted.add(lessonId);
      return { ...prev, completedLessons: newCompleted };
    });
  }, []);

  const goToNextLesson = useCallback(() => {
    if (!state.outline) return;
    
    const currentModule = state.outline.modules[state.currentModuleIndex];
    if (!currentModule) return;

    // Mark current lesson as complete
    const currentLesson = currentModule.lessons[state.currentLessonIndex];
    if (currentLesson) {
      markLessonComplete(currentLesson.id);
    }

    // Check if there's a next lesson in current module
    if (state.currentLessonIndex < currentModule.lessons.length - 1) {
      generateLessonContent(state.currentModuleIndex, state.currentLessonIndex + 1);
    } 
    // Check if there's a next module
    else if (state.currentModuleIndex < state.outline.modules.length - 1) {
      generateLessonContent(state.currentModuleIndex + 1, 0);
    }
  }, [state, markLessonComplete, generateLessonContent]);

  const goToPreviousLesson = useCallback(() => {
    if (!state.outline) return;

    if (state.currentLessonIndex > 0) {
      generateLessonContent(state.currentModuleIndex, state.currentLessonIndex - 1);
    } else if (state.currentModuleIndex > 0) {
      const prevModule = state.outline.modules[state.currentModuleIndex - 1];
      generateLessonContent(state.currentModuleIndex - 1, prevModule.lessons.length - 1);
    }
  }, [state, generateLessonContent]);

  const resetLearning = useCallback(() => {
    setState({
      topic: '',
      outline: null,
      currentModuleIndex: 0,
      currentLessonIndex: 0,
      completedLessons: new Set(),
    });
    setCurrentContent('');
  }, []);

  const progress = state.outline 
    ? (state.completedLessons.size / state.outline.modules.reduce((acc, m) => acc + m.lessons.length, 0)) * 100
    : 0;

  return {
    state,
    isGeneratingOutline,
    isGeneratingContent,
    currentContent,
    progress,
    generateOutline,
    generateLessonContent,
    markLessonComplete,
    goToNextLesson,
    goToPreviousLesson,
    resetLearning,
  };
}
