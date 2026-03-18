export type Status = 'Ativo' | 'Inativo' | 'Pendente';
export type Category = 'Online' | 'Presencial';

export interface Athlete {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  weight: number;
  height: number;
  age: number;
  gender: 'M' | 'F';
  activityLevel: number;
  goal: string;
  status: Status;
  category: Category;
  workoutTemplateId?: string;
  dietTemplateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  rir?: number;
  targetLoad?: number;
  advancedTechnique?: string; // e.g., Drop-set, Rest-pause
  restTime?: number; // in seconds
  videoUrl?: string;
  order: number;
}

export interface WorkoutTemplate {
  id: string;
  athleteId?: string;
  name: string;
  description: string;
  dayOfWeek?: string;
  focusMuscle?: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface MealItem {
  id: string;
  name: string;
  amount: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  time?: string;
  items: MealItem[];
  order: number;
}

export interface DietTemplate {
  id: string;
  athleteId?: string;
  name: string;
  description: string;
  dayOfWeek?: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  pin: string | null;
  appName: string;
}

export interface AppState {
  athletes: Athlete[];
  workoutTemplates: WorkoutTemplate[];
  dietTemplates: DietTemplate[];
  settings: SystemSettings;
}
