import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LearningOutline } from '@/types/learning';
import { useToast } from '@/hooks/use-toast';

export interface SavedPlan {
  id: string;
  topic: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useSavedPlans() {
  const { toast } = useToast();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('learning_plans')
        .select('id, topic, title, description, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSavedPlans(data || []);
    } catch (error) {
      console.error('Error fetching saved plans:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const savePlan = useCallback(async (topic: string, outline: LearningOutline): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to save plans',
          variant: 'destructive',
        });
        return null;
      }

      // Create the learning plan
      const { data: plan, error: planError } = await supabase
        .from('learning_plans')
        .insert({
          user_id: user.id,
          topic,
          title: outline.title,
          description: outline.description,
        })
        .select('id')
        .single();

      if (planError) throw planError;

      // Create modules
      for (let i = 0; i < outline.modules.length; i++) {
        const module = outline.modules[i];
        
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .insert({
            learning_plan_id: plan.id,
            title: module.title,
            description: module.description,
            order_index: i,
          })
          .select('id')
          .single();

        if (moduleError) throw moduleError;

        // Create lessons for this module
        const lessonsToInsert = module.lessons.map((lesson, j) => ({
          module_id: moduleData.id,
          title: lesson.title,
          estimated_minutes: lesson.estimatedMinutes,
          order_index: j,
          completed: false,
        }));

        const { error: lessonsError } = await supabase
          .from('lessons')
          .insert(lessonsToInsert);

        if (lessonsError) throw lessonsError;
      }

      // Refresh the plans list
      fetchPlans();

      return plan.id;
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to save learning plan',
        variant: 'destructive',
      });
      return null;
    }
  }, [fetchPlans, toast]);

  const loadPlan = useCallback(async (planId: string): Promise<{ topic: string; outline: LearningOutline } | null> => {
    try {
      // Fetch the plan with modules and lessons
      const { data: plan, error: planError } = await supabase
        .from('learning_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('learning_plan_id', planId)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch lessons for all modules
      const moduleIds = modules.map(m => m.id);
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Fetch lesson content
      const lessonIds = lessons.map(l => l.id);
      const { data: contents, error: contentsError } = await supabase
        .from('lesson_content')
        .select('*')
        .in('lesson_id', lessonIds);

      if (contentsError) throw contentsError;

      // Build the outline structure
      const outline: LearningOutline = {
        title: plan.title,
        description: plan.description || '',
        modules: modules.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description || '',
          lessons: lessons
            .filter(l => l.module_id === module.id)
            .map(lesson => {
              const content = contents?.find(c => c.lesson_id === lesson.id);
              return {
                id: lesson.id,
                title: lesson.title,
                estimatedMinutes: lesson.estimated_minutes || 10,
                completed: lesson.completed || false,
                content: content?.content,
              };
            }),
        })),
      };

      return { topic: plan.topic, outline };
    } catch (error) {
      console.error('Error loading plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to load learning plan',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const deletePlan = useCallback(async (planId: string) => {
    try {
      const { error } = await supabase
        .from('learning_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      setSavedPlans(prev => prev.filter(p => p.id !== planId));
      
      toast({
        title: 'Plan deleted',
        description: 'Your learning plan has been removed.',
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete learning plan',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    savedPlans,
    isLoading,
    savePlan,
    loadPlan,
    deletePlan,
    refreshPlans: fetchPlans,
  };
}
