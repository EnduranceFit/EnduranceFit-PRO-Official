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
            <td colspan="6" style="padding:16px 8px 6px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;border-bottom:1.5px solid #000;color:#000;">
              ▸ ${ex.name}
            </td>
          </tr>`;
        return;
      }
      exerciseCounter++;
      const restFormatted = ex.restTime ? `${Math.floor(ex.restTime / 60)}'${(ex.restTime % 60) > 0 ? ` ${ex.restTime % 60}"` : ''}` : '--';
      
      exercisesHTML += `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 8px;font-weight:700;color:#bbb;font-size:11px;width:30px;">${exerciseCounter.toString().padStart(2, '0')}</td>
          <td style="padding:10px 8px;font-weight:800;font-size:12px;text-transform:uppercase;">
            ${ex.name}
            ${ex.advancedTechnique ? `<span style="display:inline-block;margin-left:8px;background:#f3f4f6;color:#374151;padding:2px 6px;font-size:8px;font-weight:800;border-radius:3px;vertical-align:middle;border:1px solid #e5e7eb;">${ex.advancedTechnique}</span>` : ''}
          </td>
          <td style="padding:10px 8px;font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;width:80px;">${ex.muscleGroup}</td>
          <td style="padding:10px 8px;text-align:center;font-weight:900;font-size:14px;width:45px;">${ex.sets}</td>
          <td style="padding:10px 8px;font-weight:600;font-size:10px;color:#1e293b;line-height:1.4;">${ex.reps}</td>
          <td style="padding:10px 8px;text-align:center;font-size:10px;color:#64748b;font-weight:700;width:55px;">${restFormatted}</td>
        </tr>`;
    });

    const dayPill = w.dayOfWeek ? `<span style="border:1.5px solid #000;color:#000;padding:2px 10px;border-radius:100px;font-size:11px;font-weight:900;margin-right:12px;text-transform:uppercase;">${w.dayOfWeek}</span>` : '';
    
    workoutsHTML += `
      <div style="margin-bottom:35px;page-break-inside:avoid;padding-top:${wIdx > 0 ? '20px' : '0'};">
        <div style="display:flex;align-items:center;border-bottom:3px solid #000;padding-bottom:8px;margin-bottom:12px;gap:4px;">
          <div style="background:#000;color:#fff;padding:4px 12px;font-size:11px;font-weight:900;letter-spacing:1px;text-transform:uppercase;border-radius:2px;">
            TREINO ${wIdx + 1}
          </div>
          <div style="font-size:16px;font-weight:900;text-transform:uppercase;letter-spacing:-0.4px;display:flex;align-items:center;margin-left:8px;">
            ${dayPill} ${w.name || 'Programa de Treinamento'}
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #000;">
              <th style="text-align:left;padding:6px 8px;font-size:8px;font-weight:800;text-transform:uppercase;color:#94a3b8;letter-spacing:1px;width:30px;">#</th>
              <th style="text-align:left;padding:6px 8px;font-size:8px;font-weight:800;text-transform:uppercase;color:#94a3b8;letter-spacing:1px;">Exercício</th>
              <th style="text-align:left;padding:6px 8px;font-size:8px;font-weight:800;text-transform:uppercase;color:#94a3b8;letter-spacing:1px;width:80px;">Grupo</th>
              <th style="text-align:center;padding:6px 8px;font-size:8px;font-weight:800;text-transform:uppercase;color:#94a3b8;letter-spacing:1px;width:45px;">Séries</th>
              <th style="text-align:left;padding:6px 8px;font-size:8px;font-weight:800;text-transform:uppercase;color:#94a3b8;letter-spacing:1px;">Repetições / Orientação</th>
              <th style="text-align:center;padding:6px 8px;font-size:8px;font-weight:800;text-transform:uppercase;color:#94a3b8;letter-spacing:1px;width:55px;">Desc.</th>
            </tr>
          </thead>
          <tbody>${exercisesHTML}</tbody>
        </table>
        ${w.description ? `<div style="margin-top:12px;padding:10px 15px;background:#f8fafc;border-left:4px solid #000;font-size:10px;color:#334155;font-weight:600;line-height:1.5;"><strong>OBSERVAÇÕES:</strong> ${w.description}</div>` : ''}
      </div>`;
  });

  // Build diet HTML  
  let dietHTML = '';
  if (diet && diet.meals && diet.meals.length > 0) {
    let mealsHTML = '';
    diet.meals.forEach((meal, mIdx) => {
      mealsHTML += `
        <tr style="border-bottom:2px solid #eee;">
          <td colspan="4" style="padding:15px 8px 8px;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#000;">
            ${meal.name} ${meal.time ? `<span style="margin-left:12px;font-size:10px;color:#64748b;font-weight:700;">🕒 ${meal.time}</span>` : ''}
          </td>
        </tr>`;
      meal.items.forEach((item, iIdx) => {
        mealsHTML += `
          <tr style="border-bottom:1px solid #f8fafc;">
            <td style="padding:8px 8px 8px 24px;font-weight:700;font-size:11px;color:#1e293b;">${item.name}</td>
            <td style="padding:8px 8px;text-align:right;font-weight:900;font-size:12px;width:70px;color:#000;">${item.amount}g</td>
            <td style="padding:8px 8px;text-align:right;font-size:10px;color:#64748b;font-weight:600;width:70px;">${item.calories ? `${item.calories} kcal` : ''}</td>
            <td style="padding:8px 8px;text-align:right;font-size:9px;color:#94a3b8;font-weight:700;width:120px;">${item.protein ? `P${item.protein}` : ''} ${item.carbs ? `C${item.carbs}` : ''} ${item.fat ? `G${item.fat}` : ''}</td>
          </tr>`;
      });
    });

    dietHTML = `
      <div style="page-break-inside:avoid;margin-top:40px;margin-bottom:30px;">
        <div style="display:flex;align-items:center;border-bottom:3px solid #000;padding-bottom:10px;margin-bottom:15px;gap:8px;">
          <div style="background:#000;color:#fff;padding:5px 15px;font-size:11px;font-weight:900;letter-spacing:1px;text-transform:uppercase;border-radius:2px;">NUTRIÇÃO</div>
          <div style="font-size:16px;font-weight:900;text-transform:uppercase;letter-spacing:-0.4px;">${diet.name || 'Planejamento Nutricional'}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">${mealsHTML}</table>
      </div>`;
  }

  const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Protocolo - ${athlete.name || 'Atleta'}</title>
  <style>
    @page { margin: 10mm; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 1.4; color: #000; background: white; padding: 5mm; }
    table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
    tr { page-break-inside: avoid; }
    .bio-box { border: 1.5px solid #eee; padding: 12px; flex: 1; text-align: center; }
    .bio-label { font-size: 8px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 1.5px; margin-bottom: 6px; }
    .bio-value { font-size: 16px; font-weight: 900; color: #000; }
  </style>
</head>
<body>
  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:25px;">
    <div>
      <div style="font-size:24px;font-weight:950;letter-spacing:-1px;line-height:1;margin-bottom:4px;">${settings.appName?.toUpperCase() || 'ENDURANCEFIT PRO'}</div>
      <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:1px;">${settings.trainerName?.toUpperCase() || 'PERSONAL COACH'} &bull; TREINAMENTO ESPECIALIZADO</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;margin-bottom:2px;">${athlete.name || 'ATLETA'}</div>
      <div style="font-size:10px;color:#94a3b8;font-weight:700;">${currentDate.toUpperCase()}</div>
    </div>
  </div>

  <!-- BIO -->
  <div style="display:flex;gap:12px;margin-bottom:30px;">
    <div class="bio-box">
      <div class="bio-label">PESO</div>
      <div class="bio-value">${athlete.weight ? `${athlete.weight} KG` : '--'}</div>
    </div>
    <div class="bio-box">
      <div class="bio-label">ALTURA</div>
      <div class="bio-value">${athlete.height ? `${athlete.height} CM` : '--'}</div>
    </div>
    <div class="bio-box">
      <div class="bio-label">CATEGORIA</div>
      <div class="bio-value" style="text-transform:uppercase;">${athlete.category || 'ONLINE'}</div>
    </div>
    <div class="bio-box">
      <div class="bio-label">OBJETIVO</div>
      <div class="bio-value" style="text-transform:uppercase;">${athlete.goal || 'PERFORMANCE'}</div>
    </div>
  </div>

  <!-- CONTENT -->
  ${workoutsHTML}
  ${dietHTML}

  <!-- FOOTER -->
  <div style="margin-top:40px;padding-top:15px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:8px;color:#cbd5e1;font-weight:800;text-transform:uppercase;letter-spacing:1px;">
    <span>PRESCRIÇÃO INDIVIDUALIZADA &bull; PROIBIDA A REPRODUÇÃO</span>
    <span>${settings.appName || 'ENDURANCEFIT'} SYSTEM &bull; v2.0</span>
  </div>
</body>
</html>`;

  // Open new window and print
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (printWindow) {
    printWindow.document.write(fullHTML);
    printWindow.document.close();
    // Wait for content to render, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
    // Fallback if onload doesn't fire
    setTimeout(() => {
      if (printWindow.print) printWindow.print();
    }, 1500);
  }
}
