"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, Edit, Trash2, Dumbbell, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function ProtocolsTab() {
  const { state, saveWorkoutTemplate, deleteWorkoutTemplate } = useAppContext();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'confirm' | 'alert' | null, message: string, onConfirm?: () => void }>({ type: null, message: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<WorkoutTemplate> | null>(null);

  const filteredTemplates = state.workoutTemplates.filter(t => {
    const nameStr = t.name || '';
    return nameStr.toLowerCase().includes(search.toLowerCase());
  });

  const handleOpenModal = (template?: WorkoutTemplate) => {
    if (template) {
      setEditingTemplate({ ...template });
    } else {
      setEditingTemplate({
        id: uuidv4(),
        name: '',
        description: '',
        exercises: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingTemplate?.name) {
      setModal({ type: 'alert', message: 'Nome é obrigatório' });
      return;
    }
    saveWorkoutTemplate(editingTemplate as WorkoutTemplate);
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <AnimatePresence>
        {isModalOpen && editingTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel hardware-card p-6 max-w-2xl w-full flex flex-col gap-6 my-8"
            >
              <div className="flex justify-between items-center border-b border-[#001F3F] pb-4">
                <h3 className="tech-heading text-xl text-white">
                  {state.workoutTemplates.some(t => t.id === editingTemplate.id) ? 'CONFIGURAR_PROTOCOLO' : 'NOVO_PROTOCOLO'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#607080] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="tech-label block mb-1">Nome do Modelo *</label>
                  <input type="text" className="tech-input" value={editingTemplate.name} onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Descrição</label>
                  <textarea className="tech-input min-h-[100px]" value={editingTemplate.description} onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#001F3F]">
                <button onClick={() => setIsModalOpen(false)} className="tech-button-secondary">
                  Cancelar
                </button>
                <button onClick={handleSave} className="tech-button">
                  <Save size={18} /> Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {modal.type && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass-panel hardware-card p-6 max-w-md w-full flex flex-col gap-4"
            >
              <div className="flex justify-between items-center border-b border-[#001F3F] pb-2">
                <h3 className="tech-heading text-lg text-white">{modal.type === 'confirm' ? 'Confirmação' : 'Aviso'}</h3>
                <button onClick={() => setModal({ type: null, message: '' })} className="text-[#808090] hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-[#808090] font-mono text-sm">{modal.message}</p>
              <div className="flex justify-end gap-3 mt-4">
                {modal.type === 'confirm' && (
                  <button 
                    onClick={() => setModal({ type: null, message: '' })}
                    className="tech-button-secondary"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (modal.onConfirm) modal.onConfirm();
                    setModal({ type: null, message: '' });
                  }}
                  className={modal.type === 'confirm' ? "tech-button-danger" : "tech-button"}
                >
                  {modal.type === 'confirm' ? 'Confirmar' : 'OK'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center bg-[#050505] p-6 border border-[#001F3F] rounded-sm shadow-[0_0_20px_rgba(0,31,63,0.2)]">
        <div>
          <h2 className="tech-heading text-2xl text-white mb-2 tracking-tighter">PROTOCOLO_TREINO</h2>
          <p className="tech-label text-[#004080]">SISTEMA_GESTAO_V2.0</p>
        </div>
        <button onClick={() => handleOpenModal()} className="tech-button">
          <Plus size={18} /> CRIAR_MODELO
        </button>
      </div>

      <div className="glass-panel hardware-card p-6">
        <input 
          type="text" 
          placeholder="Buscar modelos..." 
          className="tech-input w-full md:w-1/3"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#050505] border border-[#001F3F] p-6 flex flex-col gap-4 rounded-sm hover:border-[#004080] transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#001F3F]/20 border border-[#001F3F] text-[#004080] group-hover:text-white transition-colors">
                <Dumbbell size={24} />
              </div>
              <div>
                <h3 className="tech-heading text-lg text-white group-hover:text-[#004080] transition-colors">{template.name}</h3>
                <p className="font-mono text-xs text-[#607080] mt-1 line-clamp-2 uppercase tracking-tighter">{template.description}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-[#001F3F]">
              <button onClick={() => handleOpenModal(template)} className="tech-button-secondary text-[10px] py-1 px-3">
                EDITAR
              </button>
              <button 
                onClick={() => {
                  setModal({
                    type: 'confirm',
                    message: 'CONFIRMAR_EXCLUSAO_PROTOCOLO?',
                    onConfirm: () => deleteWorkoutTemplate(template.id)
                  });
                }}
                className="tech-button-danger text-[10px] py-1 px-3 opacity-50 hover:opacity-100"
              >
                DELETAR
              </button>
            </div>
          </motion.div>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-[#001F3F] rounded-sm bg-[#050505]/50">
            <div className="w-16 h-16 border border-[#001F3F] rounded-full flex items-center justify-center mb-4 opacity-20">
               <Dumbbell size={32} className="text-[#004080]" />
            </div>
            <span className="text-[#607080] font-mono text-xs tracking-[0.3em] uppercase opacity-40">DATABASE_EMPTY: NENHUM_PROTOCOLO</span>
          </div>
        )}
      </div>
    </div>
  );
}
