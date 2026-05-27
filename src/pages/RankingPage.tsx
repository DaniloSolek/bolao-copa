import { useEffect, useState } from 'react'
import MobileLayout from '../layouts/MobileLayout'
import { buscarRanking } from '../services/rankingService'

const medalhas = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const [ranking, setRanking] = useState<any[]>([])

  useEffect(() => { carregarRanking() }, [])

  async function carregarRanking() {
    try {
      const data = await buscarRanking()
      setRanking(data)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar ranking')
    }
  }

  return (
    <MobileLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Ranking</h1>
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
    </MobileLayout>
  )
}