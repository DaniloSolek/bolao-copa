import { supabase } from '../lib/supabase'

export async function buscarResultadosUsuario() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('resultados_usuario')
    .select('*')
    .eq('user_id', user.id)
    .order('data_hora', {
      ascending: false
    })

  if (error) {
    throw error
  }

  return data
}