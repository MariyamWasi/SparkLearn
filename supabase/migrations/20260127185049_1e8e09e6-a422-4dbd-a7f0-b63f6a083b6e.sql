-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_questions table for topics users want to learn
CREATE TABLE public.user_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_plans table for generated outlines
CREATE TABLE public.learning_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modules table for plan sections
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_plan_id UUID NOT NULL REFERENCES public.learning_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  estimated_minutes INTEGER DEFAULT 5,
  order_index INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson_content table for AI-generated content
CREATE TABLE public.lesson_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_content ENABLE ROW LEVEL SECURITY;

-- Helper function to get plan owner from module
CREATE OR REPLACE FUNCTION public.get_plan_owner_from_module(module_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lp.user_id
  FROM public.learning_plans lp
  INNER JOIN public.modules m ON m.learning_plan_id = lp.id
  WHERE m.id = module_id
$$;

-- Helper function to get plan owner from lesson
CREATE OR REPLACE FUNCTION public.get_plan_owner_from_lesson(lesson_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lp.user_id
  FROM public.learning_plans lp
  INNER JOIN public.modules m ON m.learning_plan_id = lp.id
  INNER JOIN public.lessons l ON l.module_id = m.id
  WHERE l.id = lesson_id
$$;

-- Helper function to get plan owner from lesson content
CREATE OR REPLACE FUNCTION public.get_plan_owner_from_content(content_lesson_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lp.user_id
  FROM public.learning_plans lp
  INNER JOIN public.modules m ON m.learning_plan_id = lp.id
  INNER JOIN public.lessons l ON l.module_id = m.id
  WHERE l.id = content_lesson_id
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User questions policies
CREATE POLICY "Users can view own questions" ON public.user_questions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own questions" ON public.user_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions" ON public.user_questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own questions" ON public.user_questions
  FOR DELETE USING (auth.uid() = user_id);

-- Learning plans policies
CREATE POLICY "Users can view own plans" ON public.learning_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON public.learning_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.learning_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON public.learning_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Modules policies (check ownership via plan)
CREATE POLICY "Users can view own modules" ON public.modules
  FOR SELECT USING (public.get_plan_owner_from_module(id) = auth.uid());

CREATE POLICY "Users can insert modules to own plans" ON public.modules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.learning_plans 
      WHERE id = learning_plan_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own modules" ON public.modules
  FOR UPDATE USING (public.get_plan_owner_from_module(id) = auth.uid());

CREATE POLICY "Users can delete own modules" ON public.modules
  FOR DELETE USING (public.get_plan_owner_from_module(id) = auth.uid());

-- Lessons policies (check ownership via module -> plan)
CREATE POLICY "Users can view own lessons" ON public.lessons
  FOR SELECT USING (public.get_plan_owner_from_lesson(id) = auth.uid());

CREATE POLICY "Users can insert lessons to own modules" ON public.lessons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modules m
      INNER JOIN public.learning_plans lp ON lp.id = m.learning_plan_id
      WHERE m.id = module_id AND lp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own lessons" ON public.lessons
  FOR UPDATE USING (public.get_plan_owner_from_lesson(id) = auth.uid());

CREATE POLICY "Users can delete own lessons" ON public.lessons
  FOR DELETE USING (public.get_plan_owner_from_lesson(id) = auth.uid());

-- Lesson content policies (check ownership via lesson -> module -> plan)
CREATE POLICY "Users can view own content" ON public.lesson_content
  FOR SELECT USING (public.get_plan_owner_from_content(lesson_id) = auth.uid());

CREATE POLICY "Users can insert content to own lessons" ON public.lesson_content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lessons l
      INNER JOIN public.modules m ON m.id = l.module_id
      INNER JOIN public.learning_plans lp ON lp.id = m.learning_plan_id
      WHERE l.id = lesson_id AND lp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own content" ON public.lesson_content
  FOR UPDATE USING (public.get_plan_owner_from_content(lesson_id) = auth.uid());

CREATE POLICY "Users can delete own content" ON public.lesson_content
  FOR DELETE USING (public.get_plan_owner_from_content(lesson_id) = auth.uid());

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_plans_updated_at
  BEFORE UPDATE ON public.learning_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_content_updated_at
  BEFORE UPDATE ON public.lesson_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_user_questions_user_id ON public.user_questions(user_id);
CREATE INDEX idx_learning_plans_user_id ON public.learning_plans(user_id);
CREATE INDEX idx_modules_learning_plan_id ON public.modules(learning_plan_id);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lesson_content_lesson_id ON public.lesson_content(lesson_id);