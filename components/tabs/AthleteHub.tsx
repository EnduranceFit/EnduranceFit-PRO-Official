"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { 
  Activity, 
  Dumbbell, 
  Utensils, 
  FileText, 
  Plus, 
  History, 
  Copy, 
  Edit3, 
  Trash2, 
  ChevronRight,
  User,
  Scale,
  Zap
} from 'lucide-react';
import { Athlete, WorkoutTemplate, DietTemplate } from '@/types';
import { useAppContext } from '@/context/AppContext';
import clsx from 'clsx';

interface AthleteHubProps {
  athlete: Athlete;
  onAddWorkout: () => void;
  onAddDiet: () => void;
  onEditProtocol: (type: 'workout' | 'diet', id: string) => void;
  onDuplicateProtocol: (type: 'workout' | 'diet', id: string) => void;
  onExportPDF: () => void;
  onBack: () => void;
}

export default function AthleteHub({ 
  athlete, 
  onAddWorkout, 
  onAddDiet, 
  onEditProtocol, 
  onDuplicateProtocol,
  onExportPDF,
  onBack 
}: AthleteHubProps) {
  const { state } = useAppContext();
  
  // Filter protocols for this athlete
  const workouts = state.workoutTemplates.filter(w => w.athleteId === athlete.id);
  const diets = state.dietTemplates.filter(d => d.athleteId === athlete.id);

  // Metabolic calculations (Harris-Benedict)
  const calculateMetabolics = () => {
    const w = Number(athlete.weight);
    const h = Number(athlete.height) / 100;
    const a = Number(athlete.age);
    const imc = w / (h * h);
    
    let tmb = 0;
    if (athlete.gender === 'M') {
      tmb = 88.362 + (13.397 * w) + (4.799 * (h * 100)) - (5.677 * a);
    } else {
      tmb = 447.593 + (9.247 * w) + (3.098 * (h * 100)) - (4.330 * a);
    }
    const get = tmb * (athlete.activityLevel || 1.2);

    return { imc, tmb, get };
  };

  const { imc, tmb, get } = calculateMetabolics();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-app-surface rounded-full transition-colors text-app-muted hover:text-app-text"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div>
            <h2 className="app-heading text-3xl">{athlete.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-app-accent/10 text-app-accent rounded text-[10px] font-bold uppercase tracking-wider">
                {athlete.category}
              </span>
              <span className="text-app-muted text-xs">• Atualizado em {new Date(athlete.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onExportPDF} className="app-button-outline">
            <FileText size={18} /> Exportar PDF
          </button>
          <button className="app-button-primary">
            <Edit3 size={18} /> Editar Perfil
          </button>
        </div>
      </div>

      {/* Metabolic Summary Cards (MD3 Stylized) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="app-card p-6 flex items-center gap-5 border-l-4 border-app-accent">
          <div className="w-12 h-12 rounded-2xl bg-app-accent/10 flex items-center justify-center text-app-accent">
            <Scale size={24} />
          </div>
          <div>
            <p className="app-label">IMC Atual</p>
            <h4 className="text-2xl font-black">{imc.toFixed(1)}</h4>
          </div>
        </div>

        <div className="app-card p-6 flex items-center gap-5 border-l-4 border-app-energy">
          <div className="w-12 h-12 rounded-2xl bg-app-energy/10 flex items-center justify-center text-app-energy">
            <Activity size={24} />
          </div>
          <div>
            <p className="app-label">TMB Basal</p>
            <h4 className="text-2xl font-black">{Math.round(tmb)} <span className="text-sm text-app-muted">kcal</span></h4>
          </div>
        </div>

        <div className="app-card p-6 flex items-center gap-5 border-l-4 border-app-success">
          <div className="w-12 h-12 rounded-2xl bg-app-success/10 flex items-center justify-center text-app-success">
            <Zap size={24} />
          </div>
          <div>
            <p className="app-label">GET (Gasto Total)</p>
            <h4 className="text-2xl font-black">{Math.round(get)} <span className="text-sm text-app-muted">kcal</span></h4>
          </div>
        </div>
      </div>

      {/* Protocol Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Workouts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="text-app-accent" size={24} />
              <h3 className="font-bold text-xl">Planos de Treino</h3>
            </div>
            <button onClick={onAddWorkout} className="app-button-energy !py-2 !px-4 text-xs">
              <Plus size={16} /> NOVO TREINO
            </button>
          </div>

          <div className="space-y-4">
            {workouts.length > 0 ? workouts.map(workout => (
              <div key={workout.id} className="app-card p-5 group hover:border-app-accent transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-lg">{workout.name}</h5>
                    <p className="text-app-muted text-sm mt-1 line-clamp-1">{workout.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] font-bold text-app-accent bg-app-accent/5 px-2 py-0.5 rounded uppercase">
                        {workout.exercises.length} Exercícios
                      </span>
                      <span className="text-[10px] text-app-muted">
                        Última alteração: {new Date(workout.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onDuplicateProtocol('workout', workout.id)}
                      className="p-2 hover:bg-app-accent/10 text-app-accent rounded-lg"
                      title="Duplicar"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => onEditProtocol('workout', workout.id)}
                      className="p-2 hover:bg-app-surface text-app-text rounded-lg"
                      title="Editar"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-10 border-2 border-dashed border-app-border rounded-3xl flex flex-col items-center text-center gap-3 opacity-50">
                <History size={32} />
                <p className="text-sm font-medium">Nenhum treino vinculado a este aluno.</p>
              </div>
            )}
          </div>
        </div>

        {/* Diets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Utensils className="text-app-energy" size={24} />
              <h3 className="font-bold text-xl">Planos Nutricionais</h3>
            </div>
            <button onClick={onAddDiet} className="app-button-energy !py-2 !px-4 text-xs">
              <Plus size={16} /> NOVA DIETA
            </button>
          </div>

          <div className="space-y-4">
            {diets.length > 0 ? diets.map(diet => (
              <div key={diet.id} className="app-card p-5 group hover:border-app-energy transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-lg">{diet.name}</h5>
                    <p className="text-app-muted text-sm mt-1 line-clamp-1">{diet.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] font-bold text-app-energy bg-app-energy/5 px-2 py-0.5 rounded uppercase">
                        {diet.meals.length} Refeições
                      </span>
                      <span className="text-[10px] text-app-muted">
                         Última alteração: {new Date(diet.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onDuplicateProtocol('diet', diet.id)}
                      className="p-2 hover:bg-app-energy/10 text-app-energy rounded-lg"
                      title="Duplicar"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => onEditProtocol('diet', diet.id)}
                      className="p-2 hover:bg-app-surface text-app-text rounded-lg"
                      title="Editar"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-10 border-2 border-dashed border-app-border rounded-3xl flex flex-col items-center text-center gap-3 opacity-50">
                <History size={32} />
                <p className="text-sm font-medium">Nenhuma dieta vinculada a este aluno.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
