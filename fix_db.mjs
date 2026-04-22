import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://bnwoimrydwuvpyatxetn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud29pbXJ5ZHd1dnB5YXR4ZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDU4NzQsImV4cCI6MjA4OTM4MTg3NH0.3PtRpB2U0poWPbNh9lxSnLWfFFTL1KFIcAYTVyQMc18'
);

async function cleanup() {
  const brenoId = '5e8f015d-265c-4404-aaf8-c4e0874e74c8';
  
  // 1. Delete ALL duplicate workouts for Breno
  console.log('Deleting all Breno workouts...');
  const { error: delErr } = await s.from('workouts').delete().eq('athlete_id', brenoId);
  if (delErr) console.error('Delete error:', delErr);
  else console.log('Deleted all Breno workouts.');

  // 2. Delete old template workouts
  console.log('Deleting old template workouts...');
  await s.from('workouts').delete().is('athlete_id', null);
  console.log('Deleted template workouts.');

  // 3. Insert settings with correct UUID
  console.log('Inserting settings...');
  const { data: settingsData, error: settingsErr } = await s.from('settings').upsert({
    id: '00000000-0000-0000-0000-000000000001',
    app_name: 'ENDURANCEFIT PRO',
    trainer_name: 'PERSONAL COACH',
    logo_url: '',
    pin: null,
    updated_at: new Date().toISOString()
  }).select();
  
  if (settingsErr) console.error('Settings error:', settingsErr);
  else console.log('Settings OK:', settingsData);

  // 4. Verify clean state
  const { data: wk } = await s.from('workouts').select('id, name, athlete_id');
  console.log('Remaining workouts:', wk?.length || 0);
  
  const { data: st } = await s.from('settings').select('*');
  console.log('Settings:', JSON.stringify(st));

  console.log('\nDone! Database is clean.');
}

cleanup();
