import { supabase } from '../lib/supabase'

export async function buscarRanking() {

  const { data, error } = await supabase
    .from('ranking')
    .select('*')

  if (error) {
    throw error
  }

  return data
}