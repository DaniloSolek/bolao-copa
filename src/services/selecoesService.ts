import { supabase } from '../lib/supabase'

export async function buscarSelecoes() {

  const { data, error } = await supabase
    .from('selecoes')
    .select('*')
    .order('grupo', {
      ascending: true
    })

  if (error) {
    throw error
  }

  return data
}