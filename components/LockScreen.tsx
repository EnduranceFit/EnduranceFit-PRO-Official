"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Lock, Cpu } from 'lucide-react';
import { motion } from "framer-motion";

export default function LockScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { unlock, state } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlock(pin)) {
      setError('');
    } else {
      setError('ACESSO NEGADO');
      setPin('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-tech-pattern p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel hardware-card p-8 w-full max-w-sm text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 border border-[#3b82f6] text-[#3b82f6] rounded-full bg-[rgba(59,130,246,0.1)] relative">
            <Cpu size={32} className="relative z-10" />
            <div className="absolute inset-0 bg-[#3b82f6] blur-md opacity-20 rounded-full"></div>
          </div>
        </div>
        <h1 className="tech-heading text-2xl mb-2">
          {(state.settings?.appName || 'ENDURANCEFIT PRO').toUpperCase().startsWith('ENDURANCEFIT') ? (
            <>
              <span className="text-white">ENDURANCE</span>
              <span className="text-blue-700">FIT</span>
              {(state.settings?.appName || 'ENDURANCEFIT PRO').substring(12)}
            </>
          ) : (
            <span className="text-white">{state.settings?.appName || 'ENDURANCEFIT PRO'}</span>
          )}
        </h1>
        <p className="tech-label mb-8">Autenticação de Sistema Necessária</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="tech-input text-center text-2xl tracking-[0.5em] py-4 mb-4"
            placeholder="****"
            maxLength={6}
            autoFocus
          />
          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-500 font-mono text-sm uppercase tracking-wider mb-4"
            >
              {error}
            </motion.p>
          )}
          <button
            type="submit"
            className="tech-button w-full py-4 text-lg"
          >
            <Lock size={18} />
            Desbloquear
          </button>
        </form>
      </motion.div>
    </div>
  );
}
