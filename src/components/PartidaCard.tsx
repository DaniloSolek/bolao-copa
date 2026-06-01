import { useEffect, useState } from 'react'
import { salvarPalpite, buscarPalpitesDaPartida } from '../services/palpitesService'
import { getBandeira } from '../utils/bandeiras'
import { isFaseEliminatoria as isFaseElim } from '../services/partidasService'

type Props = { partida: any; palpite?: any; userId?: string }

export default function PartidaCard({ partida, palpite, userId }: Props) {
  const [golsCasa, setGolsCasa] = useState('')
  const [golsFora, setGolsFora] = useState('')
  const [palpiteClassificadoId, setPalpiteClassificadoId] = useState('')
  const [palpitesAberto, setPalpitesAberto] = useState(false)
  const [palpitesTodos, setPalpitesTodos] = useState<any[]>([])
  const [loadingPalpites, setLoadingPalpites] = useState(false)

  const jogoBloqueado = new Date() >= new Date(partida.data_hora)
  const eliminatoria = isFaseElim(partida.fase)

  const palpiteEmpate = golsCasa !== '' && golsFora !== '' && Number(golsCasa) === Number(golsFora)

  useEffect(() => {
    if (palpite) {
      setGolsCasa(String(palpite.palpite_casa))
      setGolsFora(String(palpite.palpite_fora))
      if (palpite.palpite_classificado_id) {
        setPalpiteClassificadoId(String(palpite.palpite_classificado_id))
      }
    }
  }, [palpite])

  async function salvarPalpiteHandler() {
    try {
      if (jogoBloqueado) { alert('O jogo já começou'); return }
      if (golsCasa === '' || golsFora === '') { alert('Preencha os dois placares'); return }
      if (eliminatoria && palpiteEmpate && !palpiteClassificadoId) {
        alert('Em fases eliminatórias com empate, selecione quem você acha que passa nos pênaltis')
        return
      }
      await salvarPalpite(
        partida.id,
        Number(golsCasa),
        Number(golsFora),
        eliminatoria && palpiteEmpate && palpiteClassificadoId ? Number(palpiteClassificadoId) : null
      )
      alert('Palpite salvo!')
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar palpite')
    }
  }

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

  const circulo = {
    width: 42, height: 42, borderRadius: '50%',
    background: 'var(--bg-input)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
  }

  const selectStyle = {
    height: 44, borderRadius: 10, width: '100%',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text-primary)',
    padding: '0 12px', fontSize: 14
  }

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 16,
      display: 'flex', flexDirection: 'column',
      border: '1px solid var(--border)',
      opacity: jogoBloqueado ? 0.7 : 1,
      overflow: 'hidden'
    }}>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* CABEÇALHO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{partida.fase}</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {new Date(partida.data_hora).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
          </span>
        </div>

        {/* TIMES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={circulo}>{getBandeira(partida.timeCasa?.nome)}</div>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text-primary)' }}>{partida.timeCasa?.nome}</h2>
            </div>
            <input type="number" min={0} disabled={jogoBloqueado} value={golsCasa}
              onChange={(e) => { setGolsCasa(e.target.value); setPalpiteClassificadoId('') }}
              style={{ width: 60, height: 50, borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--bg-input)', color: 'var(--text-primary)', textAlign: 'center', fontSize: 22 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={circulo}>{getBandeira(partida.timeFora?.nome)}</div>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text-primary)' }}>{partida.timeFora?.nome}</h2>
            </div>
            <input type="number" min={0} disabled={jogoBloqueado} value={golsFora}
              onChange={(e) => { setGolsFora(e.target.value); setPalpiteClassificadoId('') }}
              style={{ width: 60, height: 50, borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--bg-input)', color: 'var(--text-primary)', textAlign: 'center', fontSize: 22 }} />
          </div>
        </div>

        {/* SELETOR DE PÊNALTIS */}
        {eliminatoria && palpiteEmpate && !jogoBloqueado && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Empate — quem você acha que passa nos pênaltis?
            </span>
            <select
              value={palpiteClassificadoId}
              onChange={(e) => setPalpiteClassificadoId(e.target.value)}
              style={selectStyle}
            >
              <option value="">Selecionar...</option>
              <option value={String(partida.time_casa_id)}>{partida.timeCasa?.nome}</option>
              <option value={String(partida.time_fora_id)}>{partida.timeFora?.nome}</option>
            </select>
          </div>
        )}

        {/* STATUS */}
        {jogoBloqueado && (
          <div style={{ background: '#450a0a', color: '#fca5a5', padding: 12, borderRadius: 10, textAlign: 'center', fontSize: 14 }}>
            Palpites encerrados
          </div>
        )}

        {/* BOTÃO SALVAR */}
        <button onClick={salvarPalpiteHandler} disabled={jogoBloqueado} style={{
          height: 50, border: 'none', borderRadius: 12,
          background: jogoBloqueado ? '#334155' : '#3b82f6',
          color: 'white', fontSize: 16, fontWeight: 'bold', cursor: 'pointer'
        }}>
          {palpite ? 'Atualizar palpite' : 'Salvar palpite'}
        </button>
      </div>

      {/* BARRA EXPANSÍVEL */}
      <button onClick={togglePalpites} style={{
        border: 'none', borderTop: '1px solid var(--border)',
        background: 'transparent', cursor: 'pointer',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        color: 'var(--text-secondary)', fontSize: 13
      }}>
        {loadingPalpites ? 'Carregando...' : palpitesAberto ? '▲ Ocultar palpites' : '▼ Ver palpites dos jogadores'}
      </button>

      {palpitesAberto && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 8
        }}>
          {palpitesTodos.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '8px 0' }}>
              Nenhum palpite ainda.
            </div>
          )}
          {palpitesTodos.map((p: any) => {
            const souEu = p.user_id === userId
            const naoJogou = p.palpite_casa === null
            return (
              <div key={p.user_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 10,
                background: souEu ? 'rgba(59,130,246,0.12)' : 'var(--bg-input)',
                border: souEu ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent'
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: souEu ? 700 : 400 }}>
                  {p.profile?.username ?? 'Jogador'}{souEu && <span style={{ color: '#3b82f6', fontSize: 11 }}> (você)</span>}
                </span>
                {naoJogou ? (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>NP</span>
                ) : (
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {p.palpite_casa} x {p.palpite_fora}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}