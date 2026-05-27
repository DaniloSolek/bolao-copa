import { useEffect, useState } from 'react'
import { salvarPalpite } from '../services/palpitesService'
import { getBandeira } from '../utils/bandeiras'

type Props = { partida: any; palpite?: any }

export default function PartidaCard({ partida, palpite }: Props) {
  const [golsCasa, setGolsCasa] = useState('')
  const [golsFora, setGolsFora] = useState('')
  const jogoBloqueado = new Date() >= new Date(partida.data_hora)

  useEffect(() => {
    if (palpite) {
      setGolsCasa(String(palpite.palpite_casa))
      setGolsFora(String(palpite.palpite_fora))
    }
  }, [palpite])

  async function salvarPalpiteHandler() {
    try {
      if (jogoBloqueado) { alert('O jogo já começou'); return }
      if (golsCasa === '' || golsFora === '') { alert('Preencha os dois placares'); return }
      await salvarPalpite(partida.id, Number(golsCasa), Number(golsFora))
      alert('Palpite salvo!')
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar palpite')
    }
  }

  const circulo = {
    width: 42, height: 42, borderRadius: '50%',
    background: 'var(--bg-input)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 16, padding: 20,
      display: 'flex', flexDirection: 'column', gap: 20,
      border: '1px solid var(--border)',
      opacity: jogoBloqueado ? 0.7 : 1
    }}>
      {/* CABEÇALHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{partida.fase}</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {new Date(partida.data_hora).toLocaleString('pt-BR')}
        </span>
      </div>

      {/* TIMES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* CASA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={circulo}>{getBandeira(partida.timeCasa?.nome)}</div>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text-primary)' }}>{partida.timeCasa?.nome}</h2>
          </div>
          <input type="number" min={0} disabled={jogoBloqueado} value={golsCasa}
            onChange={(e) => setGolsCasa(e.target.value)}
            style={{ width: 60, height: 50, borderRadius: 10, border: '1px solid var(--border)',
              background: 'var(--bg-input)', color: 'var(--text-primary)', textAlign: 'center', fontSize: 22 }}
          />
        </div>
        {/* FORA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={circulo}>{getBandeira(partida.timeFora?.nome)}</div>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text-primary)' }}>{partida.timeFora?.nome}</h2>
          </div>
          <input type="number" min={0} disabled={jogoBloqueado} value={golsFora}
            onChange={(e) => setGolsFora(e.target.value)}
            style={{ width: 60, height: 50, borderRadius: 10, border: '1px solid var(--border)',
              background: 'var(--bg-input)', color: 'var(--text-primary)', textAlign: 'center', fontSize: 22 }}
          />
        </div>
      </div>

      {/* STATUS */}
      {jogoBloqueado && (
        <div style={{ background: '#450a0a', color: '#fca5a5', padding: 12, borderRadius: 10, textAlign: 'center', fontSize: 14 }}>
          Palpites encerrados
        </div>
      )}

      {/* BOTÃO */}
      <button onClick={salvarPalpiteHandler} disabled={jogoBloqueado} style={{
        height: 50, border: 'none', borderRadius: 12,
        background: jogoBloqueado ? '#334155' : '#3b82f6',
        color: 'white', fontSize: 16, fontWeight: 'bold', cursor: 'pointer'
      }}>
        {palpite ? 'Atualizar palpite' : 'Salvar palpite'}
      </button>
    </div>
  )
}