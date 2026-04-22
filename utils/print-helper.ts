"use client";

import { Athlete, WorkoutTemplate, DietTemplate, SystemSettings } from '@/types';

interface PrintData {
  athlete: Partial<Athlete>;
  workouts: Partial<WorkoutTemplate>[];
  diet?: Partial<DietTemplate>;
  settings: SystemSettings;
}

export function openPrintWindow(data: PrintData) {
  const { athlete, workouts, diet, settings } = data;
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  // Sorting logic for days of the week
  const dayOrder: Record<string, number> = {
    'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6, 'Domingo': 7
  };

  const sortedWorkouts = [...workouts].sort((a, b) => {
    const orderA = a.dayOfWeek ? (dayOrder[a.dayOfWeek] || 99) : 99;
    const orderB = b.dayOfWeek ? (dayOrder[b.dayOfWeek] || 99) : 99;
    return orderA - orderB;
  });

  // Build workout HTML
  let workoutsHTML = '';
  sortedWorkouts.forEach((w, wIdx) => {
    let exerciseCounter = 0;
    
    let exercisesHTML = '';
    (w.exercises || []).forEach((ex, idx) => {
      if (ex.muscleGroup?.toUpperCase() === 'SEPARADOR') {
        exercisesHTML += `
          <tr>
            <td colspan="6" style="padding:12px 6px 4px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #ccc;color:#222;">
              ▸ ${ex.name}
            </td>
          </tr>`;
        return;
      }
      exerciseCounter++;
      const bg = exerciseCounter % 2 === 0 ? '#f5f5f5' : 'transparent';
      const restFormatted = ex.restTime ? `${Math.floor(ex.restTime / 60)}'${(ex.restTime % 60) > 0 ? ` ${ex.restTime % 60}"` : ''}` : '--';
      
      exercisesHTML += `
        <tr style="background:${bg};border-bottom:1px solid #e8e8e8;">
          <td style="padding:6px;font-weight:900;color:#ccc;font-size:13px;vertical-align:top;width:30px;">${exerciseCounter.toString().padStart(2, '0')}</td>
          <td style="padding:6px;font-weight:700;font-size:11px;text-transform:uppercase;vertical-align:top;">
            ${ex.name}
            ${ex.advancedTechnique ? `<span style="display:inline-block;margin-left:6px;background:#111;color:#fff;padding:1px 5px;font-size:7px;font-weight:800;border-radius:2px;vertical-align:middle;">${ex.advancedTechnique}</span>` : ''}
          </td>
          <td style="padding:6px;font-size:9px;color:#666;font-weight:600;text-transform:uppercase;vertical-align:top;width:75px;">${ex.muscleGroup}</td>
          <td style="padding:6px;text-align:center;font-weight:900;font-size:13px;vertical-align:top;width:45px;">${ex.sets}</td>
          <td style="padding:6px;font-weight:600;font-size:9.5px;color:#333;vertical-align:top;line-height:1.35;">${ex.reps}</td>
          <td style="padding:6px;text-align:center;font-size:9px;color:#666;font-weight:600;vertical-align:top;width:50px;">${restFormatted}</td>
        </tr>`;
    });

    const dayLabel = w.dayOfWeek ? `<span style="background:#a3e635;color:#000;padding:2px 8px;border-radius:4px;margin-right:10px;font-size:11px;">${w.dayOfWeek.toUpperCase()}</span>` : '';
    
    workoutsHTML += `
      <div style="margin-bottom:24px;page-break-inside:avoid;padding-top:${wIdx > 0 ? '16px' : '0'};">
        <div style="border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
          <div style="background:#111;color:#fff;padding:3px 10px;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;">
            ${wIdx + 1}
          </div>
          <div style="font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:-0.3px;display:flex;align-items:center;">
            ${dayLabel} ${w.name || 'Programa de Treinamento'}
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <thead>
            <tr style="border-bottom:2px solid #333;">
              <th style="text-align:left;padding:4px 6px;font-size:8px;font-weight:800;text-transform:uppercase;color:#888;letter-spacing:1px;width:30px;">#</th>
              <th style="text-align:left;padding:4px 6px;font-size:8px;font-weight:800;text-transform:uppercase;color:#888;letter-spacing:1px;">Exercício</th>
              <th style="text-align:left;padding:4px 6px;font-size:8px;font-weight:800;text-transform:uppercase;color:#888;letter-spacing:1px;width:75px;">Grupo</th>
              <th style="text-align:center;padding:4px 6px;font-size:8px;font-weight:800;text-transform:uppercase;color:#888;letter-spacing:1px;width:45px;">Séries</th>
              <th style="text-align:left;padding:4px 6px;font-size:8px;font-weight:800;text-transform:uppercase;color:#888;letter-spacing:1px;">Repetições / Orientação</th>
              <th style="text-align:center;padding:4px 6px;font-size:8px;font-weight:800;text-transform:uppercase;color:#888;letter-spacing:1px;width:50px;">Desc.</th>
            </tr>
          </thead>
          <tbody>${exercisesHTML}</tbody>
        </table>
        ${w.description ? `<div style="margin-top:8px;padding:6px 10px;background:#f0f0f0;border:1px solid #e0e0e0;font-size:9px;color:#555;font-weight:600;page-break-inside:avoid;"><strong>Obs:</strong> ${w.description}</div>` : ''}
      </div>`;
  });

  // Build diet HTML  
  let dietHTML = '';
  if (diet && diet.meals && diet.meals.length > 0) {
    let mealsHTML = '';
    diet.meals.forEach((meal, mIdx) => {
      mealsHTML += `
        <tr style="border-bottom:1px solid #ccc;">
          <td colspan="4" style="padding:10px 6px 4px;font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">
            ${meal.name} ${meal.time ? `<span style="margin-left:8px;font-size:9px;color:#888;font-weight:600;">${meal.time}</span>` : ''}
          </td>
        </tr>`;
      meal.items.forEach((item, iIdx) => {
        mealsHTML += `
          <tr style="background:${iIdx % 2 === 0 ? '#fafafa' : 'transparent'};border-bottom:1px solid #f0f0f0;">
            <td style="padding:4px 6px 4px 16px;font-weight:600;font-size:10px;">${item.name}</td>
            <td style="padding:4px 6px;text-align:right;font-weight:800;font-size:10px;width:60px;">${item.amount}g</td>
            <td style="padding:4px 6px;text-align:right;font-size:9px;color:#888;width:55px;">${item.calories ? `${item.calories} kcal` : ''}</td>
            <td style="padding:4px 6px;text-align:right;font-size:8px;color:#aaa;width:100px;">${item.protein ? `P${item.protein}` : ''} ${item.carbs ? `C${item.carbs}` : ''} ${item.fat ? `G${item.fat}` : ''}</td>
          </tr>`;
      });
      mealsHTML += `<tr><td colspan="4" style="padding:4px;"></td></tr>`;
    });

    dietHTML = `
      <div style="page-break-inside:avoid;margin-top:24px;margin-bottom:20px;">
        <div style="border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
          <div style="background:#111;color:#fff;padding:3px 10px;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;">NUTRIÇÃO</div>
          <div style="font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:-0.3px;">${diet.name || 'Planejamento Nutricional'}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">${mealsHTML}</table>
      </div>`;
  }

  const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Protocolo - ${athlete.name || 'Atleta'}</title>
  <style>
    @page { margin: 8mm 10mm; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 11px; line-height: 1.4; color: #111; background: white; padding: 6mm; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
  </style>
</head>
<body>
  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:10px;margin-bottom:12px;">
    <div>
      ${settings.logoUrl ? `<img src="${settings.logoUrl}" style="height:40px;object-fit:contain;margin-bottom:6px;" />` : `<div style="background:#111;color:#fff;padding:4px 14px;font-weight:900;font-size:17px;letter-spacing:-0.5px;display:inline-block;margin-bottom:6px;">${settings.appName || 'ENDURANCEFIT PRO'}</div>`}
      <div style="font-size:9px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:2px;">
        ${settings.trainerName || 'Personal Coach'} &bull; Prescrição Individualizada
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;">${athlete.name || 'ATLETA'}</div>
      <div style="font-size:9px;color:#888;font-weight:600;">${currentDate}</div>
    </div>
  </div>

  <!-- BIO -->
  <div style="display:flex;border-bottom:1px solid #ddd;margin-bottom:16px;padding-bottom:8px;">
    <div style="flex:1;border-right:1px solid #eee;padding-right:10px;">
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;color:#aaa;letter-spacing:1px;margin-bottom:2px;">Peso</div>
      <div style="font-size:15px;font-weight:900;">${athlete.weight ? `${athlete.weight} kg` : '--'}</div>
    </div>
    <div style="flex:1;border-right:1px solid #eee;padding:0 10px;">
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;color:#aaa;letter-spacing:1px;margin-bottom:2px;">Altura</div>
      <div style="font-size:15px;font-weight:900;">${athlete.height ? `${athlete.height} cm` : '--'}</div>
    </div>
    <div style="flex:1;border-right:1px solid #eee;padding:0 10px;">
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;color:#aaa;letter-spacing:1px;margin-bottom:2px;">Categoria</div>
      <div style="font-size:15px;font-weight:900;text-transform:uppercase;">${athlete.category || 'Online'}</div>
    </div>
    <div style="flex:1;padding-left:10px;">
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;color:#aaa;letter-spacing:1px;margin-bottom:2px;">Objetivo</div>
      <div style="font-size:15px;font-weight:900;text-transform:uppercase;">${athlete.goal || 'Performance'}</div>
    </div>
  </div>

  <!-- WORKOUTS -->
  ${workoutsHTML}

  <!-- DIET -->
  ${dietHTML}

  <!-- FOOTER -->
  <div style="margin-top:20px;padding-top:8px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:8px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
    <span>Documento de Prescrição &bull; ${currentDate}</span>
    <span>${settings.appName || 'ENDURANCEFIT PRO'}</span>
  </div>
</body>
</html>`;

  // Open new window and print
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(fullHTML);
    printWindow.document.close();
    // Wait for content to render, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 300);
    };
    // Fallback if onload doesn't fire
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  }
}
