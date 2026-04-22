import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  'https://bnwoimrydwuvpyatxetn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud29pbXJ5ZHd1dnB5YXR4ZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDU4NzQsImV4cCI6MjA4OTM4MTg3NH0.3PtRpB2U0poWPbNh9lxSnLWfFFTL1KFIcAYTVyQMc18'
);

const BRENO_ID = '5e8f015d-265c-4404-aaf8-c4e0874e74c8';

const workouts = [
  {
    name: 'Treino 1 — Peito / Tríceps',
    day_of_week: 'Segunda',
    description: 'Após o treino, realizar 40min de cardio (esteira/bike).',
    athlete_id: BRENO_ID,
    exercises: [
      // PEITO
      { name: '── PEITO ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Supino Inclinado (barra ou máq.)', muscle_group: 'Peito', sets: 3, reps: '1x Aquec 12 (leve) → 2x Feeder 5 (40% carga, 1min desc) → 3x Válidas 8-12 (carga máx)', rest_time: 150 },
      { name: 'Supino Reto (máq. ou hammer)', muscle_group: 'Peito', sets: 3, reps: '2x Feeder 5 (40% carga, 1min desc) → 3x Válidas 8-12 (carga máx)', rest_time: 180 },
      { name: 'Supino Inclinado Vert. ou Crucifixo', muscle_group: 'Peito', sets: 3, reps: '1x Ajuste 6 (metade da carga) → 3x Válidas até 12 (carga máx)', rest_time: 120 },
      { name: 'Peck Deck / Voador', muscle_group: 'Peito', sets: 3, reps: '1x Ajuste (60% carga) → 3x Válidas até a falha (carga máx)', rest_time: 120 },
      // TRÍCEPS
      { name: '── TRÍCEPS (2min intervalo em tudo) ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Tríceps Corda', muscle_group: 'Tríceps', sets: 3, reps: '1x Aquec 12 (leve) → 3x Válidas 12-15 (carga máx)', rest_time: 120 },
      { name: 'Tríceps Francês na Polia', muscle_group: 'Tríceps', sets: 3, reps: '3x Válidas até a falha (carga máx)', rest_time: 120 },
      { name: 'Tríceps Testa (barra W)', muscle_group: 'Tríceps', sets: 3, reps: '3x Válidas no máx 10 (bem pesadas)', rest_time: 120 },
      // CARDIO
      { name: '── CARDIO PÓS-TREINO ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Esteira ou Bicicleta', muscle_group: 'Cardio', sets: 1, reps: '40 minutos — caminhada acelerada ou bike', rest_time: 0 },
    ]
  },
  {
    name: 'Treino 2 — Costas / Bíceps',
    day_of_week: 'Terça',
    description: 'Após o treino, realizar 40min de cardio (esteira/bike).',
    athlete_id: BRENO_ID,
    exercises: [
      // COSTAS
      { name: '── COSTAS ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Puxada Alta Aberta (Polia)', muscle_group: 'Costas', sets: 3, reps: '1x Aquec 12 (leve) → 2x Feeder 5 (40% carga, 1min) → 3x Válidas 12 (carga máx)', rest_time: 120 },
      { name: 'Puxada Alta Fechada (Triângulo)', muscle_group: 'Costas', sets: 3, reps: '3x Válidas até a falha (carga máx)', rest_time: 120 },
      { name: 'Remada Baixa Sentado', muscle_group: 'Costas', sets: 3, reps: '1x Aquec 10 (leve) → 2x Feeder 5 (40% carga) → 3x Válidas 12 (carga máx)', rest_time: 120 },
      { name: 'Remada Curvada (Barra ou Máq.)', muscle_group: 'Costas', sets: 3, reps: '3x Válidas 10 (carga máx, barra até abaixo do umbigo)', rest_time: 120 },
      { name: 'Pulldown c/ Corda', muscle_group: 'Costas', sets: 3, reps: '1x Ajuste 8 (metade carga) → 3x Válidas 12 (carga máx)', rest_time: 120 },
      // BÍCEPS
      { name: '── BÍCEPS ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Rosca Direta Pulley (Corda)', muscle_group: 'Bíceps', sets: 3, reps: '1x Aquec 10 (leve) → 1x Feeder 6 (40% carga) → 3x Válidas 12 (carga máx)', rest_time: 120 },
      { name: 'Rosca Alternada (Inclinado 45º)', muscle_group: 'Bíceps', sets: 3, reps: '1x Feeder 5 (50% carga) → 3x Válidas 12 (carga máx)', rest_time: 120 },
      { name: 'Rosca Concentrada', muscle_group: 'Bíceps', sets: 3, reps: '3x Válidas até a falha (peso máximo)', rest_time: 120 },
      // CARDIO
      { name: '── CARDIO PÓS-TREINO ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Esteira ou Bicicleta', muscle_group: 'Cardio', sets: 1, reps: '40 minutos — caminhada acelerada ou bike', rest_time: 0 },
    ]
  },
  {
    name: 'Treino 3 — Quadríceps / Posterior / Pantu',
    day_of_week: 'Quinta',
    description: 'Focar em cadência e execução. Após o treino, realizar 40min de cardio.',
    athlete_id: BRENO_ID,
    exercises: [
      // QUADRÍCEPS
      { name: '── QUADRÍCEPS ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Cadeira Extensora', muscle_group: 'Quadríceps', sets: 3, reps: '1x Aquec 12 (leve) → 2x Feeder 5 (50% carga) → 3x Válidas 12 (carga mod., cadenciado)', rest_time: 120 },
      { name: 'Leg Press', muscle_group: 'Quadríceps', sets: 4, reps: '1x Aquec 10 (20kg/lado) → 3-4x Válidas 12 (progredir, focar execução, NÃO carga máx)', rest_time: 120 },
      { name: 'Hack Machine', muscle_group: 'Quadríceps', sets: 3, reps: '1x Ajuste (pouca carga) → 3x Válidas 10 (carga moderada, subir cadenciado)', rest_time: 120 },
      // POSTERIOR
      { name: '── POSTERIOR ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Flexora em Pé', muscle_group: 'Posterior', sets: 3, reps: '1x Aquec 12 (leve) → 1x Ajuste 6 (carga média) → 3x Válidas 12 (pouco menos que máx)', rest_time: 120 },
      { name: 'Cadeira Flexora', muscle_group: 'Posterior', sets: 3, reps: '1x Ajuste 8 (moderada) → 3x Válidas 15 (carga máx)', rest_time: 120 },
      // ADUTORES + PANTURRILHA
      { name: '── ADUTORES / PANTURRILHA ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Abdutora', muscle_group: 'Adutores', sets: 3, reps: '1x Aquec 12 (leve) → 3x Válidas 12 (carga máx)', rest_time: 120 },
      { name: 'Gêmeos Sentado (Panturrilha)', muscle_group: 'Panturrilha', sets: 4, reps: '1x Aquec 15 (sem carga) → 4x Válidas até a falha (carga máx)', rest_time: 90 },
      // CARDIO
      { name: '── CARDIO PÓS-TREINO ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Esteira ou Bicicleta', muscle_group: 'Cardio', sets: 1, reps: '40 minutos — caminhada acelerada ou bike', rest_time: 0 },
    ]
  },
  {
    name: 'Treino 4 — Ombro + Estímulo Tríceps',
    day_of_week: 'Sexta',
    description: '⚠️ Após este treino: 1-2 DIAS OFF de musculação antes de reiniciar pelo Treino 1. Manter cardio nos off.',
    athlete_id: BRENO_ID,
    exercises: [
      // OMBRO
      { name: '── OMBRO ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Desenvolvimento na Máquina', muscle_group: 'Ombro', sets: 3, reps: '1x Aquec 12 (leve) → 2x Feeder 5 (60% carga) → 3x Válidas 10-12 (carga máx)', rest_time: 120 },
      { name: 'Elevação Lateral na Polia', muscle_group: 'Ombro', sets: 3, reps: '1x Ajuste 8 (moderada) → 3x Válidas 12 (carga máx)', rest_time: 120 },
      { name: 'Elevação Frontal com Corda', muscle_group: 'Ombro', sets: 3, reps: '1x Ajuste 8 (50% carga) → 3x Válidas 10-12 (carga máx)', rest_time: 120 },
      { name: 'Crucifixo Inverso Peck Deck', muscle_group: 'Ombro', sets: 2, reps: '1x Ajuste 10 (leve) → progredir peso → 2x Válidas até a falha (carga total)', rest_time: 120 },
      // ESTÍMULO
      { name: '── ESTÍMULO TRÍCEPS ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Tríceps (2 exercícios à escolha)', muscle_group: 'Tríceps', sets: 2, reps: 'Escolher 2 exercícios do Treino 1 como estímulo final', rest_time: 120 },
      // CARDIO
      { name: '── CARDIO PÓS-TREINO ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Esteira ou Bicicleta', muscle_group: 'Cardio', sets: 1, reps: '40 minutos — caminhada acelerada ou bike', rest_time: 0 },
    ]
  },
  {
    name: 'Cardio — Dias sem Musculação',
    day_of_week: 'Quarta',
    description: 'Nos dias sem treino de hipertrofia, realizar ao menos o cardio. Manter todos os dias da semana.',
    athlete_id: BRENO_ID,
    exercises: [
      { name: '── CARDIO (dias sem musculação) ──', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
      { name: 'Esteira — Caminhada Acelerada', muscle_group: 'Cardio', sets: 1, reps: '40 minutos em ritmo acelerado, inclinação 2-4%', rest_time: 0 },
      { name: 'OU Bicicleta Ergométrica', muscle_group: 'Cardio', sets: 1, reps: '40 minutos em intensidade moderada', rest_time: 0 },
    ]
  }
];

async function seed() {
  console.log('🧹 Limpando treinos antigos...');
  await supabase.from('workouts').delete().eq('athlete_id', BRENO_ID);

  for (const w of workouts) {
    const workoutId = crypto.randomUUID();
    
    console.log(`Inserindo: ${w.name}...`);
    const { error: wError } = await supabase.from('workouts').insert({
      id: workoutId,
      name: w.name,
      description: w.description,
      athlete_id: w.athlete_id,
      updated_at: new Date().toISOString()
    });

    if (wError) {
      console.error('ERRO workout:', w.name, wError);
      continue;
    }

    const exercisesToInsert = w.exercises.map((ex, index) => ({
      workout_id: workoutId,
      name: ex.name,
      muscle_group: ex.muscle_group,
      sets: ex.sets,
      reps: ex.reps,
      rest_time: ex.rest_time,
      order_index: index
    }));

    const { error: eError } = await supabase.from('workout_exercises').insert(exercisesToInsert);
    
    if (eError) {
      console.error('ERRO exercícios:', w.name, eError);
    } else {
      console.log(`✅ ${w.name} — ${w.exercises.length} exercícios`);
    }
  }

  // Verificação
  const { data: check } = await supabase.from('workouts').select('id, name, athlete_id').eq('athlete_id', BRENO_ID);
  console.log(`\n📊 Total treinos do Breno: ${check?.length}`);
  check?.forEach(w => console.log(`   • ${w.name}`));
  console.log('\n🎯 Concluído!');
}

seed();
