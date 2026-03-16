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
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[#0f172a] border border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Activity className="text-[#3b82f6]" size={24} />
            </div>
            <div className="text-center font-mono text-[10px] tracking-widest leading-tight">
              {(state.settings?.appName || 'ENDURANCEFIT PRO').toUpperCase().startsWith('ENDURANCEFIT') ? (
                <>
                  <span className="text-white block">ENDURANCE</span>
                  <span className="text-blue-700 block">FIT</span>
                  {(state.settings?.appName || 'ENDURANCEFIT PRO').substring(12) && <span className="text-[#3b82f6] block">{(state.settings?.appName || 'ENDURANCEFIT PRO').substring(12)}</span>}
                </>
              ) : (
                <span className="text-white block">{state.settings?.appName || 'ENDURANCEFIT PRO'}</span>
              )}
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
                    "relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group",
                    isActive ? "text-[#3b82f6] bg-[rgba(59,130,246,0.1)]" : "text-[#808090] hover:text-white hover:bg-[#1e293b]"
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
                      className="absolute left-0 w-1 h-8 bg-[#3b82f6] rounded-r-full"
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b82f6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3b82f6]"></span>
            </div>
            <span className="text-[9px] font-mono text-[#3b82f6] uppercase tracking-widest">Online</span>
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
        <header className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-[#334155] z-20">
          <div className="flex items-center gap-2">
            <Activity className="text-[#3b82f6]" size={24} />
            <span className="tech-heading text-lg">
              {(state.settings?.appName || 'ENDURANCEFIT PRO').toUpperCase().startsWith('ENDURANCEFIT') ? (
                <>
                  <span className="text-white">ENDURANCE</span>
                  <span className="text-blue-700">FIT</span>
                  {(state.settings?.appName || 'ENDURANCEFIT PRO').substring(12)}
                </>
              ) : (
                <span className="text-white">{state.settings?.appName || 'ENDURANCEFIT PRO'}</span>
              )}
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
