"use client";

import { Dumbbell, Utensils, CheckCircle2, User, Calendar, Activity, Zap } from 'lucide-react';
import { Athlete, WorkoutTemplate, DietTemplate } from '@/types';
import { useAppContext } from '@/context/AppContext';
import clsx from 'clsx';

interface WorkoutExporterProps {
  athlete: Partial<Athlete>;
  workout?: Partial<WorkoutTemplate>;
  workouts?: Partial<WorkoutTemplate>[];
  diet?: Partial<DietTemplate>;
  className?: string;
}

export default function WorkoutExporter({ athlete, workout, workouts, diet, className }: WorkoutExporterProps) {
  const { state } = useAppContext();
  const { settings } = state;
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className={`w-full bg-white text-black min-h-screen p-12 print:p-0 font-sans ${className || ''}`}>
      {/* Premium Header */}
      <div className="flex justify-between items-start border-b-[6px] border-black pb-10 mb-12">
        <div className="space-y-4">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-16 w-auto object-contain mb-4" />
          ) : (
            <div className="bg-black text-white px-6 py-2 inline-block font-black text-2xl tracking-tighter">
              {settings.appName || 'ENDURANCEFIT'}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
              CONSULTORIA <br />
              <span className="text-black/60 italic">{settings.trainerName || 'PROFESSIONAL COACH'}</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] mt-3 text-black/40">
              PLATINUM PERFORMANCE PROTOCOL
            </p>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
            <Zap size={12} fill="currentColor" /> Documento Oficial
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black uppercase tracking-tighter">{athlete.name || 'ATLETA'}</p>
            <p className="text-xs font-bold text-black/50 uppercase tracking-widest mt-1 flex items-center justify-end gap-2">
              <Calendar size={12} /> {currentDate}
            </p>
          </div>
        </div>
      </div>

      {/* Bio Summary Bar */}
      <div className="grid grid-cols-4 gap-4 mb-16 border-y-2 border-black/10 py-8">
        <div className="border-r border-black/10 px-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-1">PESO ATUAL</p>
          <p className="text-2xl font-black">{athlete.weight || '--'}<span className="text-sm ml-1 text-black/40 uppercase">kg</span></p>
        </div>
        <div className="border-r border-black/10 px-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-1">ALTURA</p>
          <p className="text-2xl font-black">{athlete.height || '--'}<span className="text-sm ml-1 text-black/40 uppercase">cm</span></p>
        </div>
        <div className="border-r border-black/10 px-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-1">CATEGORIA</p>
          <p className="text-2xl font-black uppercase">{athlete.category || 'ONLINE'}</p>
        </div>
        <div className="px-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-1">OBJETIVO</p>
          <p className="text-2xl font-black uppercase leading-none">{athlete.goal || 'PERFORMANCE'}</p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-20">
        {(workouts && workouts.length > 0 ? workouts : (workout ? [workout] : [])).map((w, wIdx) => (
          <section key={w.id || wIdx} className="page-break-before-auto mb-16">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-8">
              <Dumbbell size={32} className="text-black" />
              <div className="flex flex-col">
                 <h2 className="text-3xl font-black uppercase tracking-tighter italic">PROGRAMA DE TREINAMENTO</h2>
                 {w.name && <h3 className="text-lg font-bold text-black/70 tracking-widest uppercase mt-1">{w.name}</h3>}
              </div>
            </div>
            
            <div className="space-y-1">
              {w.exercises?.map((ex, idx) => {
                if (ex.muscleGroup?.toUpperCase() === 'SEPARADOR') {
                  return (
                    <div key={ex.id || idx} className="col-span-12 py-4 mt-8 mb-4 border-b-2 border-black/20 text-center page-break-inside-avoid">
                      <h3 className="text-xl font-black uppercase tracking-[0.2em] italic text-black/80">{ex.name}</h3>
                    </div>
                  );
                }
                return (
                <div key={ex.id || idx} className="grid grid-cols-12 gap-6 p-6 border-b border-black/5 items-center hover:bg-black/[0.02] transition-colors page-break-inside-avoid">
                  <div className="col-span-1">
                    <span className="text-4xl font-black opacity-10 leading-none">{(idx + 1).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="col-span-7">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1">{ex.name}</h3>
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{ex.muscleGroup}</p>
                  </div>
                  <div className="col-span-5 grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
                    <div className="bg-black/5 p-2 rounded-sm md:col-span-2 text-left px-3">
                      <p className="text-[8px] font-black uppercase tracking-tighter opacity-50 mb-1">SÉRIES / EXECUÇÃO</p>
                      <p className={clsx("font-black", (ex.reps || '').length > 25 ? "text-[9px] leading-tight" : "text-sm")}>{ex.reps}</p>
                    </div>
                    <div className="bg-black/5 p-2 rounded-sm flex flex-col justify-center">
                      <p className="text-[8px] font-black uppercase tracking-tighter opacity-50 mb-1">TOTAL SETS</p>
                      <p className="text-sm font-black text-black">{ex.sets}</p>
                    </div>
                  </div>
                  {ex.advancedTechnique && (
                    <div className="col-start-2 col-span-11 mt-2">
                       <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-black text-white inline-block">MÉTODO: {ex.advancedTechnique}</p>
                    </div>
                  )}
                </div>
              )})}
            </div>
          </section>
        ))}

        {diet && (
          <section className="page-break-before-auto">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-8">
              <Utensils size={32} className="text-black" />
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">PLANEJAMENTO NUTRICIONAL</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {diet.meals?.map((meal) => (
                <div key={meal.id} className="border-l-4 border-black p-6 bg-black/[0.02] page-break-inside-avoid">
                  <div className="flex justify-between items-end mb-6 border-b border-black/10 pb-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter">{meal.name}</h3>
                    <span className="text-xs font-black opacity-40">{meal.time}</span>
                  </div>
                  <ul className="space-y-3">
                    {meal.items.map((item) => (
                      <li key={item.id} className="flex justify-between items-baseline group">
                        <span className="text-sm font-bold uppercase tracking-tight text-black/70">• {item.name}</span>
                        <div className="flex-1 border-b border-dotted border-black/10 mx-2 mb-1"></div>
                        <span className="text-sm font-black">{item.amount}g</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Premium Footer */}
      <footer className="mt-24 pt-10 border-t-2 border-black/10 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
        <div>
           Documento de Prescrição Elite
        </div>
        <div className="text-right italic">
           Sincronizado via {settings.appName || 'ENDURANCEFIT PRO'}
        </div>
      </footer>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; background: white !important; }
          .print-hidden { display: none !important; }
          @page { margin: 1cm; size: auto; }
          .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
