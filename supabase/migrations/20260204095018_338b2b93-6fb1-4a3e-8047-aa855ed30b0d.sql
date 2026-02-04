-- The old policies were already dropped and recreated in the previous migration
-- Let's also fix the lesson_content INSERT policy using the helper function

DROP POLICY IF EXISTS "Users can insert content to own lessons" ON public.lesson_content;

-- Create helper function to check if user owns lesson's plan
CREATE OR REPLACE FUNCTION public.user_owns_lesson_plan(les_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN learning_plans lp ON lp.id = m.learning_plan_id
    WHERE l.id = les_id AND lp.user_id = auth.uid()
  );
$$;

CREATE POLICY "Users can insert content to own lessons"
  ON public.lesson_content
  FOR INSERT
  WITH CHECK (public.user_owns_lesson_plan(lesson_id));