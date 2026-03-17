"use client";

import { useState } from 'react';
import { Users, Dumbbell, Utensils, Settings, LogOut, Activity, Menu, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from "framer-motion";
import clsx from 'clsx';

// Placeholder components for the tabs
import DashboardTab from './tabs/DashboardTab';
import AthletesTab from './tabs/AthletesTab';
import ProtocolsTab from './tabs/ProtocolsTab';
import NutritionTab from './tabs/NutritionTab';
import SystemTab from './tabs/SystemTab';

export default function Wizard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lock, state } = useAppContext();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, component: DashboardTab },
    { id: 'athletes', label: 'Atletas', icon: Users, component: AthletesTab },
    { id: 'protocols', label: 'Protocolos', icon: Dumbbell, component: ProtocolsTab },
    { id: 'nutrition', label: 'Nutrição', icon: Utensils, component: NutritionTab },
    { id: 'system', label: 'Sistema', icon: Settings, component: SystemTab },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || DashboardTab;

  return (
    <div className="flex h-screen bg-tech-pattern overflow-hidden">
      {/* Desktop Floating Navigation Rail */}
      <aside className="hidden md:flex flex-col w-24 h-full py-6 px-2 items-center justify-between z-10">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,64,128,0.5)]">
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#004080" />
                    <stop offset="100%" stopColor="#001F3F" />
                  </linearGradient>
                </defs>
                <path d="M50 5 L90 27 V73 L50 95 L10 73 V27 Z" fill="none" stroke="url(#logo-grad)" strokeWidth="2" />
                <path d="M50 12 L82 30 V70 L50 88 L18 70 V30 Z" fill="#050505" stroke="#001F3F" strokeWidth="1" />
                <text x="50" y="60" textAnchor="middle" fill="white" className="font-sans font-black text-[28px] tracking-tighter">EF</text>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#004080" strokeWidth="0.5" strokeDasharray="4 8" className="animate-[spin_20s_linear_infinite]" />
              </svg>
            </div>
            <div className="text-center font-mono text-[9px] tracking-[0.3em] leading-tight">
              <span className="text-white block opacity-80">ENDURANCE</span>
              <span className="text-[#004080] block font-bold">FIT_PRO</span>
              <span className="text-[#607080] block text-[7px] mt-1">v2.0_SYSTEM</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-4 w-full">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "relative flex flex-col items-center justify-center p-3 rounded-sm transition-all duration-300 group",
                    isActive ? "text-white bg-[rgba(0,31,63,0.3)] border border-[#004080]" : "text-[#607080] hover:text-white hover:bg-[#050505]"
                  )}
                  title={tab.label}
                >
                  <tab.icon size={24} className={clsx("mb-1 transition-transform", isActive && "scale-110")} />
                  <span className="text-[10px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 absolute -bottom-4 whitespace-nowrap transition-opacity">
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute left-0 w-1 h-8 bg-[#004080] rounded-r-full shadow-[0_0_10px_rgba(0,64,128,0.8)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* System Status Indicator */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004080] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#004080]"></span>
            </div>
            <span className="text-[9px] font-mono text-[#004080] uppercase tracking-widest">Active</span>
          </div>

          <button
            onClick={lock}
            className="p-3 text-red-500 hover:bg-[rgba(239,68,68,0.1)] rounded-xl transition-colors"
            title="Bloquear Sistema"
          >
            <LogOut size={24} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative z-0 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#050505] border-b border-[#001F3F] z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 5 L90 27 V73 L50 95 L10 73 V27 Z" fill="none" stroke="#004080" strokeWidth="4" />
                  <text x="50" y="62" textAnchor="middle" fill="white" className="font-sans font-black text-[35px]">EF</text>
                </svg>
             </div>
            <span className="tech-heading text-sm tracking-widest text-white uppercase">
               SYSTEM_PRO_v2.0
            </span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-[60px] left-0 right-0 glass-panel border-b border-[#334155] z-30 flex flex-col p-4 gap-2 md:hidden shadow-2xl"
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-lg font-mono uppercase tracking-wider text-sm transition-colors",
                    activeTab === tab.id ? "bg-[rgba(59,130,246,0.1)] text-[#3b82f6]" : "text-[#808090] hover:bg-[#1e293b] hover:text-white"
                  )}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
              <div className="h-px bg-[#334155] my-2" />
              <button
                onClick={lock}
                className="flex items-center gap-4 p-4 rounded-lg font-mono uppercase tracking-wider text-sm text-red-500 hover:bg-[rgba(239,68,68,0.1)] transition-colors"
              >
                <LogOut size={20} />
                Bloquear Sistema
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-7xl mx-auto"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Optional, but requested) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-[#334155] z-20 flex items-center justify-around p-2 pb-safe">
        {tabs.slice(0, 4).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              activeTab === tab.id ? "text-[#3b82f6]" : "text-[#808090]"
            )}
          >
            <tab.icon size={20} className="mb-1" />
            <span className="text-[9px] font-mono uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
