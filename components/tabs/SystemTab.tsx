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
      setModal({ type: 'alert', message: 'Configurações de identidade atualizadas.' });
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
      message: 'AÇÃO IRREVERSÍVEL: Deseja apagar todos os dados do sistema?',
      onConfirm: () => {
        setPromptValue('');
        setModal({
          type: 'prompt',
          message: 'Digite "CONFIRMAR" para apagar tudo.',
          onConfirm: async (val) => {
            if (val === 'CONFIRMAR') {
              await wipeData();
              setModal({ type: 'alert', message: 'Sistema zerado.' });
            }
          }
        });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <AnimatePresence>
        {modal.type && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="app-card p-10 max-w-md w-full">
              <h3 className="text-xl font-bold border-b border-app-border pb-4 mb-4">Aviso</h3>
              <p className="text-app-muted leading-relaxed mb-8">{modal.message}</p>
              {modal.type === 'prompt' && (
                <input type="text" className="app-input mb-8" value={promptValue} onChange={e => setPromptValue(e.target.value)} placeholder="Digite aqui..." />
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
                  className="app-button-primary"
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tighter uppercase">Identidade do Coach</h2>
        <p className="text-app-muted">Personalize a aparência do seu sistema e dos relatórios PDF.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding */}
        <div className="app-card p-10 space-y-8 h-full flex flex-col">
          <div className="flex items-center gap-3 border-b border-app-border pb-6">
            <div className="p-3 bg-app-accent/10 rounded-2xl text-app-accent">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold">White-Label Branding</h3>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="app-label">Nome do Treinador / Consultoria</label>
              <div className="relative">
                <input type="text" className="app-input pl-12" value={trainerName} onChange={e => setTrainerName(e.target.value)} placeholder="Ex: Jean Adler Consultoria" />
                <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="app-label">URL do Logo (SVG/PNG Transparente)</label>
              <div className="relative">
                <input type="text" className="app-input pl-12" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." />
                <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="app-label">Nome do App (Title)</label>
              <input type="text" className="app-input" value={appName} onChange={e => setAppName(e.target.value)} />
            </div>

             <div className="space-y-2">
              <label className="app-label">PIN de Segurança</label>
              <div className="relative">
                <input type="password" className="app-input pl-12 tracking-widest" value={pin} onChange={e => setPin(e.target.value)} placeholder="****" maxLength={6} />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-accent" />
              </div>
            </div>
          </div>

          <button onClick={handleSaveSettings} disabled={isSaving} className="app-button-primary w-full py-5 text-lg shadow-glow-accent">
            {isSaving ? "SALVANDO..." : "ATUALIZAR IDENTIDADE"} <Save size={20} className="ml-2" />
          </button>
        </div>

        {/* Data & Security */}
        <div className="space-y-8">
          <div className="app-card p-10 space-y-8 border-app-border/40">
            <div className="flex items-center gap-3 border-b border-app-border pb-6">
              <div className="p-3 bg-app-muted/10 rounded-2xl text-app-muted">
                <Download size={24} />
              </div>
              <h3 className="text-xl font-bold">Backup & Portabilidade</h3>
            </div>
            <p className="text-app-muted leading-relaxed">Exporte seus dados para um arquivo JSON seguro. Você pode usar este arquivo para migrar entre dispositivos.</p>
            <button onClick={handleExport} className="app-button-outline w-full py-4 uppercase font-black tracking-widest text-xs">Baixar Backup Geral</button>
          </div>

          <div className="app-card p-10 space-y-6 bg-red-500/5 border-red-500/20">
             <div className="flex items-center gap-3 text-red-500">
               <ShieldAlert size={24} />
               <h3 className="text-xl font-bold">Hard Reset</h3>
             </div>
             <p className="text-red-500/60 text-sm">Cuidado: Esta ação apagará permanentemente todos os alunos, treinos e dietas deste dispositivo e do servidor.</p>
             <button onClick={handleWipe} className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black tracking-widest text-xs transition-all">DELETAR TUDO</button>
          </div>
        </div>
      </div>
    </div>
  );
}
