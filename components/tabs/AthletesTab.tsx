"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Search, Edit, MessageCircle, Mail, Plus, X, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import clsx from 'clsx';
import { Athlete } from '@/types';
import { v4 as uuidv4 } from 'uuid';

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

  const handleSave = () => {
    if (!editingAthlete?.name) {
      setModal({ type: 'alert', message: 'Nome é obrigatório' });
      return;
    }
    saveAthlete(editingAthlete as Athlete);
    setIsModalOpen(false);
    setEditingAthlete(null);
  };

  const handleDelete = (id: string) => {
    setModal({
      type: 'confirm',
      message: 'Tem certeza que deseja excluir este atleta?',
      onConfirm: () => deleteAthlete(id)
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
              className="glass-panel hardware-card p-6 max-w-2xl w-full flex flex-col gap-6 my-8"
            >
              <div className="flex justify-between items-center border-b border-[#001F3F] pb-4">
                <h3 className="tech-heading text-xl text-white">
                  {state.athletes.some(a => a.id === editingAthlete.id) ? 'CONFIGURAR_ATLETA' : 'NOVO_ATLETA'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#607080] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="tech-label block mb-1">Nome Completo *</label>
                  <input type="text" className="tech-input" value={editingAthlete.name} onChange={e => setEditingAthlete({...editingAthlete, name: e.target.value})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Email</label>
                  <input type="email" className="tech-input" value={editingAthlete.email} onChange={e => setEditingAthlete({...editingAthlete, email: e.target.value})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">WhatsApp</label>
                  <input type="tel" className="tech-input" value={editingAthlete.whatsapp} onChange={e => setEditingAthlete({...editingAthlete, whatsapp: e.target.value})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Status</label>
                  <select className="tech-input" value={editingAthlete.status} onChange={e => setEditingAthlete({...editingAthlete, status: e.target.value as 'Ativo' | 'Inativo' | 'Pendente'})}>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
                <div>
                  <label className="tech-label block mb-1">Categoria</label>
                  <select className="tech-input" value={editingAthlete.category} onChange={e => setEditingAthlete({...editingAthlete, category: e.target.value as 'Online' | 'Presencial'})}>
                    <option value="Online">Online</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>
                <div>
                  <label className="tech-label block mb-1">Peso (kg)</label>
                  <input type="number" className="tech-input" value={editingAthlete.weight || ''} onChange={e => setEditingAthlete({...editingAthlete, weight: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Altura (cm)</label>
                  <input type="number" className="tech-input" value={editingAthlete.height || ''} onChange={e => setEditingAthlete({...editingAthlete, height: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Idade</label>
                  <input type="number" className="tech-input" value={editingAthlete.age || ''} onChange={e => setEditingAthlete({...editingAthlete, age: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Gênero</label>
                  <select className="tech-input" value={editingAthlete.gender} onChange={e => setEditingAthlete({...editingAthlete, gender: e.target.value as 'M' | 'F'})}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#334155]">
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
              <div className="flex justify-between items-center border-b border-[#334155] pb-2">
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
          <h2 className="tech-heading text-2xl text-white mb-2 tracking-tighter">CENTRAL_ATLETAS</h2>
          <p className="tech-label text-[#004080]">SISTEMA_GESTAO_V2.0</p>
        </div>
        <button onClick={() => handleOpenModal()} className="tech-button">
          <Plus size={18} /> CADASTRAR_ALUNO
        </button>
      </div>

      <div className="glass-panel hardware-card p-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808090]" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            className="tech-input pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="tech-input w-auto min-w-[150px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
          <option value="Pendente">Pendente</option>
        </select>
        <select className="tech-input w-auto min-w-[150px]" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">Todas as Categorias</option>
          <option value="Online">Online</option>
          <option value="Presencial">Presencial</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.map(athlete => (
          <motion.div 
            key={athlete.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#050505] border border-[#001F3F] p-6 flex flex-col gap-4 rounded-sm hover:border-[#004080] transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="tech-heading text-lg text-white group-hover:text-[#004080] transition-colors">{athlete.name}</h3>
                <p className="font-mono text-xs text-[#607080] mt-1 uppercase tracking-tighter">{athlete.email}</p>
              </div>
              <div className={clsx(
                "px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider",
                athlete.status === 'Ativo' ? "bg-green-500/10 text-green-400 border border-green-500/30" :
                athlete.status === 'Pendente' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" :
                "bg-red-500/10 text-red-400 border border-red-500/30"
              )}>
                {athlete.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 py-4 border-y border-[#001F3F]">
              <div>
                <span className="text-[9px] text-[#607080] block font-mono">CATEGORY</span>
                <span className="font-mono text-sm text-white">{athlete.category}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#607080] block font-mono">BIOMETRICS</span>
                <span className="font-mono text-xs text-white uppercase">{athlete.weight}kg | {athlete.height}cm</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-2">
              <div className="flex gap-2">
                <a 
                  href={`https://wa.me/${(athlete.whatsapp || '').replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-[#050505] border border-[#001F3F] rounded-sm hover:border-[#004080] hover:text-[#004080] transition-colors text-[#607080]"
                  title="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleDelete(athlete.id)} className="p-2 text-red-900/50 hover:text-red-500 transition-colors" title="Excluir">
                  <Trash2 size={16} />
                </button>
                <button onClick={() => handleOpenModal(athlete)} className="tech-button-secondary text-[10px] py-1 px-3">
                  EDITAR
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredAthletes.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-[#001F3F] rounded-sm bg-[#050505]/50">
            <div className="w-16 h-16 border border-[#001F3F] rounded-full flex items-center justify-center mb-4 opacity-20">
               <Search size={32} className="text-[#004080]" />
            </div>
            <span className="text-[#607080] font-mono text-xs tracking-[0.3em] uppercase opacity-40">DATABASE_EMPTY: NENHUM_ATLETA</span>
          </div>
        )}
      </div>
    </div>
  );
}
