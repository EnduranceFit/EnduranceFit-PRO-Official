"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Settings, Download, Trash2, Lock, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function SystemTab() {
  const { state, updateSettings, wipeData } = useAppContext();
  const [pin, setPin] = useState(state.settings.pin || '');
  const [appName, setAppName] = useState(state.settings?.appName || 'ENDURANCEFIT PRO');
  const [modal, setModal] = useState<{ type: 'alert' | 'confirm' | 'prompt' | null, message: string, onConfirm?: (val?: string) => void }>({ type: null, message: '' });
  const [promptValue, setPromptValue] = useState('');

  const handleSaveSettings = () => {
    updateSettings({
      pin: pin || null,
      appName: appName || 'ENDURANCEFIT PRO'
    });
    setModal({ type: 'alert', message: 'Configurações salvas com sucesso.' });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `endurancefit_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleWipe = () => {
    setModal({
      type: 'confirm',
      message: 'ZONA DE PERIGO: Você está prestes a apagar todos os dados do sistema. Esta ação é irreversível. Deseja continuar?',
      onConfirm: () => {
        setPromptValue('');
        setModal({
          type: 'prompt',
          message: 'Digite "APAGAR TUDO" para confirmar a exclusão.',
          onConfirm: (val) => {
            if (val === 'APAGAR TUDO') {
              wipeData();
              setModal({ type: 'alert', message: 'Sistema resetado com sucesso.' });
            } else {
              setModal({ type: null, message: '' });
            }
          }
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full max-w-4xl mx-auto relative">
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
                <h3 className="tech-heading text-lg text-white">
                  {modal.type === 'alert' ? 'Aviso' : 'Confirmação'}
                </h3>
                <button onClick={() => setModal({ type: null, message: '' })} className="text-[#808090] hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-[#808090] font-mono text-sm">{modal.message}</p>
              
              {modal.type === 'prompt' && (
                <input 
                  type="text" 
                  className="tech-input mt-2" 
                  value={promptValue}
                  onChange={e => setPromptValue(e.target.value)}
                  placeholder="APAGAR TUDO"
                />
              )}

              <div className="flex justify-end gap-3 mt-4">
                {modal.type !== 'alert' && (
                  <button 
                    onClick={() => setModal({ type: null, message: '' })}
                    className="tech-button-secondary"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (modal.onConfirm) {
                      modal.onConfirm(modal.type === 'prompt' ? promptValue : undefined);
                    } else {
                      setModal({ type: null, message: '' });
                    }
                  }}
                  className={modal.type === 'alert' ? 'tech-button' : 'tech-button-danger'}
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center bg-tech-pattern glass-panel hardware-card p-6">
        <div>
          <h2 className="tech-heading text-2xl text-[#3b82f6] mb-2">Sistema</h2>
          <p className="tech-label">Configurações e Segurança</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel hardware-card p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
            <Lock className="text-[#3b82f6]" size={24} />
            <h3 className="tech-heading text-lg text-white">Segurança</h3>
          </div>

          <div>
            <label className="tech-label block mb-2">PIN de Acesso (Deixe em branco para desativar)</label>
            <input 
              type="password" 
              className="tech-input tracking-widest" 
              placeholder="****"
              maxLength={6}
              value={pin}
              onChange={e => setPin(e.target.value)}
            />
          </div>

          <div>
            <label className="tech-label block mb-2">Nome do Sistema</label>
            <input 
              type="text" 
              className="tech-input" 
              value={appName}
              onChange={e => setAppName(e.target.value)}
            />
          </div>

          <button onClick={handleSaveSettings} className="tech-button mt-auto">
            Salvar Configurações
          </button>
        </motion.div>

        {/* Data Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel hardware-card p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
            <Settings className="text-[#3b82f6]" size={24} />
            <h3 className="tech-heading text-lg text-white">Gestão de Dados</h3>
          </div>

          <div>
            <p className="text-[#808090] font-mono text-sm mb-4">
              Exporte um backup completo do sistema em formato JSON.
            </p>
            <button onClick={handleExport} className="tech-button-secondary w-full">
              <Download size={18} /> Exportar Backup (JSON)
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-red-500/30">
            <div className="flex items-center gap-2 mb-4 text-red-500">
              <ShieldAlert size={20} />
              <h4 className="tech-heading text-sm">Zona de Perigo</h4>
            </div>
            <p className="text-[#808090] font-mono text-xs mb-4">
              Apaga permanentemente todos os registros, atletas e modelos do sistema.
            </p>
            <button onClick={handleWipe} className="tech-button-danger w-full">
              <Trash2 size={18} /> Apagar Todos os Dados
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
