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
  Zap,
  MessageCircle
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
  
  const workouts = state.workoutTemplates.filter(w => w.athleteId === athlete.id);
  const diets = state.dietTemplates.filter(d => d.athleteId === athlete.id);

  const calculateMetabolics = () => {
    const w = Number(athlete.weight);
    const h = Number(athlete.height) / 100;
    const a = Number(athlete.age);
    const imc = h > 0 ? w / (h * h) : 0;
    
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-app-card border border-app-border rounded-2xl hover:bg-app-surface transition-colors text-app-muted hover:text-app-accent"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">{athlete.name}</h2>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-app-accent/10 text-app-accent rounded font-bold text-[9px] uppercase tracking-[0.2em]">
                {athlete.category}
              </span>
              <span className="text-app-muted text-xs font-medium">Sincronizado: {new Date(athlete.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {athlete.whatsapp && (
            <button 
              onClick={() => window.open(`https://wa.me/${athlete.whatsapp.replace(/\D/g, '')}`, '_blank')}
              className="app-button-energy px-8 !py-3 shadow-glow-energy"
            >
              <MessageCircle size={18} /> WhatsApp
            </button>
          )}
          <button onClick={onExportPDF} className="app-button-outline px-8 !py-3">
            <FileText size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="app-card p-8 flex items-center gap-6 group hover:border-app-accent transition-all">
          <div className="w-14 h-14 rounded-3xl bg-app-accent/5 flex items-center justify-center text-app-accent group-hover:bg-app-accent group-hover:text-white transition-all">
            <Scale size={28} />
          </div>
          <div className="space-y-1">
            <p className="app-label text-[10px]">IMC ATUAL</p>
            <h4 className="text-3xl font-black leading-none">{imc.toFixed(1)}</h4>
          </div>
        </div>

        <div className="app-card p-8 flex items-center gap-6 group hover:border-app-energy transition-all">
          <div className="w-14 h-14 rounded-3xl bg-app-energy/5 flex items-center justify-center text-app-energy group-hover:bg-app-energy group-hover:text-black transition-all">
            <Activity size={28} />
          </div>
          <div className="space-y-1">
            <p className="app-label text-[10px]">TMB BASAL</p>
            <h4 className="text-3xl font-black leading-none">{Math.round(tmb)} <span className="text-xs text-app-muted">kcal</span></h4>
          </div>
        </div>

        <div className="app-card p-8 flex items-center gap-6 group hover:border-app-success transition-all">
          <div className="w-14 h-14 rounded-3xl bg-app-success/5 flex items-center justify-center text-app-success group-hover:bg-app-success group-hover:text-white transition-all">
            <Zap size={28} />
          </div>
          <div className="space-y-1">
            <p className="app-label text-[10px]">GASTO TOTAL</p>
            <h4 className="text-3xl font-black leading-none text-app-energy">{Math.round(get)} <span className="text-xs text-app-muted">kcal</span></h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-app-accent/10 rounded-xl flex items-center justify-center text-app-accent">
                 <Dumbbell size={20} />
              </div>
              <h3 className="font-bold text-xl uppercase tracking-tighter italic">Planos de Treino</h3>
            </div>
            <button onClick={onAddWorkout} className="app-button-primary !py-2 !px-5 !text-[10px] !font-black uppercase tracking-widest shadow-glow-accent">
              <Plus size={16} /> Adicionar Treino
            </button>
          </div>

          <div className="space-y-4">
            {workouts.length > 0 ? workouts.map(workout => (
              <div key={workout.id} className="app-card p-6 group hover:border-app-accent transition-all cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <h5 className="font-bold text-xl uppercase tracking-tight group-hover:text-app-accent transition-colors">{workout.name}</h5>
                    <p className="text-app-muted text-xs font-semibold uppercase tracking-widest opacity-60">{workout.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-[9px] font-black text-white bg-app-accent px-3 py-1 rounded-full uppercase tracking-tighter">
                        {workout.exercises.length} EXERCÍCIOS
                      </span>
                      <span className="text-[10px] text-app-muted font-medium">
                        Sincronizado: {new Date(workout.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onDuplicateProtocol('workout', workout.id)}
                      className="p-3 bg-app-surface hover:bg-app-accent/10 text-app-muted hover:text-app-accent rounded-xl transition-all shadow-sm"
                      title="Duplicar"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => onEditProtocol('workout', workout.id)}
                      className="p-3 bg-app-accent hover:bg-app-accent/80 text-white rounded-xl transition-all shadow-glow-accent"
                      title="Editar"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-app-accent/5 rounded-full blur-2xl group-hover:bg-app-accent/10 transition-all" />
              </div>
            )) : (
              <div className="p-16 border-2 border-dashed border-app-border rounded-[32px] flex flex-col items-center text-center gap-6 bg-app-card/20 group hover:border-app-accent/30 transition-colors">
                <div className="w-16 h-16 bg-app-accent/5 rounded-full flex items-center justify-center text-app-accent group-hover:scale-110 transition-transform">
                     <History size={32} />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-app-muted opacity-60">Nenhum treino vinculado</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-app-energy/10 rounded-xl flex items-center justify-center text-app-energy">
                 <Utensils size={20} />
              </div>
              <h3 className="font-bold text-xl uppercase tracking-tighter italic">Planos Nutricionais</h3>
            </div>
            <button onClick={onAddDiet} className="app-button-energy !py-2 !px-5 !text-[10px] !font-black uppercase tracking-widest shadow-glow-energy">
              <Plus size={16} /> Adicionar Dieta
            </button>
          </div>

          <div className="space-y-4">
            {diets.length > 0 ? diets.map(diet => (
              <div key={diet.id} className="app-card p-6 group hover:border-app-energy transition-all cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <h5 className="font-bold text-xl uppercase tracking-tight group-hover:text-app-energy transition-colors">{diet.name}</h5>
                    <p className="text-app-muted text-xs font-semibold uppercase tracking-widest opacity-60">{diet.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-[9px] font-black text-black bg-app-energy px-3 py-1 rounded-full uppercase tracking-tighter">
                        {diet.meals.length} REFEIÇÕES
                      </span>
                      <span className="text-[10px] text-app-muted font-medium">
                        Sincronizado: {new Date(diet.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onDuplicateProtocol('diet', diet.id)}
                      className="p-3 bg-app-surface hover:bg-app-energy/10 text-app-muted hover:text-app-energy rounded-xl transition-all shadow-sm"
                      title="Duplicar"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => onEditProtocol('diet', diet.id)}
                      className="p-3 bg-app-energy hover:bg-app-energy/80 text-black rounded-xl transition-all shadow-glow-energy"
                      title="Editar"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-app-energy/5 rounded-full blur-2xl group-hover:bg-app-energy/10 transition-all" />
              </div>
            )) : (
              <div className="p-16 border-2 border-dashed border-app-border rounded-[32px] flex flex-col items-center text-center gap-6 bg-app-card/20 group hover:border-app-energy/30 transition-colors">
                <div className="w-16 h-16 bg-app-energy/5 rounded-full flex items-center justify-center text-app-energy group-hover:scale-110 transition-transform">
                     <History size={32} />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-app-muted opacity-60">Nenhuma dieta vinculada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
