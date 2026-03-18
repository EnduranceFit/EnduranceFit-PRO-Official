"use client";

import { useState, useMemo } from 'react';
import { Plus, Trash2, Copy, Clock, Scale, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Meal, MealItem, DietTemplate } from '@/types';
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
    alert(`CLONE_MEAL: Refeição "${meal.name}" aplicada em todos os dias da sequência.`);
  };

  const duplicateEntireDay = () => {
    alert("SYS_SYNC: Dieta completa replicada para o cronograma semanal.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="tech-label block mb-1">PROT_DIA_REFERENCIA</label>
          <select 
            className="tech-input" 
            value={template.dayOfWeek || ''} 
            onChange={e => onChange({ ...template, dayOfWeek: e.target.value })}
          >
            <option value="">Selecione...</option>
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
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-4 gap-2 flex-1">
            <div className="bg-[#050505] p-2 rounded-sm border border-[#001F3F] text-center shadow-[0_0_10px_rgba(0,31,63,0.1)]">
              <span className="text-[8px] text-[#607080] block font-mono">KCAL</span>
              <span className="font-mono text-xs text-white">{Math.round(totals.calories)}</span>
            </div>
            <div className="bg-[#050505] p-2 rounded-sm border border-[#001F3F] text-center shadow-[0_0_10px_rgba(0,31,63,0.1)]">
              <span className="text-[8px] text-[#004080] block font-mono">PROT</span>
              <span className="font-mono text-xs text-white">{Math.round(totals.protein)}g</span>
            </div>
            <div className="bg-[#050505] p-2 rounded-sm border border-[#001F3F] text-center shadow-[0_0_10px_rgba(0,31,63,0.1)]">
              <span className="text-[8px] text-yellow-900 block font-mono">CARB</span>
              <span className="font-mono text-xs text-white">{Math.round(totals.carbs)}g</span>
            </div>
            <div className="bg-[#050505] p-2 rounded-sm border border-[#001F3F] text-center shadow-[0_0_10px_rgba(0,31,63,0.1)]">
              <span className="text-[8px] text-red-900 block font-mono">FAT</span>
              <span className="font-mono text-xs text-white">{Math.round(totals.fat)}g</span>
            </div>
          </div>
          <button onClick={duplicateEntireDay} className="px-3 h-full bg-[#001F3F]/50 border border-[#004080] hover:bg-[#001F3F] text-[#004080] hover:text-white transition-all rounded-sm text-[10px] font-mono uppercase tracking-tighter">
             {"[ >> ]"} DUPLICAR_DIA
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#001F3F] pb-4">
          <h4 className="tech-heading text-sm text-white uppercase tracking-widest">Protocolo Nutricional</h4>
          <div className="flex gap-2">
            <button 
              onClick={async () => {
                const aiData = await generateDietFromAI(template.description || 'Cutting');
                onChange({ ...template, ...aiData });
              }}
              className="px-3 py-1.5 bg-[#001F3F]/20 border border-[#004080] text-[#004080] hover:text-white transition-all rounded-sm flex items-center gap-2 text-[10px] font-mono group"
            >
              <div className="w-2 h-2 rounded-full bg-[#004080] group-hover:bg-white animate-pulse" />
              GERAR_IA
            </button>
            <button onClick={addMeal} className="tech-button text-xs py-1.5 px-4 h-9">
              <Plus size={16} /> Nova Refeição
            </button>
          </div>
        </div>

        <Reorder.Group axis="y" values={meals} onReorder={(newOrder) => onChange({ ...template, meals: newOrder.map((m, i) => ({ ...m, order: i })) })} className="space-y-3">
          {meals.map((meal) => (
            <Reorder.Item 
              key={meal.id} 
              value={meal}
              className="bg-[#050505] border border-[#001F3F] rounded-sm hover:border-[#004080] transition-colors"
            >
              <div className={clsx(
                "p-4 flex items-center gap-4",
                expandedMealId === meal.id ? "bg-[#001F3F]/10" : ""
              )}>
                <div className="cursor-grab active:cursor-grabbing text-[#607080] pt-1">
                  <GripVertical size={18} />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  <input 
                    className="tech-input font-bold text-white uppercase tracking-tight bg-transparent border-none p-0 focus:ring-0" 
                    value={meal.name} 
                    onChange={e => updateMeal(meal.id, { name: e.target.value })} 
                  />
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#004080]" />
                    <input 
                      type="time" 
                      className="tech-input text-xs w-24" 
                      value={meal.time || ''} 
                      onChange={e => updateMeal(meal.id, { time: e.target.value })} 
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-[#607080]">
                    <span className="hidden lg:inline">{meal.items.length} ITENS_SYNC</span>
                    <span className="bg-[#001F3F]/30 px-2 py-0.5 rounded-sm border border-[#001F3F] text-white">
                      {Math.round(meal.items.reduce((sum, i) => sum + i.calories, 0))} KCAL
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 border-l border-[#001F3F] pl-2">
                  <button onClick={() => applyMealToDays(meal)} className="p-2 text-[#607080] hover:text-white" title="Replicar">
                    <Scale size={16} />
                  </button>
                  <button onClick={() => cloneMeal(meal)} className="p-2 text-[#607080] hover:text-white" title="Duplicar">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => removeMeal(meal.id)} className="p-2 text-red-900/50 hover:text-red-500" title="Remover">
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => setExpandedMealId(expandedMealId === meal.id ? null : meal.id)}
                    className="p-2 text-[#004080] hover:scale-110 transition-transform"
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
                    className="border-t border-[#001F3F] p-4 bg-black/40"
                  >
                    <div className="space-y-3">
                      {meal.items.map(item => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b border-[#001F3F]/30 pb-3 last:border-0 last:pb-0">
                          <div className="md:col-span-4">
                            <label className="text-[9px] text-[#004080] uppercase block mb-1">ALIMENTO</label>
                            <input 
                              placeholder="Nome do Alimento" 
                              className="tech-input text-xs" 
                              value={item.name} 
                              onChange={e => updateFoodItem(meal.id, item.id, { name: e.target.value })} 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[9px] text-[#004080] uppercase block mb-1">QTD (G/ML)</label>
                            <input 
                              type="number" 
                              className="tech-input text-xs text-center" 
                              value={item.amount} 
                              onChange={e => updateFoodItem(meal.id, item.id, { amount: Number(e.target.value) })} 
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[9px] text-[#004080] uppercase block mb-1 text-center">KCAL</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.calories} onChange={e => updateFoodItem(meal.id, item.id, { calories: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[9px] text-[#004080] uppercase block mb-1 text-center">P</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.protein} onChange={e => updateFoodItem(meal.id, item.id, { protein: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[9px] text-[#004080] uppercase block mb-1 text-center">C</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.carbs} onChange={e => updateFoodItem(meal.id, item.id, { carbs: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[9px] text-[#004080] uppercase block mb-1 text-center">G</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.fat} onChange={e => updateFoodItem(meal.id, item.id, { fat: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button onClick={() => removeFoodItem(meal.id, item.id)} className="p-2 text-[#607080] hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addFoodItem(meal.id)}
                        className="w-full py-2 border border-dashed border-[#001F3F] rounded-sm text-[#004080] hover:text-white hover:border-[#004080] text-[10px] font-mono uppercase transition-all"
                      >
                        {"[ + ] ADICIONAR_ALIMENTO"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {meals.length === 0 && (
          <div className="py-12 border border-dashed border-[#001F3F] rounded-sm text-center text-[#607080] font-mono text-xs uppercase tracking-widest">
            Sem Refeições. Clique em [+] para iniciar protocolo.
          </div>
        )}
      </div>
    </div>
  );
}
