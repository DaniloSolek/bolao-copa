import { useEffect, useState } from 'react'
import MobileLayout from '../layouts/MobileLayout'
import { buscarPartidasAbertas } from '../services/partidasService'
import { buscarMeusPalpites } from '../services/palpitesService'
import PartidaCard from '../components/PartidaCard'

export default function PalpitesPage() {
  const [partidas, setPartidas] = useState<any[]>([])
  const [palpites, setPalpites] = useState<any[]>([])

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
          return <PartidaCard key={partida.id} partida={partida} palpite={palpite} />
        })}
      </div>
    </MobileLayout>
  )
}