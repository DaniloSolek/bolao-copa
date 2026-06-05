import { useEffect, useState } from 'react'
import MobileLayout from '../layouts/MobileLayout'
import { buscarPartidasAbertas } from '../services/partidasService'
import { buscarMeusPalpites } from '../services/palpitesService'
import PartidaCard from '../components/PartidaCard'
import { useAuth } from '../contexts/AuthContext'

export default function PalpitesPage() {
  const [partidas, setPartidas] = useState<any[]>([])
  const [palpites, setPalpites] = useState<any[]>([])
  const { usuario } = useAuth()

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    try {
      const [partidasData, palpitesData] = await Promise.all([
        buscarPartidasAbertas(),
        buscarMeusPalpites()
      ])
      setPartidas(partidasData)
      setPalpites(palpitesData)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar dados')
    }
  }

  return (
    <MobileLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Palpites</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Palpites liberados sempre 24 horas antes da partida
        </p>
        {partidas.length === 0 && (
          <div style={{
            background: 'var(--bg-card)', padding: 24, borderRadius: 16,
            textAlign: 'center', color: 'var(--text-secondary)',
            border: '1px solid var(--border)'
          }}>
            Nenhum jogo disponível.
          </div>
        )}
        {partidas.map((partida) => {
          const palpite = palpites.find((p) => p.partida_id === partida.id)
          return <PartidaCard key={partida.id} partida={partida} palpite={palpite} userId={usuario?.id} />
        })}
      </div>
      {/* LEGENDA */}
      <div style={{ padding: '8px 4px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
          Sistema de pontuação:
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          <b> Acertar Placar </b>: Acertar o placar exato da partida (+3 pts)
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          <b> Acertar Resultado </b>: Acertar que a partida terminou em vitória de um dos times ou empate, mas sem acertar o placar exato (+1 pt)
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          <b> Acertar Classificado </b>: Acertar qual time avançou para a próxima fase (+1 ponto extra, só para partidas eliminatórias)
        </p>
      </div>
    </MobileLayout>
  )
}