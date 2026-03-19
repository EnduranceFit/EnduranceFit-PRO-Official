"use client";

import { useState, useMemo } from 'react';
import { Plus, Trash2, Copy, Clock, Scale, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Meal, MealItem, DietTemplate } from '@/types';
import { Utensils } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, Reorder, AnimatePresence } from "framer-motion";
import clsx from 'clsx';
import { generateDietFromAI } from '@/utils/ai-handler';

interface DietBuilderProps {
  template: Partial<DietTemplate>;
  onChange: (template: Partial<DietTemplate>) => void;
}

export default function DietBuilder({ template, onChange }: DietBuilderProps) {
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const meals = template.meals || [];

  const totals = useMemo(() => {
    return meals.reduce((acc, meal) => {
      meal.items.forEach(item => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const addMeal = () => {
    const newMeal: Meal = {
      id: uuidv4(),
      name: `Refeição ${meals.length + 1}`,
      time: '08:00',
      items: [],
      order: meals.length,
    };
    onChange({ ...template, meals: [...meals, newMeal] });
    setExpandedMealId(newMeal.id);
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    onChange({
      ...template,
      meals: meals.map(m => m.id === id ? { ...m, ...updates } : m)
    });
  };

  const removeMeal = (id: string) => {
    onChange({
      ...template,
      meals: meals.filter(m => m.id !== id).map((m, i) => ({ ...m, order: i }))
    });
  };

  const addFoodItem = (mealId: string) => {
    const newItem: MealItem = {
      id: uuidv4(),
      name: '',
      amount: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      updateMeal(mealId, { items: [...meal.items, newItem] });
    }
  };

  const updateFoodItem = (mealId: string, itemId: string, updates: Partial<MealItem>) => {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      updateMeal(mealId, {
        items: meal.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
      });
    }
  };

  const removeFoodItem = (mealId: string, itemId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      updateMeal(mealId, {
        items: meal.items.filter(item => item.id !== itemId)
      });
    }
  };

  const cloneMeal = (meal: Meal) => {
    const cloned: Meal = {
      ...meal,
      id: uuidv4(),
      order: meals.length,
      items: meal.items.map(item => ({ ...item, id: uuidv4() }))
    };
    onChange({ ...template, meals: [...meals, cloned] });
    setExpandedMealId(cloned.id);
  };

  const applyMealToDays = (meal: Meal) => {
    const newMeal: Meal = {
      ...meal,
      id: uuidv4(),
      name: `${meal.name} (Global)`,
      items: meal.items.map(i => ({ ...i, id: uuidv4() }))
    };
    // In this simple implementation, we just add it again as a "Global" meal
    // or we could flag it. For now, let's just clone it.
    onChange({ ...template, meals: [...meals, newMeal] });
    alert(`Refeição "${meal.name}" replicada como base global.`);
  };

  const duplicateEntireDay = () => {
    if (!template.dayOfWeek) return alert("Selecione um dia para replicar.");
    alert(`Protocolo de ${template.dayOfWeek} replicado para toda a estrutura semanal.`);
    onChange({ ...template, dayOfWeek: 'Todos' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="app-label text-xs">Nome da Dieta / Protocolo</label>
          <input 
            type="text" 
            placeholder="Ex: Cutting - Fase 1" 
            className="app-input" 
            value={template.name || ''} 
            onChange={e => onChange({ ...template, name: e.target.value })} 
          />
        </div>
        <div className="space-y-2">
          <label className="app-label text-xs">Período de Referência</label>
          <select 
            className="app-input" 
            value={template.dayOfWeek || ''} 
            onChange={e => onChange({ ...template, dayOfWeek: e.target.value })}
          >
            <option value="">Selecione o dia...</option>
            <option value="Segunda">Segunda-feira</option>
            <option value="Terça">Terça-feira</option>
            <option value="Quarta">Quarta-feira</option>
            <option value="Quinta">Quinta-feira</option>
            <option value="Sexta">Sexta-feira</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
            <option value="Todos">Global (Todos os Dias)</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-3 flex-1">
            <div className="app-card !p-3 bg-app-card/50 text-center border-app-border">
            <span className="text-[10px] text-app-muted block font-bold uppercase tracking-widest">Calorias</span>
            <span className="font-black text-sm text-white">{Math.round(totals.calories)}</span>
          </div>
          <div className="app-card !p-3 bg-app-accent/5 text-center border-app-accent/20">
            <span className="text-[10px] text-app-accent block font-bold uppercase tracking-widest">Proteína</span>
            <span className="font-black text-sm text-white">{Math.round(totals.protein)}g</span>
          </div>
          <div className="app-card !p-3 bg-yellow-500/5 text-center border-yellow-500/20">
            <span className="text-[10px] text-yellow-500 block font-bold uppercase tracking-widest">Carbos</span>
            <span className="font-black text-sm text-white">{Math.round(totals.carbs)}g</span>
          </div>
          <div className="app-card !p-3 bg-red-500/5 text-center border-red-500/20">
            <span className="text-[10px] text-red-500 block font-bold uppercase tracking-widest">Gordura</span>
            <span className="font-black text-sm text-white">{Math.round(totals.fat)}g</span>
          </div>
          </div>
          <button onClick={duplicateEntireDay} className="w-full py-2 bg-app-card border border-app-border hover:border-app-accent text-app-muted hover:text-app-accent transition-all rounded-xl text-[10px] font-bold uppercase tracking-wider">
             Replicar para Semana Inteira
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-app-border pb-6">
          <h4 className="app-heading text-lg">Protocolo Nutricional</h4>
          <div className="flex gap-3">
            <button 
              onClick={async () => {
                const aiData = await generateDietFromAI(template.description || 'Cutting');
                onChange({ ...template, ...aiData });
              }}
              className="px-4 py-2 bg-app-card border border-app-border text-app-muted hover:border-app-accent hover:text-app-accent transition-all rounded-xl flex items-center gap-2 text-[10px] font-bold group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-app-accent/50 group-hover:bg-app-accent animate-pulse" />
              Gerar Dieta com IA
            </button>
            <button onClick={addMeal} className="app-button-primary !py-2 !px-6 !text-xs !font-black uppercase tracking-widest shadow-glow-accent">
              <Plus size={18} className="mr-1" /> Adicionar Refeição
            </button>
          </div>
        </div>

        <Reorder.Group axis="y" values={meals} onReorder={(newOrder) => onChange({ ...template, meals: newOrder.map((m, i) => ({ ...m, order: i })) })} className="space-y-3">
          {meals.map((meal) => (
            <Reorder.Item 
              key={meal.id} 
              value={meal}
              className="app-card !p-0 overflow-hidden hover:border-app-accent/30 transition-all border-2 border-transparent"
            >
              <div className={clsx(
                "p-5 flex items-center gap-6",
                expandedMealId === meal.id ? "bg-app-accent/5" : "bg-app-card"
              )}>
                <div className="cursor-grab active:cursor-grabbing text-app-muted">
                  <GripVertical size={20} className="hover:text-app-accent transition-colors" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                  <input 
                    className="app-input font-black text-lg text-white uppercase tracking-tight bg-transparent border-none p-0 focus:ring-0 w-full" 
                    value={meal.name} 
                    onChange={e => updateMeal(meal.id, { name: e.target.value })} 
                  />
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-app-accent" />
                    <input 
                      type="time" 
                      className="app-input text-sm w-32 font-bold" 
                      value={meal.time || ''} 
                      onChange={e => updateMeal(meal.id, { time: e.target.value })} 
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-app-muted">
                    <span className="hidden lg:inline uppercase tracking-widest">{meal.items.length} ITENS</span>
                    <span className="bg-app-accent/10 px-3 py-1.5 rounded-xl text-app-accent border border-app-accent/20">
                      {Math.round(meal.items.reduce((sum, i) => sum + i.calories, 0))} KCAL
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-l border-app-border pl-4">
                  <button onClick={() => applyMealToDays(meal)} className="p-3 bg-app-accent/5 text-app-muted hover:text-app-accent hover:bg-app-accent/10 rounded-xl transition-all shadow-sm" title="Replicar">
                    <Scale size={18} />
                  </button>
                  <button onClick={() => cloneMeal(meal)} className="p-3 bg-app-accent/5 text-app-muted hover:text-app-accent hover:bg-app-accent/10 rounded-xl transition-all shadow-sm" title="Duplicar">
                    <Copy size={18} />
                  </button>
                  <button onClick={() => removeMeal(meal.id)} className="p-3 bg-red-500/5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shadow-sm" title="Remover">
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => setExpandedMealId(expandedMealId === meal.id ? null : meal.id)}
                    className="p-3 bg-app-card border border-app-border text-app-accent hover:scale-110 transition-all rounded-xl"
                  >
                    {expandedMealId === meal.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedMealId === meal.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-app-border p-6 bg-app-card/50"
                  >
                    <div className="space-y-4">
                      {meal.items.map(item => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-app-border pb-4 last:border-0 last:pb-0 group/item">
                          <div className="md:col-span-4 space-y-1">
                            <label className="app-label text-[9px]">Alimento / Ingrediente</label>
                            <input 
                              placeholder="Fille de Frango, Arroz..." 
                              className="app-input text-xs font-bold" 
                              value={item.name} 
                              onChange={e => updateFoodItem(meal.id, item.id, { name: e.target.value })} 
                            />
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="app-label text-[9px]">Qtd (g/ml)</label>
                            <input 
                              type="number" 
                              className="app-input text-xs text-center font-bold" 
                              value={item.amount} 
                              onChange={e => updateFoodItem(meal.id, item.id, { amount: Number(e.target.value) })} 
                            />
                          </div>
                          <div className="md:col-span-1 space-y-1">
                            <label className="app-label text-[9px] text-center">Kcal</label>
                            <input type="number" className="app-input text-[11px] text-center p-2 font-bold" value={item.calories} onChange={e => updateFoodItem(meal.id, item.id, { calories: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 space-y-1">
                            <label className="app-label text-[9px] text-center text-app-accent">P (g)</label>
                            <input type="number" className="app-input text-[11px] text-center p-2 font-bold border-app-accent/20" value={item.protein} onChange={e => updateFoodItem(meal.id, item.id, { protein: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 space-y-1">
                            <label className="app-label text-[9px] text-center text-yellow-500">C (g)</label>
                            <input type="number" className="app-input text-[11px] text-center p-2 font-bold border-yellow-500/20" value={item.carbs} onChange={e => updateFoodItem(meal.id, item.id, { carbs: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 space-y-1">
                            <label className="app-label text-[9px] text-center text-red-500">G (g)</label>
                            <input type="number" className="app-input text-[11px] text-center p-2 font-bold border-red-500/20" value={item.fat} onChange={e => updateFoodItem(meal.id, item.id, { fat: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button onClick={() => removeFoodItem(meal.id, item.id)} className="p-2 text-app-muted hover:text-red-500 transition-colors bg-app-card border border-app-border rounded-xl">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addFoodItem(meal.id)}
                        className="w-full py-4 border-2 border-dashed border-app-border rounded-xl text-app-accent hover:bg-app-accent/5 font-bold text-xs uppercase transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Adicionar Novo Item
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {meals.length === 0 && (
          <div className="py-20 border-2 border-dashed border-app-border rounded-3xl text-center flex flex-col items-center justify-center gap-6 bg-app-card/30">
            <div className="p-6 bg-app-accent/5 rounded-full">
              <Utensils size={40} className="text-app-accent opacity-30" />
            </div>
            <div className="space-y-1">
              <h4 className="app-heading text-xl opacity-60">Nenhuma refeição planejada</h4>
              <p className="text-app-muted text-sm">Inicie o protocolo nutricional elite agora.</p>
            </div>
            <button onClick={addMeal} className="app-button-outline !px-10">Montar Primeiro Cardápio</button>
          </div>
        )}
      </div>
    </div>
  );
}
