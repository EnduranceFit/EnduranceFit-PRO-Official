"use client";

import { Dumbbell, Utensils } from 'lucide-react';
import { Athlete, WorkoutTemplate, DietTemplate } from '@/types';

interface WorkoutExporterProps {
  athlete: Partial<Athlete>;
  workout?: Partial<WorkoutTemplate>;
  diet?: Partial<DietTemplate>;
  className?: string;
}

export default function WorkoutExporter({ athlete, workout, diet, className }: WorkoutExporterProps) {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className={`workout-print-container ${className || ''}`}>
      {/* Header Branding */}
      <div className="flex justify-between items-end border-b-4 border-black pb-6 mb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-tight">
            PERSONAL<br />
            <span className="text-[#004080] print:text-black">JEAN ADLER</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-[0.4em] mt-2 text-gray-500">
            Consultoria de Treinamento de Alta Performance
          </p>
        </div>
        <div className="text-right">
          <div className="bg-black text-white px-4 py-2 mb-2 inline-block font-black skew-x-[-10deg]">
             PROTOCOLO_OFICIAL
          </div>
          <p className="font-bold text-xl">{athlete.name || 'ATLETA_N/D'}</p>
          <p className="text-sm font-mono text-gray-500">{currentDate}</p>
        </div>
      </div>

      {/* Athlete Biometrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 bg-gray-50 p-6 rounded-sm border-l-8 border-black">
        <div>
          <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-widest">Idade</span>
          <strong className="text-xl">{athlete.age || '--'} <span className="text-xs">anos</span></strong>
        </div>
        <div>
          <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-widest">Peso / Altura</span>
          <strong className="text-xl">{athlete.weight || '--'}kg / {athlete.height || '--'}cm</strong>
        </div>
        <div>
          <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-widest">Objetivo</span>
          <strong className="text-xl uppercase">{athlete.goal === 'hypertrophy' ? 'Hipertrofia' : athlete.goal === 'weight_loss' ? 'Emagrecimento' : athlete.goal === 'maintenance' ? 'Manutenção' : athlete.goal || 'Performance'}</strong>
        </div>
        <div>
          <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-widest">Status</span>
          <strong className="text-xl">{athlete.category || 'Online'}</strong>
        </div>
      </div>

      {/* Workout Content */}
      {workout && (
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b-2 border-black pb-2 mb-6">
            <Dumbbell size={28} />
            <h2 className="text-2xl font-black uppercase tracking-tight">Protocolo de Treino: {workout.name || 'TREINO_PERSONALIZADO'}</h2>
          </div>
          
          <div className="space-y-4">
            {workout.exercises?.length ? (
              workout.exercises.map((ex, idx) => (
                <div key={ex.id || idx} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-1 font-mono text-xl font-bold opacity-20">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="col-span-11">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg">{ex.name}</h3>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase">{ex.muscleGroup}</span>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Sets x Reps</span>
                        <span className="font-bold">{ex.sets}x {ex.reps}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Descanso</span>
                        <span className="font-bold">{ex.restTime || 60}s</span>
                      </div>
                      {ex.advancedTechnique && (
                        <div className="col-span-1 lg:col-span-2">
                          <span className="text-[10px] text-gray-400 uppercase block">Técnica</span>
                          <span className="font-bold text-red-700">{ex.advancedTechnique}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic font-mono text-sm uppercase">DATABASE_EMPTY: Nenhum exercício vinculado.</p>
            )}
          </div>
        </div>
      )}

      {/* Diet Content */}
      {diet && (
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b-2 border-black pb-2 mb-6">
            <Utensils size={28} />
            <h2 className="text-2xl font-black uppercase tracking-tight">Protocolo Nutricional: {diet.name || 'DIETA_PERSONALIZADA'}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {diet.meals?.length ? (
              diet.meals.sort((a, b) => (a.order || 0) - (b.order || 0)).map((meal) => (
                <div key={meal.id} className="bg-gray-50 p-6 rounded-sm border border-gray-200">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-bold uppercase tracking-wider">{meal.name}</h3>
                    <span className="font-mono text-xs text-blue-800 font-bold">{meal.time || '--:--'}</span>
                  </div>
                  <ul className="space-y-2">
                    {meal.items.map((item) => (
                      <li key={item.id} className="text-sm flex justify-between items-center">
                        <span className="text-gray-700">• {item.name}</span>
                        <span className="font-bold">{item.amount}g</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic font-mono text-sm uppercase col-span-2">DATABASE_EMPTY: Nenhuma refeição vinculada.</p>
            )}
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-20 pt-8 border-t border-gray-200 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
            © {new Date().getFullYear()} Personal Jean Adler | EnduranceFit Pro System
          </p>
        </div>
        <div className="flex items-center gap-4 grayscale opacity-30">
           <span className="font-black text-xl italic uppercase tracking-tighter">EF_PRO_v2.0</span>
        </div>
      </div>
    </div>
  );
}
