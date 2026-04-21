import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cozjijhtwtljcymmckpb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_XDzX4SFRWUcU_vBklILTmw_w-xOBXNN';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('athletes').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
