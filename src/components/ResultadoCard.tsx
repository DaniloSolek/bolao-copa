import { useState } from 'react'
import { buscarPalpitesDaPartida } from '../services/palpitesService'

type Props = { partida: any; userId?: string }

export default function ResultadoCard({ partida, userId }: Props) {
  const [palpitesAberto, setPalpitesAberto] = useState(false)
  const [palpitesTodos, setPalpitesTodos] = useState<any[]>([])
  const [loadingPalpites, setLoadingPalpites] = useState(false)

  const meuPalpite = partida.palpites?.find((p: any) => p.user_id === userId)

  async function togglePalpites() {
    if (palpitesAberto) { setPalpitesAberto(false); return }
    setLoadingPalpites(true)
    try {
      const data = await buscarPalpitesDaPartida(partida.id)
      setPalpitesTodos(data ?? [])
      setPalpitesAberto(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingPalpites(false)
    }
  }

  function corPontos(pontos: number) {
    if (pontos === 4) return '#60a5fa'
    if (pontos === 3) return '#4ade80'
    if (pontos === 2) return '#facc15'
    if (pontos === 1) return '#fb923c'
    return '#f87171'
  }

  // Nome do time pelo id, buscando nos dados da partida
  function nomeTimePorId(id: number | null) {
    if (!id) return null
    if (partida.timeCasa?.id === id) return partida.timeCasa.nome
    if (partida.timeFora?.id === id) return partida.timeFora.nome
    return null
  }

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14,
      border: '1px solid var(--border)',
      overflow: 'hidden'
    }}>
      {/* CONTEÚDO PRINCIPAL */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* TIMES + RESULTADO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, textAlign: 'right', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
            {partida.timeCasa?.nome}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: 18, minWidth: 70, textAlign: 'center', color: 'var(--text-primary)' }}>
            {partida.gols_casa} x {partida.gols_fora}
            {/* Mostra quem passou nos pênaltis se houver */}
            {partida.time_classificado_id && (
              <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-secondary)', marginTop: 2 }}>
                pen. {nomeTimePorId(partida.time_classificado_id)}
              </div>
            )}
          </div>
          <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
            {partida.timeFora?.nome}
          </div>
        </div>

        {/* MEU PALPITE */}
        {meuPalpite && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg-input)', borderRadius: 10, padding: '10px 12px', fontSize: 13
          }}>
            <div style={{ color: 'var(--text-primary)' }}>
              Seu palpite:{' '}
              <strong>{meuPalpite.palpite_casa} x {meuPalpite.palpite_fora}</strong>
              {/* Mostra quem o jogador palpitou nos pênaltis */}
              {meuPalpite.palpite_classificado_id && (
                <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                  {' '}({nomeTimePorId(meuPalpite.palpite_classificado_id)})
                </span>
              )}
            </div>
            <div style={{ fontWeight: 'bold', color: corPontos(meuPalpite.pontos) }}>
              +{meuPalpite.pontos} pts
            </div>
          </div>
        )}

        {/* DATA */}
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          {new Date(partida.data_hora).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
        </div>
      </div>

      {/* BARRA EXPANSÍVEL */}
      <button onClick={togglePalpites} style={{
        width: '100%', border: 'none', borderTop: '1px solid var(--border)',
        background: 'transparent', cursor: 'pointer',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        color: 'var(--text-secondary)', fontSize: 13
      }}>
        {loadingPalpites ? 'Carregando...' : palpitesAberto ? '▲ Ocultar palpites' : '▼ Ver palpites de todos'}
      </button>

      {palpitesAberto && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 8
        }}>
          {palpitesTodos.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '8px 0' }}>
              Nenhum palpite registrado.
            </div>
          )}
          {palpitesTodos.map((p: any) => {
            const souEu = p.user_id === userId
            const naoJogou = p.palpite_casa == null
            return (
              <div key={p.user_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 10,
                background: souEu ? 'rgba(59,130,246,0.12)' : 'var(--bg-input)',
                border: souEu ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent'
              }}>
                {/* NOME */}
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: souEu ? 700 : 400 }}>
                  {p.profile?.username ?? 'Jogador'}{souEu && <span style={{ color: '#3b82f6', fontSize: 11 }}> (você)</span>}
                </span>

                {/* PALPITE + PONTOS */}
                {naoJogou ? (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>NP</span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {p.palpite_casa} x {p.palpite_fora}
                      {p.palpite_classificado_id && (
                        <span style={{ fontSize: 11, marginLeft: 4, opacity: 0.7 }}>
                          ({nomeTimePorId(p.palpite_classificado_id)})
                        </span>
                      )}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: corPontos(p.pontos),
                      minWidth: 40, textAlign: 'right'
                    }}>
                      +{p.pontos} pts
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}