import { supabase } from '../lib/supabase'

export async function salvarPalpite(
  partidaId: number,
  golsCasa: number,
  golsFora: number
) {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase
    .from('palpites')
    .upsert({
      user_id: user.id,

      partida_id: partidaId,

      palpite_casa: golsCasa,
      palpite_fora: golsFora
    },
    {
      onConflict: 'user_id,partida_id'
    })

  if (error) {
    throw error
  }
}

export async function buscarMeusPalpites() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('palpites')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  return data
}