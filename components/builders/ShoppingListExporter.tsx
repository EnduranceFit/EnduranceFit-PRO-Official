"use client";

import { ShoppingCart } from 'lucide-react';
import { DietTemplate, MealItem } from '@/types';

interface ShoppingListExporterProps {
  diet: Partial<DietTemplate>;
}

export default function ShoppingListExporter({ diet }: ShoppingListExporterProps) {
  const generateList = () => {
    const items: Record<string, number> = {};
    
    diet.meals?.forEach(meal => {
      meal.items.forEach(item => {
        const name = item.name.trim().toLowerCase();
        items[name] = (items[name] || 0) + item.amount;
      });
    });

    const listText = Object.entries(items)
      .map(([name, amount]) => `- ${name.charAt(0).toUpperCase() + name.slice(1)}: ${amount}g`)
      .join('\n');

    if (!listText) {
      alert("Nenhum item na dieta para gerar lista.");
      return;
    }

    const blob = new Blob([`LISTA DE COMPRAS - ENDURANCEFIT\n\n${listText}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-de-compras-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <button 
      onClick={generateList}
      className="app-button-outline w-full flex items-center justify-center gap-2"
    >
      <ShoppingCart size={18} /> Gerar Lista de Compras
    </button>
  );
}
