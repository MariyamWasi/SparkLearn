export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  content?: string;
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface LearningOutline {
  title: string;
  description: string;
  modules: Module[];
}

export interface LearningState {
  topic: string;
  outline: LearningOutline | null;
  currentModuleIndex: number;
  currentLessonIndex: number;
  completedLessons: Set<string>;
}
