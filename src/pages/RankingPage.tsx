import { useEffect, useState } from 'react'
import MobileLayout from '../layouts/MobileLayout'
import { buscarRanking, buscarEstatisticas } from '../services/rankingService'

const medalhas = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const [ranking, setRanking] = useState<any[]>([])
  const [estatisticas, setEstatisticas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const [rankingData, estatisticasData] = await Promise.all([
        buscarRanking(),
        buscarEstatisticas()
      ])
      setRanking(rankingData)
      setEstatisticas(estatisticasData)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar ranking')
    } finally {
      setLoading(false)
    }
  }

  const porCravadas = [...estatisticas]
    .filter((e) => e.jogos_palpitados > 0)
    .sort((a, b) => b.cravadas - a.cravadas)

  // Ordena por acertos de resultado (desc)
  const porAcertos = [...estatisticas]
    .filter((e) => e.jogos_palpitados > 0)
    .sort((a, b) => b.acertos_resultado - a.acertos_resultado)

  if (loading) return <MobileLayout><h1>Carregando...</h1></MobileLayout>

  return (
    <MobileLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* =================================== */}
        {/* CLASSIFICAÇÃO GERAL */}
        {/* =================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ color: 'var(--text-primary)', margin: 0 }}>Ranking</h1>

          {ranking.map((usuario, index) => (
            <div key={usuario.user_id} style={{
              background: index === 0 ? '#1c2a1a' : 'var(--bg-card)',
              padding: 16, borderRadius: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: index === 0 ? '1px solid #4ade80' : '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, minWidth: 28 }}>
                  {medalhas[index] ?? `#${index + 1}`}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {usuario.username}
                </span>
              </div>
              <strong style={{ color: index === 0 ? '#4ade80' : 'var(--text-primary)' }}>
                {usuario.pontos} pts
              </strong>
            </div>
          ))}
        </div>

        {/* =================================== */}
        {/* CRAVADAS */}
        {/* =================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ color: 'var(--text-primary)', margin: 0 }}>Estatísticas</h1>
          <div>
            <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 18 }}>Cravadas</h2>
          </div>

          {porCravadas.length === 0 && (
            <div style={{
              background: 'var(--bg-card)', borderRadius: 12, padding: 16,
              textAlign: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border)'
            }}>
              Nenhum dado disponível ainda.
            </div>
          )}

          {porCravadas.map((e, index) => (
            <div key={e.user_id} style={{
              background: 'var(--bg-card)', padding: 14, borderRadius: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', minWidth: 24 }}>
                  #{index + 1}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {e.username}
                </span>
              </div>
              <strong style={{ color: '#ffffff' }}>
                {e.cravadas}
              </strong>
            </div>
          ))}
        </div>

        {/* =================================== */}
        {/* ACERTOS DE RESULTADO */}
        {/* =================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 18 }}>Resultados acertados</h2>
          </div>

          {porAcertos.length === 0 && (
            <div style={{
              background: 'var(--bg-card)', borderRadius: 12, padding: 16,
              textAlign: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border)'
            }}>
              Nenhum dado disponível ainda.
            </div>
          )}

          {porAcertos.map((e, index) => (
            <div key={e.user_id} style={{
              background: 'var(--bg-card)', padding: 14, borderRadius: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', minWidth: 24 }}>
                  #{index + 1}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {e.username}
                </span>
              </div>
              <strong style={{ color: '#ffffff' }}>
                {e.acertos_resultado}/{e.jogos_palpitados}
              </strong>
            </div>
          ))}
        </div>

      </div>
    </MobileLayout>
  )
}