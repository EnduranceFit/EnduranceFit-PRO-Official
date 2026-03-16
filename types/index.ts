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
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: any[]; // simplify for now
  createdAt: string;
  updatedAt: string;
}

export interface DietTemplate {
  id: string;
  name: string;
  description: string;
  meals: any[]; // simplify for now
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
