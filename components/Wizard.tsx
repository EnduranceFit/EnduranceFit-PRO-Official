"use client";

import { useState } from 'react';
import { Users, Dumbbell, Utensils, Settings, LogOut, Home, Menu, X, Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from "framer-motion";
import clsx from 'clsx';

// Tab components
import DashboardTab from './tabs/DashboardTab';
import AthletesTab from './tabs/AthletesTab';
import ProtocolsTab from './tabs/ProtocolsTab';
import NutritionTab from './tabs/NutritionTab';
import SystemTab from './tabs/SystemTab';

export default function Wizard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lock } = useAppContext();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home, component: DashboardTab },
    { id: 'athletes', label: 'Alunos', icon: Users, component: AthletesTab },
    { id: 'protocols', label: 'Treinos', icon: Dumbbell, component: ProtocolsTab },
    { id: 'nutrition', label: 'Dieta', icon: Utensils, component: NutritionTab },
    { id: 'system', label: 'Ajustes', icon: Settings, component: SystemTab },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || DashboardTab;

  return (
    <div className="flex h-screen bg-app-bg bg-app-pattern overflow-hidden text-app-text font-sans">
      {/* Desktop Sidebar (Navigation Rail) */}
      <aside className="hidden md:flex flex-col w-24 h-full py-8 border-r border-app-border items-center justify-between bg-app-card/30 backdrop-blur-xl z-20">
        <div className="flex flex-col items-center gap-12 w-full">
          {/* Professional Logo */}
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-app-accent to-blue-600 flex items-center justify-center shadow-lg shadow-app-accent/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl tracking-tighter">EF</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-app-muted group-hover:text-app-accent transition-colors">PRO</span>
          </div>

          {/* Vertical Nav */}
          <nav className="flex flex-col gap-6">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "relative p-3 rounded-2xl transition-all duration-300 group",
                    isActive 
                      ? "bg-app-accent/10 text-app-accent" 
                      : "text-app-muted hover:text-app-text hover:bg-white/5"
                  )}
                >
                  <tab.icon size={26} className={clsx("transition-transform", isActive && "scale-110")} />
                  
                  {/* Tooltip */}
                  <span className="absolute left-full ml-4 px-2 py-1 bg-app-card border border-app-border rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {tab.label}
                  </span>

                  {/* Active Bullet */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-app-accent rounded-r-full shadow-glow"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={lock}
          className="p-3 text-app-muted hover:text-red-400 transition-colors"
          title="Bloquear"
        >
          <LogOut size={24} />
        </button>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-5 bg-app-bg/80 backdrop-blur-md border-b border-app-border z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-app-accent flex items-center justify-center font-black text-xs">
              EF
            </div>
            <h1 className="font-extrabold tracking-tight text-lg">EnduranceFit Pro</h1>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-app-card flex items-center justify-center border border-app-border"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="max-w-7xl mx-auto p-4 md:p-10 pb-32 md:pb-10 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full"
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-app-bg/90 backdrop-blur-xl border-t border-app-border/50 z-40 flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex flex-col items-center gap-1 transition-all",
                  isActive ? "text-app-accent scale-110" : "text-app-muted"
                )}
              >
                <div className={clsx(
                  "p-2 rounded-xl transition-colors",
                  isActive && "bg-app-accent/10"
                )}>
                  <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FAB - Quick Prescription (Mobile) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-app-accent rounded-2xl shadow-xl shadow-app-accent/30 flex items-center justify-center text-white z-50 border-4 border-app-bg"
        onClick={() => setActiveTab('dashboard')}
      >
        <Plus size={28} strokeWidth={3} />
      </motion.button>
    </div>
  );
}
