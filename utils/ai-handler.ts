"use client";

import { Exercise, Meal, WorkoutTemplate, DietTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * MASTER_AI_HANDLER_v2.0
 * Este utilitário simula a resposta do LLM baseada no Master Prompt.
 * Retorna objetos JSON puros para injeção direta via estado (State Injection).
 */

export const generateWorkoutFromAI = async (focus: string): Promise<Partial<WorkoutTemplate>> => {
  // Simulação de delay de processamento da rede
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    focusMuscle: focus,
    exercises: [
      {
        id: uuidv4(),
        name: "Supino Reto com Barra",
        muscleGroup: "Peito",
        sets: 4,
        reps: "4x 8-12",
        order: 0,
        advancedTechnique: "Série Única",
        restTime: 90,
        videoUrl: "https://youtube.com/watch?v=supino"
      },
      {
        id: uuidv4(),
        name: "Desenvolvimento com Halteres",
        muscleGroup: "Ombro",
        sets: 3,
        reps: "3x 10-12",
        order: 1,
        advancedTechnique: "Rest-pause",
        restTime: 60,
        videoUrl: "https://youtube.com/watch?v=desenvolvimento"
      }
    ]
  };
};

export const generateDietFromAI = async (goal: string): Promise<Partial<DietTemplate>> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    description: `Plano focado em ${goal}`,
    meals: [
      {
        id: uuidv4(),
        name: "Café da Manhã (REF_01)",
        time: "08:00",
        order: 0,
        items: [
          { id: uuidv4(), name: "Ovos Cozidos", amount: 150, calories: 232, protein: 19, carbs: 1.5, fat: 16 },
          { id: uuidv4(), name: "Aveia em Flocos", amount: 50, calories: 190, protein: 7, carbs: 33, fat: 3 }
        ]
      }
    ]
  };
};
