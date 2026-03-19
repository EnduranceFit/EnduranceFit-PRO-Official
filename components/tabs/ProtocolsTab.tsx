"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, Edit, Trash2, Dumbbell, X, Save, ArrowLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import WorkoutBuilder from '../builders/WorkoutBuilder';

export default function ProtocolsTab() {
  const { state, saveWorkoutTemplate, deleteWorkoutTemplate } = useAppContext();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'confirm' | 'alert' | null, message: string, onConfirm?: () => void }>({ type: null, message: '' });
  
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<WorkoutTemplate> | null>(null);

  const filteredTemplates = state.workoutTemplates.filter(t => {
    const nameStr = t.name || '';
    return nameStr.toLowerCase().includes(search.toLowerCase());
  });

  const handleOpenBuilder = (template?: WorkoutTemplate) => {
    if (template) {
      setEditingTemplate({ ...template });
    } else {
      setEditingTemplate({
        id: uuidv4(),
        name: 'Novo Protocolo de Treino',
        description: 'Modelo gerado para performance',
        exercises: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setIsBuilderOpen(true);
  };

  const handleSave = async () => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
        throw new Error("Supabase não configurado.");
      }
      await saveWorkoutTemplate(editingTemplate as WorkoutTemplate);
      setIsBuilderOpen(false);
      setEditingTemplate(null);
    } catch (error: any) {
      setModal({ type: 'alert', message: `Erro ao salvar: ${error.message}` });
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full relative">
      <AnimatePresence>
        {isBuilderOpen && editingTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121212] p-4 md:p-8 overflow-y-auto flex flex-col"
          >
            <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
              <div className="flex justify-between items-center border-b border-app-border pb-6">
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsBuilderOpen(false)} className="app-button-outline !p-3">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                        Editor de Protocolos
                    </h3>
                    <p className="text-[10px] font-bold text-app-accent uppercase tracking-[0.3em]">Ambiente de Prescrição Elite</p>
                  </div>
                </div>
                <button onClick={handleSave} className="app-button-primary px-10 shadow-glow-accent">
                  <Save size={18} className="mr-2" /> Finalizar Treino
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="app-card p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="app-label">Título do Treino</label>
                        <input 
                        type="text" 
                        className="app-input text-sm" 
                        value={editingTemplate.name} 
                        onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="app-label">Referência / Dia</label>
                        <input 
                        type="text" 
                        className="app-input text-sm" 
                        placeholder="Ex: Seg / Ter / ABC"
                        value={editingTemplate.description} 
                        onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})} 
                        />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="app-card p-8">
                    <WorkoutBuilder 
                      template={editingTemplate} 
                      onChange={(updated) => setEditingTemplate(updated)} 
                      otherWorkouts={state.workoutTemplates}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {modal.type && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="app-card p-10 max-w-md w-full">
              <h3 className="text-xl font-bold border-b border-app-border pb-4 mb-4">Aviso do Sistema</h3>
              <p className="text-app-muted leading-relaxed mb-8">{modal.message}</p>
              <div className="flex justify-end gap-4">
                {modal.type === 'confirm' && (
                  <button onClick={() => setModal({ type: null, message: '' })} className="app-button-outline">Cancelar</button>
                )}
                <button 
                  onClick={() => {
                    if (modal.onConfirm) modal.onConfirm();
                    setModal({ type: null, message: '' });
                  }}
                  className={modal.type === 'confirm' ? "px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all" : "app-button-primary"}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-card p-8 flex justify-between items-center relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Banco de Treinos</h2>
          <p className="text-app-accent font-bold text-xs uppercase tracking-widest">Performance Coaching Hub</p>
        </div>
        <button onClick={() => handleOpenBuilder()} className="app-button-primary px-10 relative z-10 shadow-glow-accent">
          <Plus size={20} className="mr-2" /> Novo Treino
        </button>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-app-accent/5 rounded-full blur-3xl group-hover:bg-app-accent/10 transition-colors" />
      </div>

      <div className="app-card p-6 relative group">
        <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-accent transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Buscar modelos de treinamento..." 
          className="app-input pl-14"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map(template => (
          <motion.div 
            key={template.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="app-card p-8 flex flex-col gap-6 group hover:border-app-accent/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-5">
              <div className="p-4 bg-app-accent/10 border border-app-accent/20 text-app-accent rounded-2xl group-hover:bg-app-accent group-hover:text-white transition-all transform group-hover:rotate-6">
                <Dumbbell size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold tracking-tight truncate group-hover:text-app-accent transition-colors uppercase leading-none mb-2">{template.name}</h3>
                <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest line-clamp-1">{template.description}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-6 border-t border-app-border/40">
               <button 
                onClick={() => {
                  setModal({
                    type: 'confirm',
                    message: 'Deseja excluir este treino permanentemente?',
                    onConfirm: async () => {
                        await deleteWorkoutTemplate(template.id);
                    }
                  });
                }}
                className="p-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>

              <button onClick={() => handleOpenBuilder(template)} className="app-button-outline !py-3 !px-6 !text-xs !font-black uppercase tracking-widest">
                Acessar Editor
              </button>
            </div>
          </motion.div>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-app-border rounded-[32px] bg-app-card/20">
            <div className="w-20 h-20 bg-app-muted/5 rounded-full flex items-center justify-center mb-6">
               <Dumbbell size={40} className="text-app-muted opacity-30" />
            </div>
            <span className="text-app-muted font-bold text-sm uppercase tracking-widest opacity-40 text-center">Nenhum treino encontrado</span>
          </div>
        )}
      </div>
    </div>
  );
}
