"use client";

import { useState, useMemo } from 'react';
import { Plus, Trash2, Copy, Clock, Scale, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Meal, MealItem, DietTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { motion, Reorder, AnimatePresence } from "framer-motion";
import clsx from 'clsx';

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

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="tech-label block mb-1">Dia de Referência</label>
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
            <option value="Todos">Todos os Dias</option>
          </select>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#1e293b] p-2 rounded-lg border border-[#334155] text-center">
            <span className="text-[10px] text-[#808090] block">KCAL</span>
            <span className="font-mono text-sm text-white">{Math.round(totals.calories)}</span>
          </div>
          <div className="bg-[#1e293b] p-2 rounded-lg border border-[#334155] text-center">
            <span className="text-[10px] text-[#808090] block">PROT</span>
            <span className="font-mono text-sm text-blue-400">{Math.round(totals.protein)}g</span>
          </div>
          <div className="bg-[#1e293b] p-2 rounded-lg border border-[#334155] text-center">
            <span className="text-[10px] text-[#808090] block">CARB</span>
            <span className="font-mono text-sm text-yellow-400">{Math.round(totals.carbs)}g</span>
          </div>
          <div className="bg-[#1e293b] p-2 rounded-lg border border-[#334155] text-center">
            <span className="text-[10px] text-[#808090] block">FAT</span>
            <span className="font-mono text-sm text-red-400">{Math.round(totals.fat)}g</span>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="tech-heading text-sm text-[#3b82f6] uppercase tracking-wider">Refeições ({meals.length})</h4>
          <button onClick={addMeal} className="tech-button text-xs py-1 px-3">
            <Plus size={14} /> Adicionar Refeição
          </button>
        </div>

        <Reorder.Group axis="y" values={meals} onReorder={(newOrder) => onChange({ ...template, meals: newOrder.map((m, i) => ({ ...m, order: i })) })} className="space-y-3">
          {meals.map((meal) => (
            <Reorder.Item 
              key={meal.id} 
              value={meal}
              className="glass-panel border-[#334155] overflow-hidden"
            >
              {/* Meal Header */}
              <div className={clsx(
                "p-4 flex items-center gap-4 transition-colors",
                expandedMealId === meal.id ? "bg-[rgba(59,130,246,0.05)]" : "hover:bg-[rgba(255,255,255,0.02)]"
              )}>
                <div className="cursor-grab active:cursor-grabbing text-[#808090]">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    className="tech-input font-bold text-white bg-transparent border-none p-0 focus:ring-0" 
                    value={meal.name} 
                    onChange={e => updateMeal(meal.id, { name: e.target.value })} 
                  />
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#808090]" />
                    <input 
                      type="time" 
                      className="tech-input text-xs w-24" 
                      value={meal.time || ''} 
                      onChange={e => updateMeal(meal.id, { time: e.target.value })} 
                    />
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-[#808090]">
                    <span>{meal.items.length} itens</span>
                    <span>{Math.round(meal.items.reduce((sum, i) => sum + i.calories, 0))} kcal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => cloneMeal(meal)} className="p-2 text-[#808090] hover:text-[#3b82f6]" title="Duplicar">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => removeMeal(meal.id)} className="p-2 text-[#808090] hover:text-red-500" title="Remover">
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => setExpandedMealId(expandedMealId === meal.id ? null : meal.id)}
                    className="p-2 text-[#3b82f6]"
                  >
                    {expandedMealId === meal.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Meal Content (Expanded) */}
              <AnimatePresence>
                {expandedMealId === meal.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#334155] p-4 bg-black/20"
                  >
                    <div className="space-y-3">
                      {meal.items.map(item => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b border-[#334155]/50 pb-3 last:border-0">
                          <div className="md:col-span-4">
                            <label className="text-[10px] text-[#808090] uppercase block mb-1">Alimento</label>
                            <input 
                              type="text" 
                              className="tech-input text-xs" 
                              placeholder="Nome do Alimento" 
                              value={item.name} 
                              onChange={e => updateFoodItem(meal.id, item.id, { name: e.target.value })} 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] text-[#808090] uppercase block mb-1">Qtd (g)</label>
                            <input 
                              type="number" 
                              className="tech-input text-xs text-center" 
                              value={item.amount} 
                              onChange={e => updateFoodItem(meal.id, item.id, { amount: Number(e.target.value) })} 
                            />
                          </div>
                          <div className="md:col-span-1 text-center">
                            <label className="text-[10px] text-[#808090] uppercase block mb-1">Kcal</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.calories} onChange={e => updateFoodItem(meal.id, item.id, { calories: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 text-center">
                            <label className="text-[10px] text-[#808090] uppercase block mb-1">P</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.protein} onChange={e => updateFoodItem(meal.id, item.id, { protein: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 text-center">
                            <label className="text-[10px] text-[#808090] uppercase block mb-1">C</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.carbs} onChange={e => updateFoodItem(meal.id, item.id, { carbs: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 text-center">
                            <label className="text-[10px] text-[#808090] uppercase block mb-1">G</label>
                            <input type="number" className="tech-input text-[10px] text-center p-1" value={item.fat} onChange={e => updateFoodItem(meal.id, item.id, { fat: Number(e.target.value) })} />
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button onClick={() => removeFoodItem(meal.id, item.id)} className="p-2 text-[#808090] hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addFoodItem(meal.id)}
                        className="w-full py-2 border border-dashed border-[#334155] rounded-lg text-[#808090] hover:text-white hover:border-[#3b82f6] text-xs font-mono transition-all"
                      >
                        + Adicionar Item ao {meal.name}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {meals.length === 0 && (
          <div className="py-12 border-2 border-dashed border-[#334155] rounded-xl text-center text-[#808090] font-mono text-sm">
            Nenhuma refeição adicionada. Clique em "Adicionar Refeição" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
