"use client";

import { Athlete, WorkoutTemplate, DietTemplate } from '@/types';
import { useAppContext } from '@/context/AppContext';

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

  const allWorkouts = workouts && workouts.length > 0 ? workouts : (workout ? [workout] : []);

  return (
    <>
      <style jsx global>{`
        .print-doc * { box-sizing: border-box; }
        .avoid-break { break-inside: avoid; page-break-inside: avoid; }
        .page-break { break-before: page; page-break-before: always; }
      `}</style>

      <div className={`print-doc ${className || ''}`} style={{
        width: '100%',
        maxWidth: '210mm',
        margin: '0 auto',
        background: '#fff',
        color: '#111',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '11px',
        lineHeight: 1.4,
        padding: '6mm',
      }}>

        {/* ===== HEADER ===== */}
        <div className="avoid-break" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '3px solid #111',
          paddingBottom: '10px',
          marginBottom: '12px',
        }}>
          <div>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain', marginBottom: '6px' }} />
            ) : (
              <div style={{
                background: '#111', color: '#fff', padding: '4px 12px',
                fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px',
                display: 'inline-block', marginBottom: '6px',
              }}>
                {settings.appName || 'ENDURANCEFIT PRO'}
              </div>
            )}
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {settings.trainerName || 'Personal Coach'} &bull; Prescrição Individualizada
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              {athlete.name || 'ATLETA'}
            </div>
            <div style={{ fontSize: '9px', color: '#888', fontWeight: 600 }}>
              {currentDate}
            </div>
          </div>
        </div>

        {/* ===== BIO BAR ===== */}
        <div className="avoid-break" style={{
          display: 'flex',
          gap: '0',
          borderBottom: '1px solid #ddd',
          marginBottom: '16px',
          paddingBottom: '8px',
        }}>
          {[
            { label: 'Peso', value: athlete.weight ? `${athlete.weight} kg` : '--' },
            { label: 'Altura', value: athlete.height ? `${athlete.height} cm` : '--' },
            { label: 'Categoria', value: athlete.category || 'Online' },
            { label: 'Objetivo', value: athlete.goal || 'Performance' },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1,
              borderRight: i < 3 ? '1px solid #eee' : 'none',
              paddingLeft: i > 0 ? '10px' : '0',
              paddingRight: '10px',
            }}>
              <div style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: '#aaa', letterSpacing: '1px', marginBottom: '2px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* ===== WORKOUT SECTIONS ===== */}
        {allWorkouts.map((w, wIdx) => {
          // Separate exercise counter (skip separators)
          let exerciseCounter = 0;

          return (
            <div key={w.id || wIdx} style={{ marginBottom: '20px' }} className={wIdx > 0 ? 'page-break' : ''}>
              {/* Workout Title */}
              <div className="avoid-break" style={{
                borderBottom: '2px solid #111',
                paddingBottom: '6px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <div style={{
                  background: '#111', color: '#fff', padding: '3px 8px',
                  fontSize: '9px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  TREINO {wIdx + 1}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                  {w.name || 'Programa de Treinamento'}
                </div>
              </div>

              {/* Exercises Table */}
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '10px',
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '4px 6px', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '1px', width: '28px' }}>#</th>
                    <th style={{ textAlign: 'left', padding: '4px 6px', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Exercício</th>
                    <th style={{ textAlign: 'left', padding: '4px 6px', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '1px', width: '70px' }}>Grupo</th>
                    <th style={{ textAlign: 'center', padding: '4px 6px', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '1px', width: '45px' }}>Séries</th>
                    <th style={{ textAlign: 'left', padding: '4px 6px', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Repetições / Orientação</th>
                    <th style={{ textAlign: 'center', padding: '4px 6px', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '1px', width: '55px' }}>Desc.</th>
                  </tr>
                </thead>
                <tbody>
                  {w.exercises?.map((ex, idx) => {
                    // Separator row
                    if (ex.muscleGroup?.toUpperCase() === 'SEPARADOR') {
                      return (
                        <tr key={ex.id || idx} className="avoid-break">
                          <td colSpan={6} style={{
                            padding: '10px 6px 4px',
                            fontSize: '11px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            borderBottom: '2px solid #ccc',
                            color: '#333',
                          }}>
                            ▸ {ex.name}
                          </td>
                        </tr>
                      );
                    }

                    exerciseCounter++;
                    const isEven = exerciseCounter % 2 === 0;

                    return (
                      <tr key={ex.id || idx} className="avoid-break" style={{
                        background: isEven ? '#f8f8f8' : 'transparent',
                        borderBottom: '1px solid #eee',
                      }}>
                        <td style={{ padding: '5px 6px', fontWeight: 900, color: '#ccc', fontSize: '12px', verticalAlign: 'top' }}>
                          {exerciseCounter.toString().padStart(2, '0')}
                        </td>
                        <td style={{ padding: '5px 6px', fontWeight: 700, fontSize: '10.5px', textTransform: 'uppercase', verticalAlign: 'top' }}>
                          {ex.name}
                          {ex.advancedTechnique && (
                            <span style={{
                              display: 'inline-block', marginLeft: '6px',
                              background: '#111', color: '#fff', padding: '1px 5px',
                              fontSize: '7px', fontWeight: 800, letterSpacing: '0.5px',
                              verticalAlign: 'middle', borderRadius: '2px',
                            }}>
                              {ex.advancedTechnique}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '5px 6px', fontSize: '9px', color: '#666', fontWeight: 600, textTransform: 'uppercase', verticalAlign: 'top' }}>
                          {ex.muscleGroup}
                        </td>
                        <td style={{ padding: '5px 6px', textAlign: 'center', fontWeight: 900, fontSize: '12px', verticalAlign: 'top' }}>
                          {ex.sets}
                        </td>
                        <td style={{ padding: '5px 6px', fontWeight: 700, fontSize: '9.5px', color: '#333', verticalAlign: 'top', lineHeight: '1.3' }}>
                          {ex.reps}
                        </td>
                        <td style={{ padding: '5px 6px', textAlign: 'center', fontSize: '9px', color: '#666', fontWeight: 600, verticalAlign: 'top' }}>
                          {ex.restTime ? `${Math.floor(ex.restTime / 60)}'${(ex.restTime % 60) > 0 ? ` ${ex.restTime % 60}"` : ''}` : '--'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Workout Notes */}
              {w.description && (
                <div className="avoid-break" style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  background: '#f5f5f5',
                  border: '1px solid #eee',
                  fontSize: '9px',
                  color: '#555',
                  fontWeight: 600,
                }}>
                  <strong>Obs:</strong> {w.description}
                </div>
              )}
            </div>
          );
        })}

        {/* ===== DIET SECTION ===== */}
        {diet && diet.meals && diet.meals.length > 0 && (
          <div className={allWorkouts.length > 0 ? 'page-break' : ''} style={{ marginBottom: '20px' }}>
            <div className="avoid-break" style={{
              borderBottom: '2px solid #111',
              paddingBottom: '6px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                background: '#111', color: '#fff', padding: '3px 8px',
                fontSize: '9px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                NUTRIÇÃO
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                {diet.name || 'Planejamento Nutricional'}
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
              {diet.meals.map((meal, mIdx) => (
                <tbody key={meal.id || mIdx}>
                  {/* Meal header row */}
                  <tr className="avoid-break" style={{ borderBottom: '1px solid #ccc' }}>
                    <td colSpan={4} style={{
                      padding: '8px 6px 4px',
                      fontWeight: 900,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {meal.name}
                      {meal.time && (
                        <span style={{ marginLeft: '8px', fontSize: '9px', color: '#888', fontWeight: 600 }}>
                          {meal.time}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* Meal items */}
                  {meal.items.map((item, iIdx) => (
                    <tr key={item.id || iIdx} className="avoid-break" style={{
                      background: iIdx % 2 === 0 ? '#fafafa' : 'transparent',
                      borderBottom: '1px solid #f0f0f0',
                    }}>
                      <td style={{ padding: '4px 6px 4px 16px', fontWeight: 600, fontSize: '10px' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', fontWeight: 800, fontSize: '10px', width: '60px' }}>
                        {item.amount}g
                      </td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', fontSize: '9px', color: '#888', width: '55px' }}>
                        {item.calories ? `${item.calories} kcal` : ''}
                      </td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', fontSize: '8px', color: '#aaa', width: '100px' }}>
                        {item.protein ? `P${item.protein}` : ''} {item.carbs ? `C${item.carbs}` : ''} {item.fat ? `G${item.fat}` : ''}
                      </td>
                    </tr>
                  ))}
                  {/* Spacer */}
                  <tr><td colSpan={4} style={{ padding: '4px' }}></td></tr>
                </tbody>
              ))}
            </table>

            {diet.description && (
              <div className="avoid-break" style={{
                marginTop: '8px', padding: '6px 10px',
                background: '#f5f5f5', border: '1px solid #eee',
                fontSize: '9px', color: '#555', fontWeight: 600,
              }}>
                <strong>Obs:</strong> {diet.description}
              </div>
            )}
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div style={{
          marginTop: '20px',
          paddingTop: '8px',
          borderTop: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '8px',
          color: '#bbb',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
        }}>
          <span>Documento de Prescrição &bull; {currentDate}</span>
          <span>{settings.appName || 'ENDURANCEFIT PRO'}</span>
        </div>
      </div>
    </>
  );
}
