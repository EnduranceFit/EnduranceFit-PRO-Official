"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Search, Edit, MessageCircle, Mail, Plus, X, Save, Trash2, UserPlus, FileText, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import clsx from 'clsx';
import { Athlete, WorkoutTemplate, DietTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { openPrintWindow } from '@/utils/print-helper';

export default function AthletesTab() {
  const { state, saveAthlete, deleteAthlete } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modal, setModal] = useState<{ type: 'confirm' | 'alert' | null, message: string, onConfirm?: () => void }>({ type: null, message: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Partial<Athlete> | null>(null);


  const filteredAthletes = state.athletes.filter(a => {
    const nameStr = a.name || '';
    const emailStr = a.email || '';
    const matchesSearch = nameStr.toLowerCase().includes(search.toLowerCase()) || emailStr.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? a.status === statusFilter : true;
    const matchesCategory = categoryFilter ? a.category === categoryFilter : true;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenModal = (athlete?: Athlete) => {
    if (athlete) {
      setEditingAthlete({ ...athlete });
    } else {
      setEditingAthlete({
        id: uuidv4(),
        name: '',
        email: '',
        whatsapp: '',
        weight: 0,
        height: 0,
        age: 0,
        gender: 'M',
        activityLevel: 1.2,
        goal: 'hypertrophy',
        status: 'Ativo',
        category: 'Online',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingAthlete?.name) {
      setModal({ type: 'alert', message: 'Nome é obrigatório' });
      return;
    }
    
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
        throw new Error("Supabase não configurado. Por favor, adicione as chaves no arquivo .env.local");
      }
      await saveAthlete(editingAthlete as Athlete);
      setIsModalOpen(false);
      setEditingAthlete(null);
    } catch (error: any) {
      console.error("Save athlete error:", error);
      setModal({ type: 'alert', message: `Erro ao salvar: ${error.message || 'Erro de conexão.'}` });
    }
  };

  const handleDelete = (id: string) => {
    setModal({
      type: 'confirm',
      message: 'Tem certeza que deseja excluir este atleta?',
      onConfirm: async () => {
        try {
          await deleteAthlete(id);
        } catch (error: any) {
          console.error("Delete athlete error:", error);
          setModal({ type: 'alert', message: `Erro ao excluir: ${error.message || 'Erro de conexão.'}` });
        }
      }
    });
  };

  const handlePrint = (athlete: Athlete) => {
    const workouts = state.workoutTemplates.filter(t => t.athleteId === athlete.id);
    const diets = state.dietTemplates.filter(t => t.athleteId === athlete.id);
    const diet = diets.length > 0 ? diets[0] : undefined;
    
    if (workouts.length === 0 && diets.length === 0) {
      setModal({ type: 'alert', message: 'Este atleta não possui treino ou dieta vinculados para exportação.' });
      return;
    }

    openPrintWindow({
      athlete,
      workouts,
      diet,
      settings: state.settings
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <AnimatePresence>
        {isModalOpen && editingAthlete && (
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
              className="app-card p-8 max-w-2xl w-full flex flex-col gap-8 my-8 relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-app-border pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-app-accent/10 rounded-lg text-app-accent">
                    <UserPlus size={24} />
                  </div>
                  <h3 className="app-heading text-2xl">
                    {state.athletes.some(a => a.id === editingAthlete.id) ? 'Editar Perfil' : 'Novo Aluno'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-app-muted hover:text-white transition-colors bg-app-card border border-app-border p-2 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="app-label">Nome Completo *</label>
                  <input type="text" className="app-input" placeholder="Ex: João da Silva" value={editingAthlete.name} onChange={e => setEditingAthlete({...editingAthlete, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">Email</label>
                  <input type="email" className="app-input" placeholder="contato@email.com" value={editingAthlete.email} onChange={e => setEditingAthlete({...editingAthlete, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">WhatsApp</label>
                  <input type="tel" className="app-input" placeholder="(00) 00000-0000" value={editingAthlete.whatsapp} onChange={e => setEditingAthlete({...editingAthlete, whatsapp: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">Status</label>
                  <select className="app-input" value={editingAthlete.status} onChange={e => setEditingAthlete({...editingAthlete, status: e.target.value as any})}>
                    <option value="Ativo">✅ Ativo</option>
                    <option value="Inativo">❌ Inativo</option>
                    <option value="Pendente">⏳ Pendente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="app-label">Categoria</label>
                  <select className="app-input" value={editingAthlete.category} onChange={e => setEditingAthlete({...editingAthlete, category: e.target.value as any})}>
                    <option value="Online">🌐 Online</option>
                    <option value="Presencial">🏋️ Presencial</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4 col-span-1 md:col-span-2 pt-4 border-t border-app-border">
                  <div className="space-y-2">
                    <label className="app-label">Peso (kg)</label>
                    <input type="number" className="app-input text-center" value={editingAthlete.weight || ''} onChange={e => setEditingAthlete({...editingAthlete, weight: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="app-label">Altura (cm)</label>
                    <input type="number" className="app-input text-center" value={editingAthlete.height || ''} onChange={e => setEditingAthlete({...editingAthlete, height: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="app-label">Idade</label>
                    <input type="number" className="app-input text-center" value={editingAthlete.age || ''} onChange={e => setEditingAthlete({...editingAthlete, age: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="app-label">Gênero</label>
                  <select className="app-input" value={editingAthlete.gender} onChange={e => setEditingAthlete({...editingAthlete, gender: e.target.value as any})}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="app-label">Objetivo Primário</label>
                  <select className="app-input" value={editingAthlete.goal} onChange={e => setEditingAthlete({...editingAthlete, goal: e.target.value})}>
                    <option value="hypertrophy">Hipertrofia</option>
                    <option value="weight_loss">Definição/Perda de Peso</option>
                    <option value="maintenance">Manutenção/Saúde</option>
                    <option value="performance">Performance Esportiva</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-app-border">
                <button onClick={() => setIsModalOpen(false)} className="app-button-outline px-8">
                  Cancelar
                </button>
                <button onClick={handleSave} className="app-button-primary px-10">
                  <Save size={18} className="mr-2" /> Salvar Alterações
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
              className="app-card p-8 max-w-md w-full flex flex-col gap-6"
            >
              <div className="flex justify-between items-center border-b border-app-border pb-4">
                <h3 className="app-heading text-xl">{modal.type === 'confirm' ? 'Confirmar Ação' : 'Aviso do Sistema'}</h3>
                <button onClick={() => setModal({ type: null, message: '' })} className="text-app-muted hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-app-muted font-medium py-2">{modal.message}</p>
              <div className="flex justify-end gap-4 mt-4">
                {modal.type === 'confirm' && (
                  <button 
                    onClick={() => setModal({ type: null, message: '' })}
                    className="app-button-outline px-6"
                  >
                    Voltar
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (modal.onConfirm) modal.onConfirm();
                    setModal({ type: null, message: '' });
                  }}
                  className={clsx(
                    "px-8 py-3 rounded-xl font-bold transition-all",
                    modal.type === 'confirm' ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" : "app-button-primary"
                  )}
                >
                  {modal.type === 'confirm' ? 'Excluir Agora' : 'Entendido'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
        <div className="relative z-10">
          <h2 className="app-heading text-3xl mb-1">Gestão de Alunos</h2>
          <p className="text-app-accent font-bold text-sm tracking-wide uppercase">Elite Client Relationship Manager</p>
        </div>
        <button onClick={() => handleOpenModal()} className="app-button-primary px-8 relative z-10 shadow-glow-accent">
          <Plus size={20} className="mr-2" /> Novo Aluno
        </button>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-app-accent/5 rounded-full blur-3xl group-hover:bg-app-accent/10 transition-colors" />
      </div>

      <div className="app-card p-6 flex gap-4 flex-wrap items-center">
        <div className="flex-1 min-w-[280px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-accent transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, biotipo ou e-mail..." 
            className="app-input pl-12"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select className="app-input w-auto min-w-[160px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Status: Todos</option>
            <option value="Ativo">✅ Ativo</option>
            <option value="Inativo">❌ Inativo</option>
            <option value="Pendente">⏳ Pendente</option>
          </select>
          <select className="app-input w-auto min-w-[160px]" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">Tipo: Todos</option>
            <option value="Online">🌐 Online</option>
            <option value="Presencial">🏋️ Presencial</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.map(athlete => (
          <motion.div 
            key={athlete.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="app-card p-6 flex flex-col gap-6 group hover:border-app-accent/50 transition-all border-2 border-transparent relative"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="app-heading text-xl group-hover:text-app-accent transition-colors">{athlete.name}</h3>
                <p className="text-app-muted text-xs truncate max-w-[180px]">{athlete.email || 'Sem e-mail cadastrado'}</p>
              </div>
              <div className={clsx(
                "px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border",
                athlete.status === 'Ativo' ? "bg-app-success/10 text-app-success border-app-success/20" :
                athlete.status === 'Pendente' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                "bg-red-500/10 text-red-500 border-red-500/20"
              )}>
                {athlete.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-app-border">
              <div className="space-y-1">
                <span className="app-label text-[9px]">Acompanhamento</span>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {athlete.category === 'Online' ? '🌐 Online' : '🏋️ Presencial'}
                </div>
              </div>
              <div className="space-y-1">
                <span className="app-label text-[9px]">Fisiologia</span>
                <div className="text-sm font-bold">
                  {athlete.weight}kg <span className="text-app-muted font-normal mx-1">|</span> {athlete.height}cm
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <a 
                    href={`https://wa.me/${(athlete.whatsapp || '').replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-app-success/10 text-app-success rounded-xl hover:bg-app-success hover:text-white transition-all shadow-sm active:scale-95"
                    title="Enviar mensagem no WhatsApp"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a 
                    href={`mailto:${athlete.email}`}
                    className="p-3 bg-app-accent/10 text-app-accent rounded-xl hover:bg-app-accent hover:text-white transition-all shadow-sm active:scale-95"
                    title="Enviar e-mail de feedback"
                  >
                    <Mail size={20} />
                  </a>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(athlete)} className="app-button-outline !px-4 !py-2 !text-xs">
                    EDITAR
                  </button>
                  <button 
                    onClick={() => handlePrint(athlete)} 
                    className="app-button-primary !px-4 !py-2 !text-xs !bg-white !text-black hover:!bg-app-accent hover:!text-white"
                  >
                    PDF ELITE
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(athlete.id)} 
                className="w-full py-2 text-[10px] text-red-500/50 hover:text-red-500 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={12} /> Remover Aluno
              </button>
            </div>
          </motion.div>
        ))}
        

        
        {filteredAthletes.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-app-border rounded-3xl bg-app-card/30">
            <div className="w-20 h-20 bg-app-accent/5 rounded-full flex items-center justify-center mb-6">
               <Search size={40} className="text-app-accent opacity-50" />
            </div>
            <h4 className="app-heading text-xl opacity-60">Nenhum aluno encontrado</h4>
            <p className="text-app-muted text-sm mt-2">Tente ajustar seus filtros ou cadastre um novo aluno.</p>
          </div>
        )}
      </div>
    </div>
  );
}
