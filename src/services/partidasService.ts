import { supabase } from '../lib/supabase'

// =====================================
// BUSCAR TODAS
// =====================================

export async function buscarPartidas() {

  const {
    data,
    error
  } = await supabase
    .from('partidas')
    .select(`
      *,
      timeCasa:time_casa_id (
        id,
        nome,
        grupo
      ),
      timeFora:time_fora_id (
        id,
        nome,
        grupo
      ),
      palpites (
        id,
        palpite_casa,
        palpite_fora,
        pontos,
        user_id
      )
    `)
    .order('data_hora', {
      ascending: true
    })

  if (error) {
    throw error
  }

  return data
}

// =====================================
// BUSCAR ABERTAS
// =====================================

export async function buscarPartidasAbertas() {

  const { data, error } = await supabase
    .from('partidas')
    .select(`
      *,
      timeCasa:selecoes!partidas_time_casa_id_fkey(*),
      timeFora:selecoes!partidas_time_fora_id_fkey(*)
    `)
    .eq('resultado_inserido', false)
    .order('data_hora', {
      ascending: true
    })

  if (error) {
    throw error
  }

  return data
}

// =====================================
// CRIAR
// =====================================

export async function criarPartida({
  timeCasaId,
  timeForaId,
  dataHora,
  fase,
  grupo
}: {
  timeCasaId: number
  timeForaId: number
  dataHora: string
  fase: string
  grupo: string
}) {

  const { error } = await supabase
    .from('partidas')
    .insert({

      time_casa_id: timeCasaId,
      time_fora_id: timeForaId,

      data_hora: dataHora,

      fase,
      grupo

    })

  if (error) {
    throw error
  }
}

// =====================================
// EDITAR
// =====================================

export async function editarPartida({
  partidaId,
  timeCasaId,
  timeForaId,
  dataHora,
  fase,
  grupo
}: {
  partidaId: number
  timeCasaId: number
  timeForaId: number
  dataHora: string
  fase: string
  grupo: string
}) {

  const { error } = await supabase
    .from('partidas')
    .update({

      time_casa_id: timeCasaId,
      time_fora_id: timeForaId,

      data_hora: dataHora,

      fase,
      grupo

    })
    .eq('id', partidaId)

  if (error) {
    throw error
  }
}

// =====================================
// EXCLUIR
// =====================================

export async function excluirPartida(
  partidaId: number
) {

  const { error } = await supabase
    .from('partidas')
    .delete()
    .eq('id', partidaId)

  if (error) {
    throw error
  }
}

// =====================================
// RESULTADO
// =====================================

export async function salvarResultado(
  partidaId: number,
  golsCasa: number,
  golsFora: number
) {

  const { error } = await supabase
    .from('partidas')
    .update({
      gols_casa: golsCasa,
      gols_fora: golsFora,
      resultado_inserido: true
    })
    .eq('id', partidaId)

  if (error) throw error

  const { data: palpites, error: erroPalpites } = await supabase
    .from('palpites')
    .select('id, user_id, palpite_casa, palpite_fora')
    .eq('partida_id', partidaId)

  if (erroPalpites) throw erroPalpites
  if (!palpites || palpites.length === 0) return

  for (const palpite of palpites) {

    const pontos = calcularPontos(
      palpite.palpite_casa,
      palpite.palpite_fora,
      golsCasa,
      golsFora
    )

    await supabase
      .from('palpites')
      .update({ pontos })
      .eq('id', palpite.id)

    const { data: pontuacao } = await supabase
      .from('pontuacoes')
      .select('total_pontos, acertos_exatos, acertos_vencedor')
      .eq('user_id', palpite.user_id)
      .single()

    if (pontuacao) {
      await supabase
        .from('pontuacoes')
        .update({
          total_pontos: pontuacao.total_pontos + pontos,
          acertos_exatos:
            pontos === 3
              ? pontuacao.acertos_exatos + 1
              : pontuacao.acertos_exatos,
          acertos_vencedor:
            pontos === 1
              ? pontuacao.acertos_vencedor + 1
              : pontuacao.acertos_vencedor,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', palpite.user_id)
    }
  }
}

// =====================================
// HELPER DE PONTUAÇÃO
// =====================================

function calcularPontos(
  palpiteCasa: number,
  palpiteFora: number,
  golsCasa: number,
  golsFora: number
): number {

  if (
    palpiteCasa === golsCasa &&
    palpiteFora === golsFora
  ) {
    return 3
  }

  const vencedorPalpite =
    palpiteCasa > palpiteFora ? 'casa' :
    palpiteFora > palpiteCasa ? 'fora' : 'empate'

  const vencedorReal =
    golsCasa > golsFora ? 'casa' :
    golsFora > golsCasa ? 'fora' : 'empate'

  if (vencedorPalpite === vencedorReal) {
    return 1
  }

  return 0
}