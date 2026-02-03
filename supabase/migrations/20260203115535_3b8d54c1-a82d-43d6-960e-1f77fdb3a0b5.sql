-- Drop existing INSERT policies that use EXISTS subqueries
DROP POLICY IF EXISTS "Users can insert modules to own plans" ON public.modules;
DROP POLICY IF EXISTS "Users can insert lessons to own modules" ON public.lessons;

-- Create helper function to check if user owns learning plan
CREATE OR REPLACE FUNCTION public.user_owns_learning_plan(plan_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM learning_plans 
    WHERE id = plan_id AND user_id = auth.uid()
  );
$$;

-- Create helper function to check if user owns module's plan
CREATE OR REPLACE FUNCTION public.user_owns_module_plan(mod_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM modules m
    JOIN learning_plans lp ON lp.id = m.learning_plan_id
    WHERE m.id = mod_id AND lp.user_id = auth.uid()
  );
$$;

-- Create new INSERT policies using the helper functions
CREATE POLICY "Users can insert modules to own plans"
  ON public.modules
  FOR INSERT
  WITH CHECK (public.user_owns_learning_plan(learning_plan_id));

CREATE POLICY "Users can insert lessons to own modules"
  ON public.lessons
  FOR INSERT  
  WITH CHECK (public.user_owns_module_plan(module_id));