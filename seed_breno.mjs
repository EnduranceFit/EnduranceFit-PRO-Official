import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = "https://bnwoimrydwuvpyatxetn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud29pbXJ5ZHd1dnB5YXR4ZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDU4NzQsImV4cCI6MjA4OTM4MTg3NH0.3PtRpB2U0poWPbNh9lxSnLWfFFTL1KFIcAYTVyQMc18";

const supabase = createClient(supabaseUrl, supabaseKey);

const workoutData = {
  name: 'Protocolo Oficial Breno Marinho (A,B,C,D)',
  description: 'Treinamento completo de Hipertrofia com blocos separados.',
  exercises: [
    // TREINO A
    { name: 'TREINO A (Peito / Tríceps)', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
    { name: 'Supino inclinado (barra ou maq)', muscle_group: 'Peito', sets: 3, reps: '1 Aquec, 2 Feeder 40%, 3 Válidas 8-12', rest_time: 120 },
    { name: 'Supino reto (máquina ou hammer)', muscle_group: 'Peito', sets: 3, reps: '2 Feeder 40%, 3 Válidas 8-12', rest_time: 180 },
    { name: 'Supino vertical incl. / Crucifixo', muscle_group: 'Peito', sets: 3, reps: '1 Ajuste, 3 Válidas até 12', rest_time: 120 },
    { name: 'Packdeck / voador', muscle_group: 'Peito', sets: 3, reps: '1 Ajuste 60%, 3 Válidas (Falha)', rest_time: 120 },
    { name: 'Tríceps corda', muscle_group: 'Tríceps', sets: 3, reps: '1 Aquec, 3 Válidas 12-15', rest_time: 120 },
    { name: 'Tríceps francês na polia', muscle_group: 'Tríceps', sets: 3, reps: '3 Válidas (Falha)', rest_time: 120 },
    { name: 'Tríceps testa (com barra W)', muscle_group: 'Tríceps', sets: 3, reps: '3 Válidas (Max 10 pesadas)', rest_time: 120 },

    // TREINO B
    { name: 'TREINO B (Costas / Bíceps)', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
    { name: 'Puxada alta aberta na polia', muscle_group: 'Costas', sets: 3, reps: '1 Aquec 12, 2 Feeder 5, 3 Válidas 12', rest_time: 120 },
    { name: 'Puxada alta fechada (triângulo)', muscle_group: 'Costas', sets: 3, reps: '3 Válidas (Falha em todas)', rest_time: 120 },
    { name: 'Remada baixa sentado', muscle_group: 'Costas', sets: 3, reps: '1 Aquec 10, 2 Feeder 5, 3 Válidas 12', rest_time: 120 },
    { name: 'Remada curvada (Barra ou Máq)', muscle_group: 'Costas', sets: 3, reps: '3 Válidas 10 (Abaixo umbigo)', rest_time: 120 },
    { name: 'Pulldown c/ Corda', muscle_group: 'Costas', sets: 3, reps: '1 Ajuste 8, 3 Válidas 12', rest_time: 120 },
    { name: 'Rosca direta pulley corda', muscle_group: 'Bíceps', sets: 3, reps: '1 Aquec 10, 1 Feeder 6, 3 Válidas 12', rest_time: 120 },
    { name: 'Rosca alternada (incl 45)', muscle_group: 'Bíceps', sets: 3, reps: '1 Feeder 5, 3 Válidas 12', rest_time: 120 },
    { name: 'Rosca Concentrada', muscle_group: 'Bíceps', sets: 3, reps: '3 Válidas (Falha)', rest_time: 120 },

    // TREINO C
    { name: 'TREINO C (Quadríceps / Posterior / Pantu)', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
    { name: 'Cadeira extensora', muscle_group: 'Quadríceps', sets: 3, reps: '1 Aquec 12, 2 Feeder 5, 3 Válidas 12 cadenciadas', rest_time: 120 },
    { name: 'Leg press', muscle_group: 'Quadríceps', sets: 4, reps: '1 Aquec, progride nas 3/4 Válidas. Focar Exec.', rest_time: 120 },
    { name: 'Hack Machine', muscle_group: 'Quadríceps', sets: 3, reps: '1 Ajuste, 3 Válidas 10', rest_time: 120 },
    { name: 'Flexora em pé', muscle_group: 'Posterior', sets: 3, reps: '1 Aquec 12, 1 Ajuste 6, 3 Válidas 12', rest_time: 120 },
    { name: 'Cadeira Flexora', muscle_group: 'Posterior', sets: 3, reps: '1 Ajuste 8, 3 Válidas 15 max', rest_time: 120 },
    { name: 'Abdutora', muscle_group: 'Abd/Adutores', sets: 3, reps: '1 Aquec 12, 3 Válidas 12', rest_time: 120 },
    { name: 'Gêmeos sentado / Panturrilha', muscle_group: 'Panturrilha', sets: 4, reps: '1 Aquec sem peso, 4 Válidas (Falha)', rest_time: 120 },

    // TREINO D
    { name: 'TREINO D (Ombro + Estímulo Tríceps)', muscle_group: 'Separador', sets: 0, reps: '', rest_time: 0 },
    { name: 'Desenvolvimento na máquina', muscle_group: 'Ombro', sets: 3, reps: '1 Aquec 12, 2 Feeder 5, 3 Válidas 10-12', rest_time: 120 },
    { name: 'Elevação lateral na polia', muscle_group: 'Ombro', sets: 3, reps: '1 Ajuste 8, 3 Válidas 12 (Carga Max)', rest_time: 120 },
    { name: 'Elevação frontal com corda', muscle_group: 'Ombro', sets: 3, reps: '1 Ajuste 8, 3 Válidas 10-12', rest_time: 120 },
    { name: 'Crucifixo inverso no pack deck', muscle_group: 'Ombro', sets: 2, reps: '1 Ajuste 10. Progredir até 2 Válidas (Falha)', rest_time: 120 },
    { name: 'Estímulo: Tríceps à escolha', muscle_group: 'Tríceps', sets: 1, reps: 'Fazer 2 Ex. de Tríceps como estímulo', rest_time: 120 }
  ]
};

async function seed() {
  console.log('Deletando treinos antigos...');
  await supabase.from('workouts').delete().like('name', '%(Breno)%');
  
  // Apagar possivel template com o nome novo
  await supabase.from('workouts').delete().eq('name', workoutData.name);

  console.log('Inserindo bloco unificado...');
  
  const workoutId = crypto.randomUUID();
  
  // Inserir workout template
  const { data: wData, error: wError } = await supabase.from('workouts').insert({
    id: workoutId,
    name: workoutData.name,
    description: workoutData.description,
    athlete_id: null // Configura como Template
  }).select().single();

  if (wError) {
    console.error('Error inserting workout', workoutData.name, wError);
    return;
  }

  // Inserir workout exercises
  const exercisesToInsert = workoutData.exercises.map((ex, index) => ({
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
    console.error('Error inserting exercises for', workoutData.name, eError);
  } else {
    console.log(`Sucesso: O bloco completo de treinos foi inserido unificado!`);
  }

  console.log('Finalizado!');
}

seed();
