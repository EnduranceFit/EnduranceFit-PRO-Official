"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Database, ShieldCheck } from "lucide-react";

const loadingSteps = [
  { text: "INICIALIZANDO NÚCLEO...", icon: Cpu },
  { text: "CARREGANDO DADOS...", icon: Database },
  { text: "VERIFICANDO SEGURANÇA...", icon: ShieldCheck },
  { text: "SISTEMA PRONTO.", icon: Activity },
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [showFailSafe, setShowFailSafe] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const intervalTime = 25;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    const failSafeTimer = setTimeout(() => {
      setShowFailSafe(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(failSafeTimer);
    };
  }, []);

  const safeProgress = isNaN(progress) ? 0 : Math.max(0, Math.min(progress, 100));
  const stepIndex = Math.max(0, Math.min(
    Math.floor((safeProgress / 100) * loadingSteps.length),
    loadingSteps.length - 1
  ));
  const CurrentIcon = loadingSteps[stepIndex]?.icon || Activity;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#000000] text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-tech-pattern opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center w-full max-w-md px-8"
      >
        {/* Logo / Icon */}
        <div className="relative mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-6 rounded-full border border-dashed border-[#3b82f6]/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 rounded-full border border-[#3b82f6]/20"
          />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0f172a] border border-[#3b82f6] shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <CurrentIcon className="text-[#3b82f6]" size={48} />
          </div>
        </div>

        {/* App Name */}
        <div className="text-center font-mono tracking-[0.3em] mb-12">
          <span className="text-white text-2xl font-bold">ENDURANCE</span>
          <span className="text-[#3b82f6] text-2xl font-bold">FIT</span>
          <div className="text-xs text-[#808090] mt-3 tracking-widest">PRO SYSTEM v2.0</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-xs font-mono text-[#3b82f6] mb-3 tracking-widest">
            <span>{loadingSteps[stepIndex].text}</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Fail-safe button */}
        {showFailSafe && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 border border-[#3b82f6] text-[#3b82f6] text-xs font-mono tracking-widest rounded hover:bg-[#3b82f6]/10 transition-colors"
          >
            FORÇAR INICIALIZAÇÃO
          </motion.button>
        )}

        {/* Decorative Tech Elements */}
        <div className="w-full flex justify-between mt-8 opacity-60">
          <div className="flex gap-1.5">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                className="h-3 w-1.5 bg-[#3b82f6] rounded-sm"
              />
            ))}
          </div>
          <div className="font-mono text-[9px] text-[#808090] tracking-widest uppercase">
            SYS_BOOT_SEQ_INIT
          </div>
        </div>
      </motion.div>
    </div>
  );
}
