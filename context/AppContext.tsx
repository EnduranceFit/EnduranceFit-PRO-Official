"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Athlete, WorkoutTemplate, DietTemplate, SystemSettings } from '@/types';
import { supabase } from '@/utils/supabase';

interface AppContextType {
  state: AppState;
  isLocked: boolean;
  isHydrated: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
  saveAthlete: (athlete: Athlete) => Promise<void>;
  deleteAthlete: (id: string) => Promise<void>;
  saveWorkoutTemplate: (template: WorkoutTemplate) => Promise<void>;
  deleteWorkoutTemplate: (id: string) => Promise<void>;
  saveDietTemplate: (template: DietTemplate) => Promise<void>;
  deleteDietTemplate: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  wipeData: () => Promise<void>;
  importData: (data: AppState) => Promise<void>;
}

const defaultState: AppState = {
  athletes: [],
  workoutTemplates: [],
  dietTemplates: [],
  settings: {
    pin: null,
    appName: 'ENDURANCEFIT PRO',
    trainerName: 'PERSONAL COACH',
    logoUrl: ''
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLocked, setIsLocked] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        console.warn("Supabase client not initialized - skipping hydration");
        setIsHydrated(true);
        return;
      }

      try {
        // Fetch Athletes
        const { data: athletes, error: aError } = await (supabase as any)
          .from('athletes')
          .select('*')
          .order('name');
        
        // Fetch Workouts
        const { data: workouts, error: wError } = await (supabase as any)
          .from('workouts')
          .select('*, workout_exercises(*)');
        
        // Fetch Diets
        const { data: diets, error: dError } = await (supabase as any)
          .from('diets')
          .select('*, diet_meals(*, meal_items(*))');
        
        // Fetch Settings
        const { data: settings, error: sError } = await (supabase as any)
          .from('settings')
          .select('*')
          .single();

        if (aError || wError || dError) console.error("Error fetching data", { aError, wError, dError });

        setState({
          athletes: (athletes || []).map((a: any) => ({
            ...a,
            activityLevel: a.activity_level, // Map snake_case to camelCase
          })),
          workoutTemplates: (workouts || []).map((w: any) => ({
            id: w.id,
            athleteId: w.athlete_id || undefined,
            name: w.name,
            description: w.description || '',
            createdAt: w.created_at || new Date().toISOString(),
            updatedAt: w.updated_at || new Date().toISOString(),
            exercises: (w.workout_exercises || []).map((ex: any) => ({
              ...ex,
              id: ex.id || '',
              muscleGroup: ex.muscle_group,
              restTime: ex.rest_time,
              videoUrl: ex.video_url,
              order: ex.order_index
            }))
          })),
          dietTemplates: (diets || []).map((d: any) => ({
            id: d.id,
            athleteId: d.athlete_id || undefined,
            name: d.name,
            description: d.goal || '',
            createdAt: d.created_at || new Date().toISOString(),
            updatedAt: d.updated_at || new Date().toISOString(),
            meals: (d.diet_meals || []).map((m: any) => ({
              ...m,
              order: m.order_index,
              items: (m.meal_items || []).map((it: any) => ({
                ...it,
                order: it.order_index
              }))
            }))
          })),
          settings: settings ? {
            pin: settings.pin,
            appName: settings.app_name,
            trainerName: settings.trainer_name,
            logoUrl: settings.logo_url
          } : defaultState.settings
        });

        if (settings?.pin) setIsLocked(true);
      } catch (e) {
        console.error('Critical error hydrating state from Supabase', e);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchData();
  }, []);

  const unlock = (pin: string) => {
    if (state.settings.pin === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lock = () => {
    if (state.settings.pin) setIsLocked(true);
  };

  // CRUD Operations with Supabase
  const saveAthlete = async (athlete: Athlete) => {
    if (!supabase || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
      console.error("Supabase not configured. Cannot save athlete.");
      return;
    }
    
    const { error } = await (supabase as any).from('athletes').upsert({
      id: athlete.id,
      name: athlete.name,
      email: athlete.email,
      whatsapp: athlete.whatsapp,
      weight: athlete.weight,
      height: athlete.height,
      age: athlete.age,
      gender: athlete.gender,
      activity_level: athlete.activityLevel,
      goal: athlete.goal,
      status: athlete.status,
      category: athlete.category,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error("Error saving athlete:", error);
      throw error;
    }

    setState(s => {
      const exists = s.athletes.find(a => a.id === athlete.id);
      if (exists) return { ...s, athletes: s.athletes.map(a => a.id === athlete.id ? athlete : a) };
      return { ...s, athletes: [...s.athletes, athlete] };
    });
  };

  const deleteAthlete = async (id: string) => {
    if (!supabase) return;
    const { error } = await (supabase as any).from('athletes').delete().eq('id', id);
    if (!error) {
      setState(s => ({ ...s, athletes: s.athletes.filter(a => a.id !== id) }));
    }
  };

  const saveWorkoutTemplate = async (template: WorkoutTemplate) => {
    if (!supabase || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
      console.error("Supabase not configured. Cannot save workout.");
      return;
    }

    // 1. Save main workout
    const { error: wError } = await (supabase as any).from('workouts').upsert({
      id: template.id,
      athlete_id: template.athleteId || null,
      name: template.name || 'Treino sem Nome',
      description: template.description || '',
      updated_at: new Date().toISOString()
    });

    if (wError) {
      console.error("Error saving workout:", wError);
      throw wError;
    }

    // 2. Delete existing exercises and re-insert (simple sync strategy)
    await (supabase as any).from('workout_exercises').delete().eq('workout_id', template.id);
    
    const { error: eError } = await (supabase as any).from('workout_exercises').insert(
      template.exercises.map((ex, idx) => ({
        workout_id: template.id,
        name: ex.name,
        muscle_group: ex.muscleGroup,
        sets: ex.sets,
        reps: ex.reps,
        rest_time: ex.restTime,
        video_url: ex.videoUrl,
        order_index: idx
      }))
    );

    if (eError) {
      console.error("Error saving workout exercises:", eError);
      throw eError;
    }

    setState(s => {
      const exists = s.workoutTemplates.find(t => t.id === template.id);
      if (exists) return { ...s, workoutTemplates: s.workoutTemplates.map(t => t.id === template.id ? template : t) };
      return { ...s, workoutTemplates: [...s.workoutTemplates, template] };
    });
  };

  const deleteWorkoutTemplate = async (id: string) => {
    if (!supabase) return;
    const { error } = await (supabase as any).from('workouts').delete().eq('id', id);
    if (!error) {
      setState(s => ({ ...s, workoutTemplates: s.workoutTemplates.filter(t => t.id !== id) }));
    }
  };

  const saveDietTemplate = async (template: DietTemplate) => {
    if (!supabase || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
      console.error("Supabase not configured. Cannot save diet.");
      return;
    }

    // 1. Save main diet
    const { error: dError } = await (supabase as any).from('diets').upsert({
      id: template.id,
      athlete_id: template.athleteId || null,
      name: template.name || 'Dieta sem Nome',
      goal: template.description || '',
      updated_at: new Date().toISOString()
    });

    if (dError) {
      console.error("Error saving diet:", dError);
      throw dError;
    }

    // 2. Re-insert meals and items (full sync)
    await (supabase as any).from('diet_meals').delete().eq('diet_id', template.id);
    
    for (const [mIdx, meal] of template.meals.entries()) {
      const { data: mData, error: mError } = await (supabase as any).from('diet_meals').insert({
        diet_id: template.id,
        name: meal.name,
        time: meal.time,
        order_index: mIdx
      }).select().single();

      if (mError) {
        console.error("Error saving meal:", mError);
        throw mError;
      }

      if (mData) {
        const { error: iError } = await (supabase as any).from('meal_items').insert(
          meal.items.map((item, iIdx) => ({
            meal_id: mData.id,
            name: item.name,
            amount: item.amount,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            order_index: iIdx
          }))
        );

        if (iError) {
          console.error("Error saving meal items:", iError);
          throw iError;
        }
      }
    }

    setState(s => {
      const exists = s.dietTemplates.find(t => t.id === template.id);
      if (exists) return { ...s, dietTemplates: s.dietTemplates.map(t => t.id === template.id ? template : t) };
      return { ...s, dietTemplates: [...s.dietTemplates, template] };
    });
  };

  const deleteDietTemplate = async (id: string) => {
    if (!supabase) return;
    const { error } = await (supabase as any).from('diets').delete().eq('id', id);
    if (!error) {
      setState(s => ({ ...s, dietTemplates: s.dietTemplates.filter(t => t.id !== id) }));
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    if (!supabase) return;
    const { error } = await (supabase as any).from('settings').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      app_name: newSettings.appName || state.settings.appName,
      pin: newSettings.pin !== undefined ? newSettings.pin : state.settings.pin,
      trainer_name: newSettings.trainerName || state.settings.trainerName,
      logo_url: newSettings.logoUrl !== undefined ? newSettings.logoUrl : state.settings.logoUrl,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error saving settings:', error);
    }

    if (!error) {
      setState(s => ({ ...s, settings: { ...s.settings, ...newSettings } }));
    }
  };

  const wipeData = async () => {
    // In production, this would delete everything from Supabase correctly
    // For now, let's just clear the local state and provide a fresh start
    setState(defaultState);
    setIsLocked(false);
  };

  const importData = async (data: AppState) => {
    // Implementation for migration from LocalStorage to Supabase would go here
    setState(data);
  };

  return (
    <AppContext.Provider value={{
      state, isLocked, isHydrated, unlock, lock,
      saveAthlete, deleteAthlete, saveWorkoutTemplate, deleteWorkoutTemplate,
      saveDietTemplate, deleteDietTemplate, updateSettings, wipeData, importData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
