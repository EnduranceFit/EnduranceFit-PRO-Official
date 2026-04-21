"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Dumbbell, 
  Utensils, 
  CheckCircle, 
  ChevronRight, 
  Save, 
  X, 
  UserPlus, 
  Activity, 
  History,
  Info,
  User,
  Scale,
  Zap,
  Trash2,
  Copy,
  Edit3
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Athlete, WorkoutTemplate, DietTemplate } from '@/types';
import { useAppContext } from '@/context/AppContext';
import WorkoutBuilder from '../builders/WorkoutBuilder';
import DietBuilder from '../builders/DietBuilder';
import AthleteHub from './AthleteHub';
import ShoppingListExporter from '../builders/ShoppingListExporter';
import WorkoutExporter from '../builders/WorkoutExporter';
import clsx from 'clsx';

export default function DashboardTab() {
  const { state, saveAthlete, saveWorkoutTemplate, saveDietTemplate } = useAppContext();
  const [view, setView] = useState<'selection' | 'registration' | 'hub' | 'workout-builder' | 'diet-builder'>('selection');
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modal, setModal] = useState<{ type: 'alert' | null, message: string }>({ type: null, message: '' });
  
  const [customWorkout, setCustomWorkout] = useState<Partial<WorkoutTemplate>>({ exercises: [] });
  const [customDiet, setCustomDiet] = useState<Partial<DietTemplate>>({ meals: [] });
  const [editId, setEditId] = useState<string | null>(null);

  // Athlete Form State (for new registration)
  const [athleteForm, setAthleteForm] = useState<Partial<Athlete>>({
    name: '',
    email: '',
    whatsapp: '',
    weight: 0,
    height: 0,
    age: 0,
    gender: 'M',
    activityLevel: 1.2,
    status: 'Ativo',
    category: 'Online'
  });

  const [metabolics, setMetabolics] = useState({ imc: 0, tmb: 0, get: 0, imcClass: '' });

  // Real-time calculations listener
  useEffect(() => {
    if (athleteForm.weight && athleteForm.height && athleteForm.age) {
      const w = Number(athleteForm.weight);
      const h = Number(athleteForm.height) / 100;
      const a = Number(athleteForm.age);
      
      const imc = h > 0 ? w / (h * h) : 0;
      let tmb = 0;
      if (athleteForm.gender === 'M') {
        tmb = 88.362 + (13.397 * w) + (4.799 * (h * 100)) - (5.677 * a);
      } else {
        tmb = 447.593 + (9.247 * w) + (3.098 * (h * 100)) - (4.330 * a);
      }
      const get = tmb * (athleteForm.activityLevel || 1.2);

      let imcClass = '';
      if (imc < 18.5) imcClass = 'Abaixo do Peso';
      else if (imc < 24.9) imcClass = 'Peso Normal';
      else if (imc < 29.9) imcClass = 'Sobrepeso';
      else imcClass = 'Obesidade';

      setMetabolics({ imc, tmb, get, imcClass });
    }
  }, [athleteForm]);

  const handleCreateAthlete = async () => {
    if (!athleteForm.name) return setModal({ type: 'alert', message: 'Nome é obrigatório.' });
    setIsProcessing(true);
    try {
      const newAthlete = {
        ...athleteForm,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Athlete;
      
      await saveAthlete(newAthlete);
      setCurrentAthlete(newAthlete);
      setView('hub');
    } catch (e: any) {
      setModal({ type: 'alert', message: `Erro: ${e.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const startNewProtocol = (type: 'workout' | 'diet') => {
    if (!currentAthlete) return;
    setEditId(null);
    if (type === 'workout') {
      setCustomWorkout({ exercises: [], athleteId: currentAthlete.id });
      setView('workout-builder');
    } else {
      setCustomDiet({ meals: [], athleteId: currentAthlete.id });
      setView('diet-builder');
    }
  };

  const handleSaveWorkout = async (workout: WorkoutTemplate) => {
    setIsProcessing(true);
    try {
      await saveWorkoutTemplate(workout);
      setView('hub');
    } catch (e: any) {
      setModal({ type: 'alert', message: `Erro ao salvar: ${e.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDiet = async (diet: DietTemplate) => {
    setIsProcessing(true);
    try {
      await saveDietTemplate(diet);
      setView('hub');
    } catch (e: any) {
      setModal({ type: 'alert', message: `Erro ao salvar: ${e.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDuplicate = async (type: 'workout' | 'diet', id: string) => {
    setIsProcessing(true);
    try {
      if (type === 'workout') {
        const original = state.workoutTemplates.find(w => w.id === id);
        if (original) {
          const copy = { 
            ...original, 
            id: uuidv4(), 
            name: `${original.name} (Cópia)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await saveWorkoutTemplate(copy);
        }
      } else {
        const original = state.dietTemplates.find(d => d.id === id);
        if (original) {
          const copy = { 
            ...original, 
            id: uuidv4(), 
            name: `${original.name} (Cópia)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await saveDietTemplate(copy);
        }
      }
    } catch (e: any) {
      setModal({ type: 'alert', message: `Erro ao duplicar: ${e.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full relative print:block">
      <AnimatePresence>
        {modal.type && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="app-card p-8 max-w-md w-full">
              <h3 className="text-xl font-bold border-b border-app-border pb-4 mb-4">Aviso do Sistema</h3>
              <p className="text-app-muted leading-relaxed">{modal.message}</p>
              <div className="flex justify-end mt-8">
                <button onClick={() => setModal({ type: null, message: '' })} className="app-button-primary">Entendido</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8 pb-20 print:hidden">
        <AnimatePresence mode="wait">
          {view === 'selection' && (
            <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 py-10">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Bem-vindo, Coach</h1>
                <p className="text-app-muted text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px]">Consultoria de Performance Elite</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button 
                  onClick={() => setView('registration')}
                  className="app-card p-10 flex flex-col items-center gap-6 group hover:border-app-accent hover:scale-[1.02] transition-all"
                >
                  <div className="w-20 h-20 rounded-3xl bg-app-accent/10 flex items-center justify-center text-app-accent group-hover:scale-110 transition-transform">
                    <UserPlus size={40} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Novo Aluno</h3>
                    <p className="text-app-muted mt-2">Cadastro rápido e avaliação inicial</p>
                  </div>
                </button>

                <div className="app-card p-10 flex flex-col items-center gap-6 group hover:border-app-energy hover:scale-[1.02] transition-all overflow-hidden relative">
                   <div className="w-20 h-20 rounded-3xl bg-app-energy/10 flex items-center justify-center text-app-energy group-hover:scale-110 transition-transform">
                    <Activity size={40} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-app-text">Base de Alunos</h3>
                    <p className="text-app-muted mt-2">Gerenciar base de {state.athletes.length} profissionais</p>
                  </div>
                </div>
              </div>

              {state.athletes.length > 0 && (
                <div className="app-card p-8 space-y-6">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <History size={20} className="text-app-accent" /> Avaliações Recentes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.athletes.slice(0, 6).map(a => (
                      <button 
                        key={a.id} 
                        onClick={() => { setCurrentAthlete(a); setView('hub'); }}
                        className="p-4 bg-app-surface border border-app-border rounded-2xl flex items-center justify-between hover:border-app-accent transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-app-accent/10 flex items-center justify-center text-app-accent font-bold text-sm">
                            {a.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm line-clamp-1">{a.name}</p>
                            <p className="text-[10px] text-app-muted uppercase font-bold tracking-widest">{a.category}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-app-muted" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'registration' && (
            <motion.div key="registration" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('selection')} className="p-2 hover:bg-app-surface rounded-full text-app-muted"><ChevronRight size={24} className="rotate-180" /></button>
                <h2 className="app-heading text-3xl font-black">Cadastro Rápido</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 app-card p-10 space-y-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="app-label">Nome Completo</label>
                      <input type="text" className="app-input" value={athleteForm.name} onChange={e => setAthleteForm({...athleteForm, name: e.target.value})} placeholder="Ex: Rodrigo Faro" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="app-label">Peso (kg)</label>
                        <input type="number" className="app-input" value={athleteForm.weight || ''} onChange={e => setAthleteForm({...athleteForm, weight: Number(e.target.value)})} placeholder="00.0" />
                      </div>
                      <div className="space-y-2">
                        <label className="app-label">Altura (cm)</label>
                        <input type="number" className="app-input" value={athleteForm.height || ''} onChange={e => setAthleteForm({...athleteForm, height: Number(e.target.value)})} placeholder="180" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="app-label">Idade</label>
                        <input type="number" className="app-input" value={athleteForm.age || ''} onChange={e => setAthleteForm({...athleteForm, age: Number(e.target.value)})} placeholder="30" />
                      </div>
                      <div className="space-y-2">
                        <label className="app-label">Sexo</label>
                        <select className="app-input" value={athleteForm.gender} onChange={e => setAthleteForm({...athleteForm, gender: e.target.value as any})}>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="app-label">WhatsApp (Celular)</label>
                        <input type="text" className="app-input" value={athleteForm.whatsapp} onChange={e => setAthleteForm({...athleteForm, whatsapp: e.target.value})} placeholder="5511999999999" />
                      </div>
                      <div className="space-y-2">
                        <label className="app-label">E-mail</label>
                        <input type="email" className="app-input" value={athleteForm.email} onChange={e => setAthleteForm({...athleteForm, email: e.target.value})} placeholder="exemplo@email.com" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCreateAthlete}
                    disabled={isProcessing}
                    className="app-button-energy w-full py-5 text-lg"
                  >
                    {isProcessing ? "PROCESSANDO..." : "CONCLUIR CADASTRO"} <ChevronRight size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="app-card p-8 bg-app-accent/5 border-app-accent/20 space-y-8">
                     <h4 className="font-bold text-lg flex items-center gap-2">
                        <Info size={18} className="text-app-accent" /> Estimativas em Tempo Real
                     </h4>
                     
                     <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-app-border pb-4">
                          <span className="app-label">IMC</span>
                          <div className="text-right">
                            <p className="text-3xl font-black">{metabolics.imc > 0 ? metabolics.imc.toFixed(1) : '--'}</p>
                            <p className="text-[10px] font-bold text-app-energy">{metabolics.imcClass}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-end border-b border-app-border pb-4">
                          <span className="app-label">Gasto Basal</span>
                          <p className="text-3xl font-black">{metabolics.tmb > 0 ? Math.round(metabolics.tmb) : '--'} <span className="text-xs text-app-muted">kcal</span></p>
                        </div>

                        <div className="flex justify-between items-end">
                          <span className="app-label">Gasto Total (GET)</span>
                          <p className="text-3xl font-black text-app-accent">{metabolics.get > 0 ? Math.round(metabolics.get) : '--'} <span className="text-xs text-app-muted">kcal</span></p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'hub' && currentAthlete && (
            <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AthleteHub 
                athlete={currentAthlete}
                onAddWorkout={() => startNewProtocol('workout')}
                onAddDiet={() => startNewProtocol('diet')}
                onEditProtocol={(type, id) => {
                  setEditId(id);
                  if (type === 'workout') {
                    setCustomWorkout(state.workoutTemplates.find(w => w.id === id) || { exercises: [] });
                    setView('workout-builder');
                  } else {
                    setCustomDiet(state.dietTemplates.find(d => d.id === id) || { meals: [] });
                    setView('diet-builder');
                  }
                }}
                onDuplicateProtocol={handleDuplicate}
                onExportPDF={() => window.print()}
                onBack={() => setView('selection')}
              />
            </motion.div>
          )}

          {view === 'workout-builder' && currentAthlete && (
            <motion.div key="workout-builder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="app-heading text-2xl font-black uppercase tracking-tight">Prescrição de Treinamento</h2>
                  <span className="px-4 py-1 bg-app-accent/10 text-app-accent rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">{currentAthlete.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setView('hub')} className="app-button-outline !py-2 !px-4 !text-[10px] font-bold">CANCELAR</button>
                  <button onClick={() => handleSaveWorkout({ ...customWorkout, id: editId || uuidv4(), athleteId: currentAthlete.id } as any)} className="app-button-primary !py-2 !px-6 !text-[10px] font-bold shadow-glow-accent">SALVAR TREINO</button>
                </div>
              </div>
              <WorkoutBuilder 
                template={customWorkout} 
                onChange={setCustomWorkout} 
                otherWorkouts={state.workoutTemplates.filter(w => w.athleteId !== currentAthlete.id)}
              />
              <div className="flex justify-between mt-10">
                <button onClick={() => setView('hub')} className="app-button-outline">CANCELAR</button>
                <button onClick={() => handleSaveWorkout({ ...customWorkout, id: editId || uuidv4(), athleteId: currentAthlete.id } as any)} className="app-button-primary">SALVAR TREINO</button>
              </div>
            </motion.div>
          )}

          {view === 'diet-builder' && currentAthlete && (
            <motion.div key="diet-builder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="app-heading text-2xl font-black uppercase tracking-tight">Planejamento Nutricional</h2>
                  <span className="px-4 py-1 bg-app-energy/10 text-app-energy rounded-full text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">{currentAthlete.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setView('hub')} className="app-button-outline !py-2 !px-4 !text-[10px] font-bold">CANCELAR</button>
                  <button onClick={() => handleSaveDiet({ ...customDiet, id: editId || uuidv4(), athleteId: currentAthlete.id } as any)} className="app-button-energy !py-2 !px-6 !text-[10px] font-bold shadow-glow-energy">SALVAR DIETA</button>
                </div>
              </div>
              <DietBuilder template={customDiet} onChange={setCustomDiet} />
              <div className="flex justify-between mt-10">
                <button onClick={() => setView('hub')} className="app-button-outline">CANCELAR</button>
                <button onClick={() => handleSaveDiet({ ...customDiet, id: editId || uuidv4(), athleteId: currentAthlete.id } as any)} className="app-button-energy">SALVAR DIETA</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Printable Area */}
      <div className="hidden print:block w-full bg-white text-black p-8">
        <WorkoutExporter 
          athlete={currentAthlete || ({} as Athlete)}
          workouts={currentAthlete ? state.workoutTemplates.filter(w => w.athleteId === currentAthlete.id) : undefined}
          diet={currentAthlete ? state.dietTemplates.find(d => d.athleteId === currentAthlete.id) : undefined}
        />
      </div>
    </div>
  );
}
