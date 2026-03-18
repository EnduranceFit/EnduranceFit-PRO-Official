"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, Edit, Trash2, Utensils, X, Save, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { DietTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import DietBuilder from '../builders/DietBuilder';

export default function NutritionTab() {
  const { state, saveDietTemplate, deleteDietTemplate } = useAppContext();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ type: 'confirm' | 'alert' | null, message: string, onConfirm?: () => void }>({ type: null, message: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<DietTemplate> | null>(null);

  const filteredTemplates = state.dietTemplates.filter(t => {
    const nameStr = t.name || '';
    return nameStr.toLowerCase().includes(search.toLowerCase());
  });

  const handleOpenBuilder = (template?: DietTemplate) => {
    if (template) {
      setEditingTemplate({ ...template });
    } else {
      setEditingTemplate({
        id: uuidv4(),
        name: 'NOVA_DIETA_v2',
        description: 'MASTER_PROMPT_GENERATED',
        meals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setIsBuilderOpen(true);
  };

  const handleSave = async () => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
        throw new Error("Supabase não configurado. Por favor, adicione as chaves no arquivo .env.local");
      }
      await saveDietTemplate(editingTemplate as DietTemplate);
      setIsBuilderOpen(false);
      setEditingTemplate(null);
    } catch (error: any) {
      console.error("Save diet error:", error);
      setModal({ type: 'alert', message: `Erro ao salvar: ${error.message || 'Erro de conexão.'}` });
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <AnimatePresence>
        {isBuilderOpen && editingTemplate && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-[#000000] p-4 md:p-8 overflow-y-auto flex flex-col"
          >
            <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-[#001F3F] pb-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsBuilderOpen(false)} className="tech-button-secondary p-2">
                    <ArrowLeft size={20} />
                  </button>
                  <h3 className="tech-heading text-xl text-white italic tracking-widest uppercase">
                    MASTER_AI_NUTRITION_v2.0
                  </h3>
                </div>
                <button onClick={handleSave} className="tech-button py-2 px-8">
                  <Save size={18} className="mr-2" /> FINALIZAR_DIETA
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-panel p-4 border-[#001F3F]">
                    <label className="tech-label block mb-1">NOME_TECNICO</label>
                    <input 
                      type="text" 
                      className="tech-input text-xs" 
                      value={editingTemplate.name} 
                      onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} 
                    />
                  </div>
                  <div className="glass-panel p-4 border-[#001F3F]">
                    <label className="tech-label block mb-1">GOAL_PARAMETER</label>
                    <select 
                      className="tech-input text-xs"
                      value={editingTemplate.description}
                      onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})}
                    >
                      <option value="Bulking">Bulking</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Manutenção">Manutenção</option>
                    </select>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="bg-[#050505] border border-[#001F3F] p-6 rounded-sm shadow-[0_0_40px_rgba(0,31,63,0.3)]">
                    <DietBuilder 
                      template={editingTemplate} 
                      onChange={(updated) => setEditingTemplate(updated)} 
                    />
                  </div>
                </div>
              </div>
            </div>
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
          <h2 className="tech-heading text-2xl text-white mb-2 tracking-tighter">ESTRUTURA_NUTRICIONAL</h2>
          <p className="tech-label text-[#004080]">SISTEMA_GESTAO_V2.0</p>
        </div>
        <button onClick={() => handleOpenBuilder()} className="tech-button py-2 px-8">
          <Plus size={18} className="mr-2" /> CRIAR_DIETA_v2
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
                <Utensils size={24} />
              </div>
              <div>
                <h3 className="tech-heading text-lg text-white group-hover:text-[#004080] transition-colors">{template.name}</h3>
                <p className="font-mono text-xs text-[#607080] mt-1 line-clamp-2 uppercase tracking-tighter">{template.description}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-[#001F3F]">
              <button onClick={() => handleOpenBuilder(template)} className="tech-button-secondary text-[10px] py-1 px-3">
                ABRIR_BUILDER
              </button>
              <button 
                onClick={() => {
                  setModal({
                    type: 'confirm',
                    message: 'CONFIRMAR_EXCLUSAO_DIETA?',
                    onConfirm: async () => {
                      try {
                        await deleteDietTemplate(template.id);
                      } catch (error: any) {
                        console.error("Delete diet error:", error);
                        setModal({ type: 'alert', message: `Erro ao excluir: ${error.message || 'Erro de conexão.'}` });
                      }
                    }
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
               <Utensils size={32} className="text-[#004080]" />
            </div>
            <span className="text-[#607080] font-mono text-xs tracking-[0.3em] uppercase opacity-40">DATABASE_EMPTY: NENHUMA_DIETA</span>
          </div>
        )}
      </div>
    </div>
  );
}
