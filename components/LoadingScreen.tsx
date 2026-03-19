"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const intervalTime = 30;
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

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#121212] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center w-full max-w-sm px-12"
      >
        <div className="flex flex-col items-center gap-6 mb-12 text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
                <Activity className="text-blue-500" size={32} />
            </div>
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">ENDURANCE FIT PRO</h1>
                <p className="text-[10px] font-bold text-blue-500 tracking-[0.4em] uppercase">Performance & Elite</p>
            </div>
        </div>

        <div className="w-full space-y-4">
           <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
                className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
             />
           </div>
           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
              <span>Carregando Experiência</span>
              <span className="text-white/60">{Math.floor(progress)}%</span>
           </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 text-[8px] font-bold uppercase tracking-[0.6em] text-white/10 italic">
        Platinum Edition v3.0
      </div>
    </div>
  );
}
