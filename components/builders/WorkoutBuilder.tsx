"use client";

import { useState } from 'react';
import { Plus, Trash2, Video, Copy, GripVertical } from 'lucide-react';
import { Exercise, WorkoutTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { motion, Reorder } from "framer-motion";
import clsx from 'clsx';

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
        <div>
          <label className="tech-label block mb-1">FOCO_MUSCULAR (DIA)</label>
          <input 
            type="text" 
            placeholder="Ex: Peito e Tríceps" 
            className="tech-input" 
            value={template.focusMuscle || ''} 
            onChange={e => onChange({ ...template, focusMuscle: e.target.value })} 
          />
        </div>
        <div>
          <label className="tech-label block mb-1">DIA_DA_SEMANA</label>
          <select 
            className="tech-input" 
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
        <div className="flex justify-between items-center border-b border-[#001F3F] pb-4">
          <div className="flex gap-3 items-center">
            <h4 className="tech-heading text-sm text-white uppercase tracking-widest">Protocolo de Treino</h4>
            <div className="h-4 w-px bg-[#001F3F]" />
            <button 
              onClick={applyABCStructure} 
              className="px-3 py-1 bg-[#001F3F]/50 border border-[#004080] text-[#607080] hover:text-white hover:bg-[#001F3F] text-[10px] font-mono transition-all rounded-sm uppercase tracking-tighter"
            >
              [ + ] Aplicar ABC
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => alert("AI_ENGINE_v2.0: AGUARDANDO_INTEGRACAO_API")}
              className="px-3 py-1.5 bg-[#001F3F]/20 border border-[#004080] text-[#004080] hover:text-white transition-all rounded-sm flex items-center gap-2 text-[10px] font-mono group"
            >
              <div className="w-2 h-2 rounded-full bg-[#004080] group-hover:bg-white animate-pulse" />
              GERAR_IA
            </button>
            <button onClick={addExercise} className="tech-button text-xs py-1.5 px-4 h-9">
              <Plus size={16} /> Novo Exercício
            </button>
          </div>
        </div>

        <Reorder.Group axis="y" values={exercises} onReorder={(newOrder) => onChange({ ...template, exercises: newOrder.map((ex, i) => ({ ...ex, order: i })) })} className="space-y-3">
          {exercises.map((ex) => (
            <Reorder.Item 
              key={ex.id} 
              value={ex}
              className="bg-[#050505] border border-[#001F3F] p-4 relative group hover:border-[#004080] transition-colors rounded-sm"
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 text-[#607080] cursor-grab active:cursor-grabbing pt-1">
                  <GripVertical size={18} />
                  <span className="font-mono text-[9px] opacity-50 tracking-tighter">0{ex.order + 1}</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="lg:col-span-2">
                      <label className="text-[10px] text-[#004080] uppercase block mb-1">NOME_DO_EXERCICIO</label>
                      <input 
                        className="tech-input text-white font-bold" 
                        value={ex.name} 
                        onChange={e => updateExercise(ex.id, { name: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#004080] uppercase block mb-1">FOCO_MUSCULAR</label>
                      <input 
                        className="tech-input text-xs" 
                        value={ex.muscleGroup} 
                        onChange={e => updateExercise(ex.id, { muscleGroup: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#004080] uppercase block mb-1">SETS_REPS</label>
                      <input 
                        className="tech-input text-center" 
                        value={ex.reps} 
                        onChange={e => updateExercise(ex.id, { reps: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-[#004080] uppercase block mb-1">TECNICA_ADV</label>
                      <input 
                        className="tech-input text-xs" 
                        placeholder="Drop-set, Rest-pause..."
                        value={ex.advancedTechnique || ''} 
                        onChange={e => updateExercise(ex.id, { advancedTechnique: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#004080] uppercase block mb-1">DESCANSO (seg)</label>
                      <input 
                        className="tech-input text-center" 
                        value={ex.restTime || ''} 
                        onChange={e => updateExercise(ex.id, { restTime: Number(e.target.value) })} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#004080] uppercase block mb-1">URL_YOUTUBE</label>
                      <div className="relative">
                        <input 
                          className="tech-input pl-8 text-xs font-mono" 
                          placeholder="https://..."
                          value={ex.videoUrl || ''} 
                          onChange={e => updateExercise(ex.id, { videoUrl: e.target.value })} 
                        />
                        <Video size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#004080]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-[#001F3F] pl-2">
                  <button onClick={() => cloneExercise(ex)} className="p-2 text-[#607080] hover:text-white transition-colors" title="Duplicar">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => removeExercise(ex.id)} className="p-2 text-red-900/50 hover:text-red-500 transition-colors" title="Remover">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {exercises.length === 0 && (
          <div className="py-12 border border-dashed border-[#001F3F] rounded-sm text-center text-[#607080] font-mono text-xs uppercase tracking-widest">
            Sem Exercícios. Clique em [+] para iniciar sequência.
          </div>
        )}
      </div>
    </div>
  );
}
