"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Dumbbell, Utensils, Save, CheckCircle, X, ChevronRight, UserPlus, Info } from 'lucide-react';
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

  const handleSaveProfileOnly = async () => {
    if (!athlete.name) return setModal({ type: 'alert', message: 'Por favor, insira o nome do aluno.' });
    setIsProcessing(true);
    await saveAthlete(athlete as Athlete);
    resetSession();
    setIsProcessing(false);
    setModal({ type: 'alert', message: 'Aluno cadastrado com sucesso!' });
  };

  const handleFinalizeProtocol = async () => {
    if (!athlete.name) return setModal({ type: 'alert', message: 'O nome do aluno é obrigatório para gerar o protocolo.' });
    
    setIsProcessing(true);
    const athleteData = { ...athlete } as Athlete;
    
    if (creationType === 'workout' || creationType === 'both') {
      const workoutRepo = { 
        ...customWorkout, 
        id: uuidv4(), 
        name: `Treino: ${athlete.name}`,
        description: `Prescrição gerada em ${new Date().toLocaleDateString()}`
      } as WorkoutTemplate;
      await saveWorkoutTemplate(workoutRepo);
      athleteData.workoutTemplateId = workoutRepo.id;
    }

    if (creationType === 'diet' || creationType === 'both') {
      const dietRepo = { 
        ...customDiet, 
        id: uuidv4(), 
        name: `Dieta: ${athlete.name}`,
        description: `Plano alimentar gerado em ${new Date().toLocaleDateString()}`
      } as DietTemplate;
      await saveDietTemplate(dietRepo);
      athleteData.dietTemplateId = dietRepo.id;
    }

    await saveAthlete(athleteData);
    setIsProcessing(false);
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

      {/* Main Flow Area */}
      <div className="flex-1 flex flex-col gap-8 print:hidden">
        <div className="app-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
          <div className="relative z-10">
            <h2 className="app-heading text-3xl mb-1">Criar Novo Plano</h2>
            <p className="text-app-accent font-bold text-sm tracking-wide uppercase">Assistente de Prescrição Elite</p>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex items-center gap-3 relative z-10">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all border-2",
                step === s ? "bg-app-accent border-app-accent text-white shadow-lg shadow-app-accent/30 scale-110" : 
                step > s ? "bg-app-success/10 border-app-success text-app-success" : 
                "bg-transparent border-app-border text-app-muted"
              )}>
                {step > s ? <CheckCircle size={18} /> : s}
              </div>
            ))}
          </div>

          <div className="absolute -right-10 -top-10 w-40 h-40 bg-app-accent/5 rounded-full blur-3xl group-hover:bg-app-accent/10 transition-colors" />
        </div>

        <div className="bg-[#050505] border border-[#001F3F] p-6 flex-1 overflow-y-auto rounded-sm relative">
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-app-card/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-12 h-12 border-4 border-app-accent/20 border-t-app-accent rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-bold animate-pulse">Sincronizando Dados...</h3>
                <p className="text-app-muted text-sm mt-2 max-w-xs">Salvando informações no banco de dados de alto desempenho.</p>
              </motion.div>
            )}
          </AnimatePresence>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center gap-3 border-b border-app-border pb-4">
                <div className="p-2 bg-app-accent/10 rounded-lg text-app-accent">
                  <UserPlus size={24} />
                </div>
                <h3 className="app-heading text-xl">Perfil do Aluno</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="app-label">Nome Completo</label>
                  <input type="text" placeholder="Ex: João Silva" className="app-input" value={athlete.name} onChange={e => setAthlete({...athlete, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">E-mail de Contato</label>
                  <input type="email" placeholder="email@exemplo.com" className="app-input" value={athlete.email} onChange={e => setAthlete({...athlete, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">WhatsApp (Nativo)</label>
                  <input type="tel" placeholder="(00) 00000-0000" className="app-input" value={athlete.whatsapp} onChange={e => setAthlete({...athlete, whatsapp: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="app-label">Status do Plano</label>
                    <select className="app-input" value={athlete.status} onChange={e => setAthlete({...athlete, status: e.target.value as any})}>
                      <option value="Ativo">✅ Ativo</option>
                      <option value="Inativo">❌ Inativo</option>
                      <option value="Pendente">⏳ Pendente</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="app-label">Acompanhamento</label>
                    <select className="app-input" value={athlete.category} onChange={e => setAthlete({...athlete, category: e.target.value as any})}>
                      <option value="Online">🌐 Online</option>
                      <option value="Presencial">🏋️ Presencial</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-8 border-t border-app-border">
                <div className="space-y-2">
                  <label className="app-label">Peso (kg)</label>
                  <input type="number" className="app-input text-center font-bold" value={athlete.weight || ''} onChange={e => setAthlete({...athlete, weight: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">Altura (cm)</label>
                  <input type="number" className="app-input text-center font-bold" value={athlete.height || ''} onChange={e => setAthlete({...athlete, height: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">Idade</label>
                  <input type="number" className="app-input text-center font-bold" value={athlete.age || ''} onChange={e => setAthlete({...athlete, age: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="app-label">Sexo</label>
                  <select className="app-input" value={athlete.gender} onChange={e => setAthlete({...athlete, gender: e.target.value as any})}>
                    <option value="M">Masc.</option>
                    <option value="F">Fem.</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="app-label">Objetivo</label>
                  <select className="app-input" value={athlete.goal} onChange={e => setAthlete({...athlete, goal: e.target.value})}>
                    <option value="hypertrophy">Hipertrofia</option>
                    <option value="weight_loss">Definição</option>
                    <option value="maintenance">Saúde</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-10 border-t border-app-border">
                <button 
                  onClick={() => { setCreationType('workout'); setStep(2); }}
                  className="flex-1 p-8 rounded-2xl border-2 border-app-border bg-app-card hover:border-app-accent hover:bg-app-accent/5 transition-all group text-center flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-app-accent/10 flex items-center justify-center text-app-accent group-hover:scale-110 transition-transform">
                    <Dumbbell size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Montar Treino</h4>
                    <p className="text-app-muted text-xs">Prescrever rotina de exercícios</p>
                  </div>
                </button>

                <button 
                  onClick={() => { setCreationType('diet'); setStep(3); }}
                  className="flex-1 p-8 rounded-2xl border-2 border-app-border bg-app-card hover:border-app-success hover:bg-app-success/5 transition-all group text-center flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-app-success/10 flex items-center justify-center text-app-success group-hover:scale-110 transition-transform">
                    <Utensils size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Criar Dieta</h4>
                    <p className="text-app-muted text-xs">Planejamento alimentar reativo</p>
                  </div>
                </button>
              </div>

              <div className="flex justify-center pt-6">
                <button onClick={handleSaveProfileOnly} className="app-button-outline px-12">
                  <Save size={20} className="mr-2" /> Salvar Apenas Perfil
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex justify-between items-center border-b border-app-border pb-4">
                <h3 className="app-heading text-xl">02. Prescrever Treinamento</h3>
                <div className="px-3 py-1 bg-app-accent/10 text-app-accent rounded-full text-[10px] font-bold tracking-widest uppercase">Editor Premium</div>
              </div>
              <WorkoutBuilder template={customWorkout} onChange={setCustomWorkout} />
              <div className="flex justify-between pt-8 border-t border-app-border">
                <button onClick={() => setStep(1)} className="app-button-outline px-8">VOLTAR</button>
                <button onClick={handleFinalizeProtocol} className="app-button-primary px-10">
                  FINALIZAR PLANO <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex justify-between items-center border-b border-app-border pb-4">
                <h3 className="app-heading text-xl">03. Planejamento Alimentar</h3>
                <div className="px-3 py-1 bg-app-success/10 text-app-success rounded-full text-[10px] font-bold tracking-widest uppercase">Nutri Master</div>
              </div>
              <DietBuilder template={customDiet} onChange={setCustomDiet} />
              <div className="flex justify-between pt-8 border-t border-app-border">
                <button onClick={() => setStep(1)} className="app-button-outline px-8">VOLTAR</button>
                <button onClick={handleFinalizeProtocol} className="app-button-success px-10">
                  FINALIZAR PLANO <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center space-y-8">
              <div className="w-24 h-24 rounded-full bg-app-success/20 flex items-center justify-center text-app-success shadow-glow-success">
                <CheckCircle size={56} />
              </div>
              <div className="space-y-2">
                <h2 className="app-heading text-3xl">Protocolo Finalizado!</h2>
                <p className="text-app-muted">O plano de {athlete.name} foi salvo com sucesso em seu CRM.</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <button onClick={handleExportPDF} className="app-button-primary flex-1">
                  Gerar PDF Premium
                </button>
                <button onClick={resetSession} className="app-button-outline flex-1">
                  Novo Cadastro
                </button>
              </div>

              <ShoppingListExporter diet={customDiet} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Metabolic Feedback Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-8 print:hidden">
        <div className="app-card p-8 flex flex-col h-full overflow-hidden relative">
          <div className="flex items-center gap-3 border-b border-app-border pb-4 mb-4">
            <div className="p-2 bg-app-accent/10 rounded-lg text-app-accent">
              <Activity size={20} />
            </div>
            <h3 className="app-heading text-base uppercase tracking-wider">Calculadora Metabólica</h3>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-3">
               <div className="flex justify-between items-baseline">
                <span className="app-label">IMC</span>
                <span className="text-3xl font-black">{imc > 0 ? imc.toFixed(1) : '--'}</span>
              </div>
              {imcClass && (
                <div className={clsx(
                  "py-2 px-4 rounded-xl text-xs font-bold transition-all border inline-block",
                  imcClass === 'Peso Normal' ? "border-app-success/30 text-app-success bg-app-success/5" : 
                  imcClass === 'Abaixo do Peso' ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5" : 
                  "border-red-500/30 text-red-500 bg-red-500/5"
                )}>
                  {imcClass}
                </div>
              )}
            </div>

            <div className="h-px bg-app-border w-full" />

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="app-label">TMB Basal</span>
                <span className="text-3xl font-black tracking-tight">{tmb > 0 ? Math.round(tmb) : '--'} <span className="text-xs text-app-muted font-normal ml-1">Kcal</span></span>
              </div>
            </div>

            <div className="space-y-4 pt-6 bg-app-accent/5 rounded-2xl p-6 border border-app-accent/10">
              <div className="flex justify-between items-baseline">
                <span className="app-label text-app-accent">GET Total</span>
                <span className="text-4xl font-black text-app-accent tracking-tighter">{get > 0 ? Math.round(get) : '--'} <span className="text-sm font-normal ml-1">Kcal</span></span>
              </div>
              <div className="space-y-2">
                <label className="app-label">Nível de Atividade</label>
                <select 
                  className="app-input border-app-accent/20 bg-app-bg text-sm" 
                  value={athlete.activityLevel} 
                  onChange={e => setAthlete({...athlete, activityLevel: Number(e.target.value)})}
                >
                  <option value={1.2}>Sedentário (1.2)</option>
                  <option value={1.375}>Leve (1.375)</option>
                  <option value={1.55}>Moderado (1.55)</option>
                  <option value={1.725}>Intenso (1.725)</option>
                  <option value={1.9}>Atleta (1.9)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-app-card border border-app-border rounded-xl">
             <div className="flex items-start gap-3">
               <span className="text-app-accent mt-0.5 shrink-0">ℹ️</span>
               <p className="text-[10px] text-app-muted leading-relaxed">
                 Cálculos via Harris-Benedict. Estritamente informativo.
               </p>
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
