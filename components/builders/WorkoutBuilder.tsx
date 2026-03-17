"use client";

import { useState } from 'react';
import { Plus, Trash2, Video, Copy, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
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
      reps: '10-12',
      order: exercises.length,
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
    // Logic to replicate structure or notify user
    alert("Estrutura ABC aplicada: Peito/Tríceps (A), Costas/Bíceps (B), Pernas/Ombro (C)");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="tech-label block mb-1">Foco Muscular</label>
          <input 
            type="text" 
            placeholder="Ex: Peito e Tríceps" 
            className="tech-input" 
            value={template.focusMuscle || ''} 
            onChange={e => onChange({ ...template, focusMuscle: e.target.value })} 
          />
        </div>
        <div>
          <label className="tech-label block mb-1">Dia da Semana</label>
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
              [ + ] Aplicar Estrutura ABC
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => alert("AI_ENGINE_v2.0: AGUARDANDO_INTEGRACAO_API\nPrompt Mestre será processado aqui.")}
              className="px-3 py-1.5 bg-[#001F3F]/20 border border-[#004080] text-[#004080] hover:text-white transition-all rounded-sm flex items-center gap-2 text-[10px] font-mono group"
            >
              <div className="w-2 h-2 rounded-full bg-[#004080] group-hover:bg-white animate-pulse" />
              GERAR_COM_IA
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
                <div className="flex flex-col items-center gap-2 text-[#607080] cursor-grab active:cursor-grabbing">
                  <GripVertical size={18} />
                  <span className="font-mono text-[9px] opacity-50 tracking-tighter">0{ex.order + 1}</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <input 
                        type="text" 
                        placeholder="Nome do Exercício" 
                        className="tech-input text-white font-bold" 
                        value={ex.name} 
                        onChange={e => updateExercise(ex.id, { name: e.target.value })} 
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Grupamento" 
                        className="tech-input text-xs" 
                        value={ex.muscleGroup} 
                        onChange={e => updateExercise(ex.id, { muscleGroup: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[10px] text-[#808090] uppercase block">Séries</label>
                      <input 
                        type="number" 
                        className="tech-input text-center" 
                        value={ex.sets} 
                        onChange={e => updateExercise(ex.id, { sets: Number(e.target.value) })} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#808090] uppercase block">Reps</label>
                      <input 
                        type="text" 
                        className="tech-input text-center" 
                        placeholder="8-12" 
                        value={ex.reps} 
                        onChange={e => updateExercise(ex.id, { reps: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#808090] uppercase block">Descanso (s)</label>
                      <input 
                        type="number" 
                        className="tech-input text-center" 
                        placeholder="60" 
                        value={ex.restTime || ''} 
                        onChange={e => updateExercise(ex.id, { restTime: Number(e.target.value) })} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#808090] uppercase block">Técnica</label>
                      <input 
                        type="text" 
                        className="tech-input text-xs" 
                        placeholder="Drop-set..." 
                        value={ex.advancedTechnique || ''} 
                        onChange={e => updateExercise(ex.id, { advancedTechnique: e.target.value })} 
                      />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <label className="text-[10px] text-[#808090] uppercase block">Vídeo (URL)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          className="tech-input pl-8 text-xs" 
                          placeholder="YouTube..." 
                          value={ex.videoUrl || ''} 
                          onChange={e => updateExercise(ex.id, { videoUrl: e.target.value })} 
                        />
                        <Video size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#808090]" />
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
          <div className="py-12 border-2 border-dashed border-[#334155] rounded-xl text-center text-[#808090] font-mono text-sm">
            Nenhum exercício adicionado. Clique em "Adicionar Exercício" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
