"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Dumbbell, Utensils, Save, CheckCircle, X, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Athlete } from '@/types';

type CreationType = 'both' | 'workout' | 'diet' | null;

export default function DashboardTab() {
  const { state, saveAthlete } = useAppContext();
  const [step, setStep] = useState(1);
  const [creationType, setCreationType] = useState<CreationType>(null);
  const [modal, setModal] = useState<{ type: 'alert' | null, message: string }>({ type: null, message: '' });
  
  const [selectedWorkoutTemplateId, setSelectedWorkoutTemplateId] = useState<string>('');
  const [selectedDietTemplateId, setSelectedDietTemplateId] = useState<string>('');

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

  const handleNextStep = () => {
    if (step === 1) {
      if (!athlete.name) return setModal({ type: 'alert', message: 'Nome é obrigatório' });
      if (!creationType) return setModal({ type: 'alert', message: 'Selecione o que deseja montar' });
      
      // Eager saving
      saveAthlete(athlete as Athlete);
      
      if (creationType === 'diet') setStep(3);
      else setStep(2);
    } else if (step === 2) {
      if (creationType === 'both') setStep(3);
      else setStep(4);
    } else if (step === 3) {
      setStep(4);
    }
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
              <div className="flex justify-between items-center border-b border-[#334155] pb-2">
                <h3 className="tech-heading text-lg text-white">Aviso</h3>
                <button onClick={() => setModal({ type: null, message: '' })} className="text-[#808090] hover:text-white">
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
        <div className="glass-panel hardware-card p-6">
          <h2 className="tech-heading text-2xl text-[#3b82f6] mb-2">Assistente de Criação</h2>
          <p className="tech-label">Configure um novo protocolo para o atleta</p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mt-8 mb-4 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#334155] -z-10"></div>
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm border-2 transition-colors",
                step >= s ? "bg-[#3b82f6] border-[#3b82f6] text-white" : "bg-[#0f172a] border-[#334155] text-[#808090]"
              )}>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel hardware-card p-6 flex-1 overflow-y-auto">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="tech-heading text-xl text-white border-b border-[#334155] pb-2">1. Perfil do Atleta</h3>
              
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

              <div className="pt-6 border-t border-[#334155]">
                <h4 className="tech-label mb-4">O que vamos montar?</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setCreationType('both')}
                    className={clsx("p-4 border rounded-xl flex flex-col items-center gap-2 transition-all", creationType === 'both' ? "border-[#3b82f6] bg-[rgba(59,130,246,0.1)] text-[#3b82f6]" : "border-[#334155] text-[#808090] hover:border-[#808090]")}
                  >
                    <div className="flex gap-2"><Dumbbell size={24} /><Utensils size={24} /></div>
                    <span className="font-mono uppercase tracking-wider text-xs">Treino & Dieta</span>
                  </button>
                  <button 
                    onClick={() => setCreationType('workout')}
                    className={clsx("p-4 border rounded-xl flex flex-col items-center gap-2 transition-all", creationType === 'workout' ? "border-[#3b82f6] bg-[rgba(59,130,246,0.1)] text-[#3b82f6]" : "border-[#334155] text-[#808090] hover:border-[#808090]")}
                  >
                    <Dumbbell size={24} />
                    <span className="font-mono uppercase tracking-wider text-xs">Apenas Treino</span>
                  </button>
                  <button 
                    onClick={() => setCreationType('diet')}
                    className={clsx("p-4 border rounded-xl flex flex-col items-center gap-2 transition-all", creationType === 'diet' ? "border-[#3b82f6] bg-[rgba(59,130,246,0.1)] text-[#3b82f6]" : "border-[#334155] text-[#808090] hover:border-[#808090]")}
                  >
                    <Utensils size={24} />
                    <span className="font-mono uppercase tracking-wider text-xs">Apenas Dieta</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button onClick={handleSaveProfileOnly} className="tech-button-secondary">
                  <Save size={18} /> Salvar Apenas Perfil
                </button>
                <button onClick={handleNextStep} disabled={!creationType} className="tech-button">
                  Avançar <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="tech-heading text-xl text-white border-b border-[#334155] pb-2">2. Configuração de Treino</h3>
              <p className="text-[#808090] font-mono text-sm">Selecione um modelo ou crie do zero.</p>
              
              <div>
                <label className="tech-label block mb-1">Aplicar Modelo de Treino</label>
                <select 
                  className="tech-input"
                  value={selectedWorkoutTemplateId}
                  onChange={e => setSelectedWorkoutTemplateId(e.target.value)}
                >
                  <option value="">-- Selecionar Modelo --</option>
                  {state.workoutTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="h-64 border border-dashed border-[#334155] rounded-xl flex items-center justify-center text-[#808090] font-mono text-sm">
                Área de construção de treino (Em desenvolvimento)
              </div>

              <div className="flex justify-between pt-6">
                <button onClick={() => setStep(1)} className="tech-button-secondary">Voltar</button>
                <button onClick={handleNextStep} className="tech-button">Avançar <ChevronRight size={18} /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="tech-heading text-xl text-white border-b border-[#334155] pb-2">3. Configuração de Dieta</h3>
              <p className="text-[#808090] font-mono text-sm">Selecione um modelo ou crie do zero.</p>
              
              <div>
                <label className="tech-label block mb-1">Aplicar Modelo de Dieta</label>
                <select 
                  className="tech-input"
                  value={selectedDietTemplateId}
                  onChange={e => setSelectedDietTemplateId(e.target.value)}
                >
                  <option value="">-- Selecionar Modelo --</option>
                  {state.dietTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="h-64 border border-dashed border-[#334155] rounded-xl flex items-center justify-center text-[#808090] font-mono text-sm">
                Área de construção de dieta (Em desenvolvimento)
              </div>

              <div className="flex justify-between pt-6">
                <button onClick={() => setStep(creationType === 'both' ? 2 : 1)} className="tech-button-secondary">Voltar</button>
                <button onClick={handleNextStep} className="tech-button">Avançar <ChevronRight size={18} /></button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="tech-heading text-xl text-white border-b border-[#334155] pb-2">4. Revisar e Exportar</h3>
              
              <div className="bg-[#1e293b] p-6 rounded-xl border border-[#3b82f6]">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="text-[#3b82f6]" size={32} />
                  <div>
                    <h4 className="tech-heading text-lg text-white">Protocolo Pronto</h4>
                    <p className="tech-label text-[#3b82f6]">Atleta: {athlete.name}</p>
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

                <p className="text-[#808090] font-mono text-sm mb-6">
                  Os dados foram salvos localmente. Você pode exportar o PDF agora ou voltar ao Dashboard.
                </p>
                <div className="flex gap-4 print:hidden">
                  <button onClick={handleExportPDF} className="tech-button flex-1">Exportar PDF</button>
                  <button onClick={resetSession} className="tech-button-secondary flex-1">Novo Protocolo</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Metabolic Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 print:hidden">
        <div className="glass-panel hardware-card p-6 h-full">
          <h3 className="tech-heading text-lg text-white border-b border-[#334155] pb-2 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-[#3b82f6]" />
            Dados Metabólicos
          </h3>

          <div className="space-y-6">
            <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155]">
              <div className="flex justify-between items-end mb-2">
                <span className="tech-label">IMC</span>
                <span className="font-mono text-2xl text-white">{imc > 0 ? imc.toFixed(1) : '--'}</span>
              </div>
              {imcClass && (
                <div className={clsx(
                  "text-xs font-mono uppercase tracking-wider px-2 py-1 rounded inline-block",
                  imcClass === 'Peso Normal' ? "bg-green-500/20 text-green-400" : 
                  imcClass === 'Abaixo do Peso' ? "bg-yellow-500/20 text-yellow-400" : 
                  "bg-red-500/20 text-red-400"
                )}>
                  {imcClass}
                </div>
              )}
            </div>

            <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155]">
              <div className="flex justify-between items-end">
                <span className="tech-label">TMB (Basal)</span>
                <span className="font-mono text-2xl text-[#3b82f6]">{tmb > 0 ? Math.round(tmb) : '--'} <span className="text-sm text-[#808090]">kcal</span></span>
              </div>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155]">
              <div className="flex justify-between items-end">
                <span className="tech-label">GET (Total)</span>
                <span className="font-mono text-2xl text-[#3b82f6]">{get > 0 ? Math.round(get) : '--'} <span className="text-sm text-[#808090]">kcal</span></span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#334155]">
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
        <div className="max-w-4xl mx-auto">
          <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">EnduranceFit Pro</h1>
              <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Protocolo Oficial</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl">{athlete.name}</p>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          <div className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-gray-800 border-b pb-2">Dados do Atleta</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
              <div><span className="block text-gray-500 text-xs uppercase">Idade</span><strong className="text-lg">{athlete.age} anos</strong></div>
              <div><span className="block text-gray-500 text-xs uppercase">Peso</span><strong className="text-lg">{athlete.weight} kg</strong></div>
              <div><span className="block text-gray-500 text-xs uppercase">Altura</span><strong className="text-lg">{athlete.height} cm</strong></div>
              <div><span className="block text-gray-500 text-xs uppercase">Objetivo</span><strong className="text-lg capitalize">{athlete.goal === 'hypertrophy' ? 'Hipertrofia' : athlete.goal === 'weight_loss' ? 'Emagrecimento' : athlete.goal === 'maintenance' ? 'Manutenção' : 'Performance'}</strong></div>
              <div><span className="block text-gray-500 text-xs uppercase">IMC</span><strong className="text-lg">{imc.toFixed(1)}</strong> <span className="text-xs">({imcClass})</span></div>
              <div><span className="block text-gray-500 text-xs uppercase">TMB</span><strong className="text-lg">{Math.round(tmb)} kcal</strong></div>
              <div><span className="block text-gray-500 text-xs uppercase">GET</span><strong className="text-lg">{Math.round(get)} kcal</strong></div>
            </div>
          </div>

          {selectedWorkoutTemplateId && (
            <div className="mb-10">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                <Dumbbell size={20} /> Treino: {state.workoutTemplates.find(t => t.id === selectedWorkoutTemplateId)?.name}
              </h2>
              <p className="text-sm mb-6 text-gray-700">{state.workoutTemplates.find(t => t.id === selectedWorkoutTemplateId)?.description}</p>
              
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-500 italic">Os exercícios detalhados serão listados aqui na próxima fase.</p>
              </div>
            </div>
          )}

          {selectedDietTemplateId && (
            <div className="mb-10">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                <Utensils size={20} /> Dieta: {state.dietTemplates.find(t => t.id === selectedDietTemplateId)?.name}
              </h2>
              <p className="text-sm mb-6 text-gray-700">{state.dietTemplates.find(t => t.id === selectedDietTemplateId)?.description}</p>
              
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-500 italic">As refeições detalhadas serão listadas aqui na próxima fase.</p>
              </div>
            </div>
          )}
          
          <div className="mt-16 pt-8 border-t border-gray-300 text-center text-xs text-gray-400">
            <p>Gerado por EnduranceFit Pro System</p>
          </div>
        </div>
      </div>
    </div>
  );
}


