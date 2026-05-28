import { supabase } from '../lib/supabase'

export async function salvarPalpite(
  partidaId: number,
  golsCasa: number,
  golsFora: number
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('palpites')
    .upsert({
      user_id: user.id,
      partida_id: partidaId,
      palpite_casa: golsCasa,
      palpite_fora: golsFora
    }, { onConflict: 'user_id,partida_id' })

  if (error) throw error
}

export async function buscarMeusPalpites() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('palpites')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw error
  return data
}

export async function buscarPalpitesDaPartida(partidaId: number) {

  const { data: profiles, error: erroProfiles } = await supabase
    .from('profiles')
    .select('id, username')

  if (erroProfiles) throw erroProfiles

  const { data: palpites, error: erroPalpites } = await supabase
    .from('palpites')
    .select('palpite_casa, palpite_fora, pontos, user_id')
    .eq('partida_id', partidaId)

  if (erroPalpites) throw erroPalpites

  return profiles.map((profile) => {
    const palpite = palpites?.find((p) => p.user_id === profile.id) ?? null
    return {
      user_id: profile.id,
      profile: { username: profile.username },
      palpite_casa: palpite?.palpite_casa ?? null,
      palpite_fora: palpite?.palpite_fora ?? null,
      pontos: palpite?.pontos ?? null,
    }
  })
}