"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Settings, Download, Trash2, Lock, ShieldAlert, X, Image as ImageIcon, Type, Save } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function SystemTab() {
  const { state, updateSettings, wipeData } = useAppContext();
  const [pin, setPin] = useState(state.settings.pin || '');
  const [appName, setAppName] = useState(state.settings?.appName || 'ENDURANCEFIT PRO');
  const [trainerName, setTrainerName] = useState(state.settings?.trainerName || '');
  const [logoUrl, setLogoUrl] = useState(state.settings?.logoUrl || '');
  const [modal, setModal] = useState<{ type: 'alert' | 'confirm' | 'prompt' | null, message: string, onConfirm?: (val?: string) => void }>({ type: null, message: '' });
  const [promptValue, setPromptValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE') {
        throw new Error("Supabase não configurado.");
      }
      await updateSettings({
        pin: pin || null,
        appName: appName || 'ENDURANCEFIT PRO',
        trainerName,
        logoUrl
      });
      setModal({ type: 'alert', message: 'Configurações de identidade atualizadas com sucesso.' });
    } catch (error: any) {
      setModal({ type: 'alert', message: `Erro ao salvar: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `backup_endurancefit_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  const handleWipe = () => {
    setModal({
      type: 'confirm',
      message: 'AÇÃO IRREVERSÍVEL: Deseja apagar todos os dados registrados no sistema (alunos, treinos e dietas)?',
      onConfirm: () => {
        setPromptValue('');
        setModal({
          type: 'prompt',
          message: 'Esta ação não pode ser desfeita. Para prosseguir e apagar tudo, digite "CONFIRMAR" abaixo.',
          onConfirm: async (val) => {
            if (val === 'CONFIRMAR') {
              await wipeData();
              setModal({ type: 'alert', message: 'Todos os registros foram removidos com sucesso.' });
            }
          }
        });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <AnimatePresence>
        {modal.type && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="app-card p-10 max-w-md w-full border-t-4 border-app-accent">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Aviso do Sistema</h3>
              <p className="text-app-muted leading-relaxed mb-10 font-medium">{modal.message}</p>
              {modal.type === 'prompt' && (
                <input type="text" className="app-input mb-10 !border-red-500/30 focus:!border-red-500" value={promptValue} onChange={e => setPromptValue(e.target.value)} placeholder="Digite CONFIRMAR..." />
              )}
              <div className="flex justify-end gap-4">
                {modal.type !== 'alert' && (
                  <button onClick={() => setModal({ type: null, message: '' })} className="app-button-outline">Cancelar</button>
                )}
                <button 
                  onClick={() => {
                    if (modal.onConfirm) modal.onConfirm(promptValue);
                    else setModal({ type: null, message: '' });
                  }}
                  className={modal.type === 'confirm' || modal.type === 'prompt' ? "px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all" : "app-button-primary"}
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tighter uppercase leading-tight italic">Identidade do Consultor</h2>
        <p className="text-app-muted font-medium text-lg">Personalize a marca da sua consultoria nos relatórios e no sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="app-card p-10 space-y-10 h-full flex flex-col relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-app-accent/10 rounded-2xl text-app-accent group-hover:bg-app-accent group-hover:text-white transition-all">
              <Settings size={26} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Branding Elite</h3>
          </div>

          <div className="space-y-8 flex-1 relative z-10">
            <div className="space-y-2">
              <label className="app-label">Nome da Consultoria / Coach</label>
              <div className="relative">
                <input type="text" className="app-input pl-14" value={trainerName} onChange={e => setTrainerName(e.target.value)} placeholder="Ex: Jean Adler Coaching" />
                <Type size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-app-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="app-label">Logotipo Customizado (SVG / PNG)</label>
              <div className="relative">
                <input type="text" className="app-input pl-14" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="URL da imagem..." />
                <ImageIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-app-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="app-label">Título da Aplicação</label>
              <input type="text" className="app-input" value={appName} onChange={e => setAppName(e.target.value)} />
            </div>

             <div className="space-y-2">
              <label className="app-label">PIN de Proteção</label>
              <div className="relative">
                <input type="password" className="app-input pl-14 tracking-[0.8em] font-black" value={pin} onChange={e => setPin(e.target.value)} placeholder="●●●●" maxLength={6} />
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-app-accent" />
              </div>
            </div>
          </div>

          <button onClick={handleSaveSettings} disabled={isSaving} className="app-button-primary w-full py-6 text-lg shadow-glow-accent uppercase font-black tracking-widest relative z-10">
            {isSaving ? "PROCESSANDO..." : "Salvar Configurações"} <Save size={20} className="ml-3" />
          </button>
          
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-app-accent/5 rounded-full blur-3xl group-hover:bg-app-accent/10 transition-all" />
        </div>

        <div className="space-y-10">
          <div className="app-card p-10 space-y-8 border-app-border/40 group hover:border-app-accent/20 transition-all">
            <div className="flex items-center gap-4 border-b border-app-border pb-6">
              <div className="p-3 bg-app-muted/10 rounded-2xl text-app-muted group-hover:text-app-accent transition-colors">
                <Download size={26} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Portabilidade de Dados</h3>
            </div>
            <p className="text-app-muted font-medium leading-relaxed">Exporte toda a sua base de alunos e protocolos para um arquivo de backup seguro.</p>
            <button onClick={handleExport} className="app-button-outline w-full py-4 uppercase font-black tracking-[0.2em] text-[10px]">Gerar Backup do Sistema</button>
          </div>

          <div className="app-card p-10 space-y-8 bg-red-500/5 border-red-500/10 group hover:bg-red-500/10 transition-all">
             <div className="flex items-center gap-4 text-red-500">
               <ShieldAlert size={28} />
               <h3 className="text-xl font-black uppercase tracking-tighter italic">Zona Crítica</h3>
             </div>
             <p className="text-red-500/60 text-sm font-semibold leading-relaxed">A limpeza de dados removerá permanentemente todos os registros do seu banco de dados Supabase.</p>
             <button onClick={handleWipe} className="w-full py-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black tracking-widest text-[10px] uppercase transition-all shadow-lg shadow-red-500/5">Remover Todos os Registros</button>
          </div>
        </div>
      </div>
    </div>
  );
}
