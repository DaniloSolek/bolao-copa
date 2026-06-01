import { supabase } from '../lib/supabase'

function brasiliaParaUTC(dataHoraLocal: string): string {
  return new Date(dataHoraLocal + ':00-03:00').toISOString()
}

const FASES_ELIMINATORIAS = ['pre-oitavas', 'oitavas', 'quartas', 'semi', 'final', 'terceiro']

export function isFaseEliminatoria(fase: string): boolean {
  return FASES_ELIMINATORIAS.includes(fase)
}

export async function buscarPartidas() {
  const { data, error } = await supabase
    .from('partidas')
    .select(`
      *,
      timeCasa:time_casa_id ( id, nome, grupo ),
      timeFora:time_fora_id ( id, nome, grupo ),
      timeClassificado:time_classificado_id ( id, nome ),
      palpites (
        id,
        palpite_casa,
        palpite_fora,
        palpite_classificado_id,
        pontos,
        user_id
      )
    `)
    .order('data_hora', { ascending: true })

  if (error) throw error
  return data
}

export async function buscarPartidasAbertas() {
  const { data, error } = await supabase
    .from('partidas_abertas')
    .select('*')

  if (error) throw error
  return data
}

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
      data_hora: brasiliaParaUTC(dataHora),
      fase,
      grupo
    })

  if (error) throw error
}

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
      data_hora: brasiliaParaUTC(dataHora),
      fase,
      grupo
    })
    .eq('id', partidaId)

  if (error) throw error
}

export async function excluirPartida(partidaId: number) {
  const { error } = await supabase
    .from('partidas')
    .delete()
    .eq('id', partidaId)

  if (error) throw error
}

export async function salvarResultado(
  partidaId: number,
  golsCasa: number,
  golsFora: number,
  timeClassificadoId: number | null,
  fase: string
) {
  const { error } = await supabase
    .from('partidas')
    .update({
      gols_casa: golsCasa,
      gols_fora: golsFora,
      time_classificado_id: timeClassificadoId,
      resultado_inserido: true
    })
    .eq('id', partidaId)

  if (error) throw error

  const { data: palpites, error: erroPalpites } = await supabase
    .from('palpites')
    .select('id, user_id, palpite_casa, palpite_fora, palpite_classificado_id')
    .eq('partida_id', partidaId)

  if (erroPalpites) throw erroPalpites
  if (!palpites || palpites.length === 0) return

  const eliminatoria = isFaseEliminatoria(fase)

  for (const palpite of palpites) {
    const pontos = calcularPontos({
      palpiteCasa: palpite.palpite_casa,
      palpiteFora: palpite.palpite_fora,
      palpiteClassificadoId: palpite.palpite_classificado_id,
      golsCasa,
      golsFora,
      timeClassificadoId,
      eliminatoria
    })

    await supabase
      .from('palpites')
      .update({ pontos })
      .eq('id', palpite.id)
  }
}

function calcularPontos({
  palpiteCasa,
  palpiteFora,
  palpiteClassificadoId,
  golsCasa,
  golsFora,
  timeClassificadoId,
  eliminatoria
}: {
  palpiteCasa: number
  palpiteFora: number
  palpiteClassificadoId: number | null
  golsCasa: number
  golsFora: number
  timeClassificadoId: number | null
  eliminatoria: boolean
}): number {

  const placarExato = palpiteCasa === golsCasa && palpiteFora === golsFora

  const vencedorPalpite =
    palpiteCasa > palpiteFora ? 'casa' :
    palpiteFora > palpiteCasa ? 'fora' : 'empate'

  const vencedorReal =
    golsCasa > golsFora ? 'casa' :
    golsFora > golsCasa ? 'fora' : 'empate'

  const acertouResultado = vencedorPalpite === vencedorReal

  // =========================
  // FASE DE GRUPOS
  // =========================
  if (!eliminatoria) {
    if (placarExato) return 3
    if (acertouResultado) return 1
    return 0
  }

  const foiPenaltis = timeClassificadoId !== null

  const classificadoReal = foiPenaltis
    ? timeClassificadoId
    : vencedorReal === 'casa' ? 'casa' : 'fora' // usamos string para comparar abaixo

  const classificadoPalpite = foiPenaltis
    ? palpiteClassificadoId
    : vencedorPalpite === 'casa' ? 'casa' : 'fora'

  const acertouClassificado = foiPenaltis
    ? palpiteClassificadoId === timeClassificadoId
    : acertouResultado // se não foi pênaltis, acertar resultado = acertar quem passa

  if (placarExato && acertouClassificado) return 4  // placar exato + quem passa ✓
  if (placarExato && !acertouClassificado) return 3  // placar exato mas errou quem passa nos pênaltis
  if (!placarExato && acertouClassificado) return 2  // errou placar mas acertou quem passa
  if (!placarExato && acertouResultado && !acertouClassificado) return 1 // acertou resultado mas errou quem passa
  return 0
}