"use client";

import { useState } from 'react';
import { Plus, Trash2, Video, Copy, GripVertical } from 'lucide-react';
import { Exercise, WorkoutTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { motion, Reorder } from "framer-motion";
import clsx from 'clsx';
import { generateWorkoutFromAI } from '@/utils/ai-handler';

interface WorkoutBuilderProps {
  template: Partial<WorkoutTemplate>;
  onChange: (template: Partial<WorkoutTemplate>) => void;
}

export default function WorkoutBuilder({ template, onChange }: WorkoutBuilderProps) {
  const exercises = template.exercises || [];

  const addExercise = () => {
    const newExercise: Exercise = {
      id: uuidv4(),
      name: '',
      muscleGroup: template.focusMuscle || '',
      sets: 3,
      reps: '4x 8-12',
      order: exercises.length,
      advancedTechnique: '',
      restTime: 60,
      videoUrl: '',
    };
    onChange({ ...template, exercises: [...exercises, newExercise] });
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    onChange({
      ...template,
      exercises: exercises.map(ex => ex.id === id ? { ...ex, ...updates } : ex)
    });
  };

  const removeExercise = (id: string) => {
    onChange({
      ...template,
      exercises: exercises.filter(ex => ex.id !== id).map((ex, i) => ({ ...ex, order: i }))
    });
  };

  const cloneExercise = (ex: Exercise) => {
    const cloned: Exercise = {
      ...ex,
      id: uuidv4(),
      order: exercises.length,
    };
    onChange({ ...template, exercises: [...exercises, cloned] });
  };

  const applyABCStructure = () => {
    alert("Estrutura ABC aplicada: Peito/Tríceps (A), Costas/Bíceps (B), Pernas/Ombro (C)");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="app-label">Nome do Treino / Foco</label>
          <input 
            type="text" 
            placeholder="Ex: Peito e Tríceps - Hipertrofia" 
            className="app-input" 
            value={template.focusMuscle || ''} 
            onChange={e => onChange({ ...template, focusMuscle: e.target.value })} 
          />
        </div>
        <div className="space-y-2">
          <label className="app-label">Período / Dia</label>
          <select 
            className="app-input" 
            value={template.dayOfWeek || ''} 
            onChange={e => onChange({ ...template, dayOfWeek: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="Segunda">Segunda-feira</option>
            <option value="Terça">Terça-feira</option>
            <option value="Quarta">Quarta-feira</option>
            <option value="Quinta">Quinta-feira</option>
            <option value="Sexta">Sexta-feira</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-app-border pb-6">
          <div className="flex gap-4 items-center">
            <h4 className="app-heading text-lg">Série de Exercícios</h4>
            <div className="h-6 w-px bg-app-border" />
            <button 
              onClick={applyABCStructure} 
              className="px-4 py-1.5 bg-app-accent/10 border border-app-accent/20 text-app-accent hover:bg-app-accent hover:text-white text-[10px] font-bold transition-all rounded-xl uppercase tracking-wider"
            >
              Aplicar ABC Master
            </button>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={async () => {
                const aiData = await generateWorkoutFromAI(template.focusMuscle || 'Full Body');
                onChange({ ...template, ...aiData });
              }}
              className="px-4 py-2 bg-app-card border border-app-border text-app-muted hover:border-app-accent hover:text-app-accent transition-all rounded-xl flex items-center gap-2 text-[10px] font-bold group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-app-accent/50 group-hover:bg-app-accent animate-pulse" />
              GERAR COM IA
            </button>
            <button onClick={addExercise} className="app-button-primary !py-2 !px-6 !text-xs">
              <Plus size={18} className="mr-1" /> Adicionar Exercício
            </button>
          </div>
        </div>

        <Reorder.Group axis="y" values={exercises} onReorder={(newOrder) => onChange({ ...template, exercises: newOrder.map((ex, i) => ({ ...ex, order: i })) })} className="space-y-3">
          {exercises.map((ex) => (
            <Reorder.Item 
              key={ex.id} 
              value={ex}
              className="app-card !p-6 relative group hover:border-app-accent/30 transition-all border-2 border-transparent"
            >
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-3 text-app-muted cursor-grab active:cursor-grabbing pt-1">
                  <GripVertical size={20} className="hover:text-app-accent transition-colors" />
                  <span className="font-bold text-[10px] opacity-40">#{ex.order + 1}</span>
                </div>
                
                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2 space-y-1">
                      <label className="app-label text-[9px]">Nome do Exercício</label>
                      <input 
                        className="app-input font-bold" 
                        placeholder="Ex: Supino Reto"
                        value={ex.name} 
                        onChange={e => updateExercise(ex.id, { name: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="app-label text-[9px]">Grupamento</label>
                      <input 
                        className="app-input text-sm" 
                        placeholder="Peitorais"
                        value={ex.muscleGroup} 
                        onChange={e => updateExercise(ex.id, { muscleGroup: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="app-label text-[9px]">Séries x Reps</label>
                      <input 
                        className="app-input text-center font-bold" 
                        placeholder="3x 12-15"
                        value={ex.reps} 
                        onChange={e => updateExercise(ex.id, { reps: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="app-label text-[9px]">Método Avançado</label>
                      <input 
                        className="app-input text-xs" 
                        placeholder="Drop-set, Bi-set..."
                        value={ex.advancedTechnique || ''} 
                        onChange={e => updateExercise(ex.id, { advancedTechnique: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="app-label text-[9px]">Descanso (seg)</label>
                      <input 
                        className="app-input text-center font-bold" 
                        value={ex.restTime || ''} 
                        onChange={e => updateExercise(ex.id, { restTime: Number(e.target.value) })} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="app-label text-[9px]">Link de Vídeo (YouTube)</label>
                      <div className="relative">
                        <input 
                          className="app-input pl-10 text-xs" 
                          placeholder="https://youtube.com/..."
                          value={ex.videoUrl || ''} 
                          onChange={e => updateExercise(ex.id, { videoUrl: e.target.value })} 
                        />
                        <Video size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-accent" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-l border-app-border pl-4">
                  <button onClick={() => cloneExercise(ex)} className="p-3 bg-app-accent/5 text-app-muted hover:text-app-accent hover:bg-app-accent/10 rounded-xl transition-all shadow-sm" title="Duplicar">
                    <Copy size={18} />
                  </button>
                  <button onClick={() => removeExercise(ex.id)} className="p-3 bg-red-500/5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shadow-sm" title="Remover">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {exercises.length === 0 && (
          <div className="py-16 border-2 border-dashed border-app-border rounded-2xl text-center flex flex-col items-center justify-center gap-4 bg-app-card/30">
            <div className="p-4 bg-app-accent/5 rounded-full">
              <Plus size={32} className="text-app-accent opacity-30" />
            </div>
            <p className="text-app-muted text-sm font-medium">Nenhum exercício pautado ainda.</p>
            <button onClick={addExercise} className="app-button-outline !py-2">Iniciar Sequência</button>
          </div>
        )}
      </div>
    </div>
  );
}
