"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Dumbbell, Utensils, Save, CheckCircle, X, ChevronRight } from 'lucide-react';
import WorkoutBuilder from '../builders/WorkoutBuilder';
import DietBuilder from '../builders/DietBuilder';
import ShoppingListExporter from '../builders/ShoppingListExporter';
import WorkoutExporter from '../builders/WorkoutExporter';
import clsx from 'clsx';
import { Athlete, WorkoutTemplate, DietTemplate } from '@/types';

type CreationType = 'both' | 'workout' | 'diet' | null;

export default function DashboardTab() {
  const { state, saveAthlete, saveWorkoutTemplate, saveDietTemplate } = useAppContext();
  const [step, setStep] = useState(1);
  const [creationType, setCreationType] = useState<CreationType>(null);
  const [modal, setModal] = useState<{ type: 'alert' | null, message: string }>({ type: null, message: '' });
  
  const [selectedWorkoutTemplateId, setSelectedWorkoutTemplateId] = useState<string>('');
  const [selectedDietTemplateId, setSelectedDietTemplateId] = useState<string>('');

  const [customWorkout, setCustomWorkout] = useState<Partial<WorkoutTemplate>>({ exercises: [] });
  const [customDiet, setCustomDiet] = useState<Partial<DietTemplate>>({ meals: [] });
  const [isProcessing, setIsProcessing] = useState(false);

  // Athlete Form State
  const [athlete, setAthlete] = useState<Partial<Athlete>>({
    id: '',
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
    category: 'Online'
  });

  // Metabolic Calculations
  const [imc, setImc] = useState(0);
  const [tmb, setTmb] = useState(0);
  const [get, setGet] = useState(0);
  const [imcClass, setImcClass] = useState('');

  // Reset session on mount
  useEffect(() => {
    resetSession();
  }, []);

  // Calculate metabolics when inputs change
  useEffect(() => {
    if (athlete.weight && athlete.height && athlete.age && athlete.gender) {
      const w = Number(athlete.weight);
      const h = Number(athlete.height) / 100; // cm to m
      const a = Number(athlete.age);
      
      if (h > 0) {
        const calculatedImc = w / (h * h);
        setImc(calculatedImc);
        
        if (calculatedImc < 18.5) setImcClass('Abaixo do Peso');
        else if (calculatedImc < 24.9) setImcClass('Peso Normal');
        else if (calculatedImc < 29.9) setImcClass('Sobrepeso');
        else setImcClass('Obesidade');
      }

      // Harris-Benedict
      let calculatedTmb = 0;
      if (athlete.gender === 'M') {
        calculatedTmb = 88.362 + (13.397 * w) + (4.799 * (h * 100)) - (5.677 * a);
      } else {
        calculatedTmb = 447.593 + (9.247 * w) + (3.098 * (h * 100)) - (4.330 * a);
      }
      setTmb(calculatedTmb);
      
      const calculatedGet = calculatedTmb * (athlete.activityLevel || 1.2);
      setGet(calculatedGet);
    }
  }, [athlete.weight, athlete.height, athlete.age, athlete.gender, athlete.activityLevel]);

  const resetSession = () => {
    setStep(1);
    setCreationType(null);
    setSelectedWorkoutTemplateId('');
    setSelectedDietTemplateId('');
    setAthlete({
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
  };

  const handleSaveProfileOnly = () => {
    if (!athlete.name) return setModal({ type: 'alert', message: 'Nome é obrigatório' });
    saveAthlete(athlete as Athlete);
    resetSession();
    setModal({ type: 'alert', message: 'Perfil salvo com sucesso!' });
  };

  const handleFinalizeProtocol = () => {
    if (!athlete.name) return setModal({ type: 'alert', message: 'Nome do atleta é obrigatório para finalizar o protocolo.' });
    
    const athleteData = { ...athlete } as Athlete;
    
    // 1. Save Workout to Global & Athlete if exists
    if (creationType === 'workout' || creationType === 'both') {
      const workoutRepo = { 
        ...customWorkout, 
        id: uuidv4(), 
        name: `TREINO_${athlete.name.toUpperCase()}`,
        description: `GERADO_VIA_DASHBOARD_${new Date().toLocaleDateString()}`
      } as WorkoutTemplate;
      saveWorkoutTemplate(workoutRepo);
      athleteData.workoutTemplateId = workoutRepo.id;
    }

    // 2. Save Diet to Global & Athlete if exists
    if (creationType === 'diet' || creationType === 'both') {
      const dietRepo = { 
        ...customDiet, 
        id: uuidv4(), 
        name: `DIETA_${athlete.name.toUpperCase()}`,
        description: `GERADA_VIA_DASHBOARD_${new Date().toLocaleDateString()}`
      } as DietTemplate;
      saveDietTemplate(dietRepo);
      athleteData.dietTemplateId = dietRepo.id;
    }

    // 3. Save Final Athlete with vinculated IDs
    saveAthlete(athleteData);
    setStep(4);
  };

  const handleExportPDF = () => {
    try {
      window.print();
    } catch {
      setModal({ type: 'alert', message: 'A impressão foi bloqueada. Por favor, abra o aplicativo em uma nova aba para exportar o PDF.' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full relative print:block print:h-auto">
      <AnimatePresence>
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
                <h3 className="tech-heading text-lg text-white">AVISO_SISTEMA</h3>
                <button onClick={() => setModal({ type: null, message: '' })} className="text-[#607080] hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-[#808090] font-mono text-sm">{modal.message}</p>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setModal({ type: null, message: '' })}
                  className="tech-button"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Wizard Area */}
      <div className="flex-1 flex flex-col gap-6 print:hidden">
        <div className="bg-[#050505] border border-[#001F3F] p-6 rounded-sm shadow-[0_0_20px_rgba(0,31,63,0.3)]">
          <h2 className="tech-heading text-2xl text-white mb-2 tracking-tighter">ASSISTENTE_CRIACAO_v2.0</h2>
          <p className="tech-label text-[#004080]">CONFIGURAR_NOVO_PROTOCOLO</p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mt-8 mb-4 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#001F3F] -z-10"></div>
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={clsx(
                "w-8 h-8 rounded-sm flex items-center justify-center font-mono text-xs border transition-all",
                step >= s ? "bg-[#001F3F] border-[#004080] text-white shadow-[0_0_10px_rgba(0,31,63,0.5)]" : "bg-[#050505] border-[#001F3F] text-[#607080]"
              )}>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#050505] border border-[#001F3F] p-6 flex-1 overflow-y-auto rounded-sm relative">
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-16 h-16 border-4 border-t-[#004080] border-r-transparent border-b-[#004080] border-l-transparent rounded-full animate-spin mb-4" />
                <h3 className="tech-heading text-white text-lg animate-pulse tracking-widest">INITIALIZING_MODULE...</h3>
                <p className="font-mono text-[10px] text-[#004080] mt-2">ACCESSING_KERNEL_v2.0_ENGINE</p>
              </motion.div>
            )}
          </AnimatePresence>
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="tech-heading text-xl text-white border-b border-[#001F3F] pb-2">01. PERFIL_ATLETA</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="tech-label block mb-1">Nome Completo</label>
                  <input type="text" className="tech-input" value={athlete.name} onChange={e => setAthlete({...athlete, name: e.target.value})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Email</label>
                  <input type="email" className="tech-input" value={athlete.email} onChange={e => setAthlete({...athlete, email: e.target.value})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">WhatsApp</label>
                  <input type="tel" className="tech-input" value={athlete.whatsapp} onChange={e => setAthlete({...athlete, whatsapp: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="tech-label block mb-1">Status</label>
                    <select className="tech-input" value={athlete.status} onChange={e => setAthlete({...athlete, status: e.target.value as 'Ativo' | 'Inativo' | 'Pendente'})}>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                  </div>
                  <div>
                    <label className="tech-label block mb-1">Categoria</label>
                    <select className="tech-input" value={athlete.category} onChange={e => setAthlete({...athlete, category: e.target.value as 'Online' | 'Presencial'})}>
                      <option value="Online">Online</option>
                      <option value="Presencial">Presencial</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-[#334155]">
                <div>
                  <label className="tech-label block mb-1">Peso (kg)</label>
                  <input type="number" className="tech-input" value={athlete.weight || ''} onChange={e => setAthlete({...athlete, weight: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Altura (cm)</label>
                  <input type="number" className="tech-input" value={athlete.height || ''} onChange={e => setAthlete({...athlete, height: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Idade</label>
                  <input type="number" className="tech-input" value={athlete.age || ''} onChange={e => setAthlete({...athlete, age: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="tech-label block mb-1">Gênero</label>
                  <select className="tech-input" value={athlete.gender} onChange={e => setAthlete({...athlete, gender: e.target.value as 'M' | 'F'})}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="tech-label block mb-1">Objetivo</label>
                  <select className="tech-input" value={athlete.goal} onChange={e => setAthlete({...athlete, goal: e.target.value})}>
                    <option value="hypertrophy">Hipertrofia</option>
                    <option value="weight_loss">Emagrecimento</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-[#001F3F]">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="tech-label text-[#004080]">GEN_DIRECT_INITIALIZER</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => {
                      setCreationType('workout');
                      setStep(2);
                    }}
                    className="p-8 border border-[#001F3F] rounded-sm flex flex-col items-center gap-4 transition-all group relative overflow-hidden bg-[#001F3F]/5 hover:border-[#004080] hover:bg-[#001F3F]/10"
                  >
                    <Dumbbell size={32} className="text-[#004080] group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <span className="font-mono uppercase tracking-[0.2em] text-xs text-white font-bold block">INICIAR_TREINO_MASTER</span>
                      <span className="text-[9px] text-[#607080] font-mono mt-1 block">VINCULAR_AUTO_AO_ALUNO</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setCreationType('diet');
                      setStep(3);
                    }}
                    className="p-8 border border-[#001F3F] rounded-sm flex flex-col items-center gap-4 transition-all group relative overflow-hidden bg-[#001F3F]/5 hover:border-[#004080] hover:bg-[#001F3F]/10"
                  >
                    <Utensils size={32} className="text-[#004080] group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <span className="font-mono uppercase tracking-[0.2em] text-xs text-white font-bold block">INICIAR_DIETA_MASTER</span>
                      <span className="text-[9px] text-[#607080] font-mono mt-1 block">VINCULAR_AUTO_AO_ALUNO</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button onClick={handleSaveProfileOnly} className="tech-button-secondary">
                  <Save size={18} /> Salvar Apenas Perfil
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#001F3F] pb-2">
                <h3 className="tech-heading text-xl text-white uppercase italic">02. GEN_PROTOCOL_WORKOUT_v2</h3>
                <div className="text-[10px] font-mono text-[#004080] animate-pulse">MASTER_PROMPT_ACTIVE</div>
              </div>
              
              <div className="bg-black/40 border border-[#001F3F] p-4 rounded-sm shadow-[inset_0_0_20px_rgba(0,31,63,0.2)]">
                <WorkoutBuilder template={customWorkout} onChange={setCustomWorkout} />
              </div>

              <div className="flex justify-between pt-6 border-t border-[#001F3F]">
                <button onClick={() => setStep(1)} className="tech-button-secondary py-2 px-6">
                  VOLTAR
                </button>
                <button onClick={handleFinalizeProtocol} className="tech-button py-2 px-8">
                  FINALIZAR_&_SALVAR <CheckCircle size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#001F3F] pb-2">
                <h3 className="tech-heading text-xl text-white uppercase italic">03. GEN_PROTOCOL_NUTRITION_v2</h3>
                <div className="text-[10px] font-mono text-[#004080] animate-pulse">MASTER_PROMPT_ACTIVE</div>
              </div>

              <div className="bg-black/40 border border-[#001F3F] p-4 rounded-sm shadow-[inset_0_0_20px_rgba(0,31,63,0.2)]">
                <DietBuilder template={customDiet} onChange={setCustomDiet} />
              </div>

              <div className="flex justify-between pt-6 border-t border-[#001F3F]">
                <button onClick={() => setStep(creationType === 'both' ? 2 : 1)} className="tech-button-secondary py-2 px-6">
                  VOLTAR
                </button>
                <button onClick={handleFinalizeProtocol} className="tech-button py-2 px-8">
                  FINALIZAR_&_SALVAR <CheckCircle size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="tech-heading text-xl text-white border-b border-[#001F3F] pb-2">04. FINALIZAR_PROTOCOLO</h3>
              
              <div className="bg-[#050505] p-6 rounded-sm border border-[#004080] shadow-[0_0_20px_rgba(0,64,128,0.1)]">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="text-[#004080]" size={32} />
                  <div>
                    <h4 className="tech-heading text-lg text-white uppercase">SUCCESS_PROTO_GEN</h4>
                    <p className="tech-label text-[#004080]">Atleta: {athlete.name}</p>
                  </div>
                </div>
                
                <div className="mb-6 space-y-2">
                  {selectedWorkoutTemplateId && (
                    <p className="text-sm text-white"><strong className="text-[#808090]">Treino:</strong> {state.workoutTemplates.find(t => t.id === selectedWorkoutTemplateId)?.name}</p>
                  )}
                  {selectedDietTemplateId && (
                    <p className="text-sm text-white"><strong className="text-[#808090]">Dieta:</strong> {state.dietTemplates.find(t => t.id === selectedDietTemplateId)?.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex gap-4 print:hidden">
                    <button onClick={handleExportPDF} className="tech-button flex-1">Exportar PDF</button>
                    <button onClick={resetSession} className="tech-button-secondary flex-1">Novo Protocolo</button>
                  </div>
                  <ShoppingListExporter diet={customDiet} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Metabolic Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 print:hidden">
        <div className="bg-[#050505] border border-[#001F3F] p-6 h-full rounded-sm shadow-[0_0_30px_rgba(0,31,63,0.2)]">
          <h3 className="tech-heading text-sm text-white border-b border-[#001F3F] pb-4 mb-6 flex items-center gap-2 tracking-[0.2em]">
            <Activity size={18} className="text-[#004080]" />
            METRIC_ENGINE_v2.0
          </h3>

          <div className="space-y-6">
            <div className="bg-[#050505] p-4 border border-[#001F3F] rounded-sm shadow-[inset_0_0_15px_rgba(0,31,63,0.1)]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-[#607080] font-mono uppercase tracking-widest">IMC_INDEX</span>
                <span className="font-mono text-2xl text-white">{imc > 0 ? imc.toFixed(1) : '--'}</span>
              </div>
              {imcClass && (
                <div className={clsx(
                  "text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-sm border inline-block",
                  imcClass === 'Peso Normal' ? "border-green-500/30 text-green-400 bg-green-500/5" : 
                  imcClass === 'Abaixo do Peso' ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/5" : 
                  "border-red-500/30 text-red-400 bg-red-500/5"
                )}>
                  {imcClass}
                </div>
              )}
            </div>

            <div className="bg-[#050505] p-4 border border-[#001F3F] rounded-sm shadow-[inset_0_0_15px_rgba(0,31,63,0.1)]">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-[#607080] font-mono uppercase tracking-widest">TMB_BASAL</span>
                <span className="font-mono text-2xl text-white">{tmb > 0 ? Math.round(tmb) : '--'} <span className="text-[10px] text-[#607080]">KCAL</span></span>
              </div>
            </div>

            <div className="bg-[#050505] p-4 border border-[#001F3F] rounded-sm shadow-[inset_0_0_15px_rgba(0,31,63,0.1)]">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-[#607080] font-mono uppercase tracking-widest">GET_TOTAL</span>
                <span className="font-mono text-2xl text-white">{get > 0 ? Math.round(get) : '--'} <span className="text-[10px] text-[#607080]">KCAL</span></span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#001F3F]">
              <label className="tech-label block mb-2">Fator de Atividade</label>
              <select 
                className="tech-input" 
                value={athlete.activityLevel} 
                onChange={e => setAthlete({...athlete, activityLevel: Number(e.target.value)})}
              >
                <option value={1.2}>Sedentário (1.2)</option>
                <option value={1.375}>Leve (1.375)</option>
                <option value={1.55}>Moderado (1.55)</option>
                <option value={1.725}>Intenso (1.725)</option>
                <option value={1.9}>Muito Intenso (1.9)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Area */}
      <div className="hidden print:block w-full bg-white text-black p-8">
        <WorkoutExporter 
          athlete={athlete}
          workout={creationType === 'workout' || creationType === 'both' ? customWorkout : undefined}
          diet={creationType === 'diet' || creationType === 'both' ? customDiet : undefined}
        />
      </div>
    </div>
  );
}
