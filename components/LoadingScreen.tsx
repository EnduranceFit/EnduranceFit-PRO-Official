"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Database, ShieldCheck } from "lucide-react";

const loadingSteps = [
  { text: "INITIALIZING KERNEL...", icon: Cpu },
  { text: "MOUNTING DATA_STORE...", icon: Database },
  { text: "ENCRYPT_CHECK_v2.0...", icon: ShieldCheck },
  { text: "SYSTEM_ONLINE_READY.", icon: Activity },
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [showFailSafe, setShowFailSafe] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const duration = 1500; // Faster boot (1.5s)
    const intervalTime = 20;
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

    // Dynamic log simulation
    const logInterval = setInterval(() => {
      const newLog = `> [${new Date().toLocaleTimeString()}] ${loadingSteps[Math.floor(Math.random() * loadingSteps.length)].text}`;
      setLogs(prev => [...prev.slice(-4), newLog]);
    }, 300);

    const failSafeTimer = setTimeout(() => {
      setShowFailSafe(true);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
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
    <div className="flex h-screen flex-col items-center justify-center bg-[#000000] text-white overflow-hidden relative font-mono">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,31,63,0.3)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-tech-pattern opacity-30" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center w-full max-w-lg px-8"
      >
        {/* SYS BOOT HEADER */}
        <div className="w-full flex justify-between mb-8 pb-2 border-b border-[#001F3F] text-[10px] text-[#607080] tracking-[0.2em]">
          <span>ENDURANCEFIT_SYS_v2.0</span>
          <span>BOOT_SEQ: 0x88AF</span>
        </div>

        <div className="relative flex h-20 w-20 items-center justify-center rounded-sm bg-[#050505] border border-[#001F3F] mb-8 shadow-[0_0_30px_rgba(0,31,63,0.4)]">
          <CurrentIcon className="text-[#004080]" size={36} />
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 border-2 border-[#004080] rounded-sm"
          />
        </div>

        {/* LOG CONSOLE */}
        <div className="w-full bg-[#050505] border border-[#001F3F] p-4 mb-8 h-32 overflow-hidden rounded-sm">
          {logs.map((log, i) => (
            <div key={i} className="text-[10px] text-[#004080] opacity-80 mb-1 leading-tight">
              {log}
            </div>
          ))}
          <div className="text-[10px] text-white flex items-center gap-2">
             <span className="w-2 h-3 bg-[#004080] animate-pulse" />
             EXECUTING_INIT...
          </div>
        </div>

        {/* PROG BAR */}
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-[#607080] mb-2 tracking-[0.2em]">
            <span>{loadingSteps[stepIndex].text}</span>
            <span className="text-white">{Math.floor(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-[#0a0a0a] border border-[#001F3F] rounded-sm overflow-hidden p-[1px]">
            <motion.div
              className="h-full bg-[#004080]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-12 text-[9px] text-[#607080] uppercase tracking-[0.5em] opacity-50">
          SYS_BOOT_SEQ_INIT
        </div>
      </motion.div>
    </div>
  );
}
