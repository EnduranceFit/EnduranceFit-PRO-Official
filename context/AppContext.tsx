"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Athlete, WorkoutTemplate, DietTemplate, SystemSettings } from '@/types';

interface AppContextType {
  state: AppState;
  isLocked: boolean;
  isHydrated: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
  saveAthlete: (athlete: Athlete) => void;
  deleteAthlete: (id: string) => void;
  saveWorkoutTemplate: (template: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  saveDietTemplate: (template: DietTemplate) => void;
  deleteDietTemplate: (id: string) => void;
  updateSettings: (settings: Partial<SystemSettings>) => void;
  wipeData: () => void;
  importData: (data: AppState) => void;
}

const defaultState: AppState = {
  athletes: [],
  workoutTemplates: [],
  dietTemplates: [],
  settings: {
    pin: null,
    appName: 'ENDURANCEFIT PRO',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLocked, setIsLocked] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadState = () => {
      try {
        const saved = localStorage.getItem('endurancefit_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            ...defaultState,
            ...parsed,
            athletes: parsed.athletes || [],
            workoutTemplates: parsed.workoutTemplates || [],
            dietTemplates: parsed.dietTemplates || [],
            settings: {
              ...defaultState.settings,
              ...(parsed.settings || {})
            }
          });
          if (parsed.settings?.pin) {
            setIsLocked(true);
          }
        }
      } catch (e) {
        console.error('Failed to load state', e);
      }
    };
    
    loadState();

    // Artificial delay to show the beautiful loading screen (2.5s)
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('endurancefit_state', JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state to localStorage', e);
      }
    }
  }, [state, isHydrated]);

  const unlock = (pin: string) => {
    if (state.settings.pin === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lock = () => {
    if (state.settings.pin) {
      setIsLocked(true);
    }
  };

  const saveAthlete = (athlete: Athlete) => {
    setState(s => {
      const exists = s.athletes.find(a => a.id === athlete.id);
      if (exists) {
        return { ...s, athletes: s.athletes.map(a => a.id === athlete.id ? athlete : a) };
      }
      return { ...s, athletes: [...s.athletes, athlete] };
    });
  };

  const deleteAthlete = (id: string) => {
    setState(s => ({ ...s, athletes: s.athletes.filter(a => a.id !== id) }));
  };

  const saveWorkoutTemplate = (template: WorkoutTemplate) => {
    setState(s => {
      const exists = s.workoutTemplates.find(t => t.id === template.id);
      if (exists) {
        return { ...s, workoutTemplates: s.workoutTemplates.map(t => t.id === template.id ? template : t) };
      }
      return { ...s, workoutTemplates: [...s.workoutTemplates, template] };
    });
  };

  const deleteWorkoutTemplate = (id: string) => {
    setState(s => ({ ...s, workoutTemplates: s.workoutTemplates.filter(t => t.id !== id) }));
  };

  const saveDietTemplate = (template: DietTemplate) => {
    setState(s => {
      const exists = s.dietTemplates.find(t => t.id === template.id);
      if (exists) {
        return { ...s, dietTemplates: s.dietTemplates.map(t => t.id === template.id ? template : t) };
      }
      return { ...s, dietTemplates: [...s.dietTemplates, template] };
    });
  };

  const deleteDietTemplate = (id: string) => {
    setState(s => ({ ...s, dietTemplates: s.dietTemplates.filter(t => t.id !== id) }));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...newSettings } }));
  };

  const wipeData = () => {
    setState(defaultState);
    try {
      localStorage.removeItem('endurancefit_state');
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
    setIsLocked(false);
  };

  const importData = (data: AppState) => {
    setState(data);
    if (data.settings?.pin) {
      setIsLocked(true);
    }
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
