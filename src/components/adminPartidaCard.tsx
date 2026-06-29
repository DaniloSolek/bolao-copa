import { useState } from 'react'
import { salvarResultado, excluirPartida, isFaseEliminatoria } from '../services/partidasService'

type Props = { partida: any; recarregar: () => void }

export default function AdminPartidaCard({ partida, recarregar }: Props) {
  const [golsCasa, setGolsCasa] = useState(partida.gols_casa ?? '')
  const [golsFora, setGolsFora] = useState(partida.gols_fora ?? '')
  const [timeClassificadoId, setTimeClassificadoId] = useState<string>(
    partida.time_classificado_id ? String(partida.time_classificado_id) : ''
  )
  const [expandido, setExpandido] = useState(false)

  const eliminatoria = isFaseEliminatoria(partida.fase)

  const foiEmpate = golsCasa !== '' && golsFora !== '' && Number(golsCasa) === Number(golsFora)

  async function excluirHandler() {
    if (!confirm('Deseja excluir esta partida?')) return
    try {
      await excluirPartida(partida.id)
      alert('Partida excluída!')
      recarregar()
    } catch (error) { console.error(error); alert('Erro ao excluir partida') }
  }

  async function salvarResultadoHandler() {
    try {
      if (eliminatoria && foiEmpate && !timeClassificadoId) {
        alert('Informe quem passou de fase')
        return
      }

      await salvarResultado(
        partida.id,
        Number(golsCasa),
        Number(golsFora),
        eliminatoria && foiEmpate && timeClassificadoId ? Number(timeClassificadoId) : null,
        partida.fase
      )
      alert('Resultado salvo!')
      recarregar()
      setExpandido(false)
    } catch (error) { console.error(error); alert('Erro ao salvar resultado') }
  }

  const inputStyle = {
    width: 56, height: 44, borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text-primary)',
    textAlign: 'center' as const, fontSize: 20
  }

  const selectStyle = {
    height: 44, borderRadius: 10, width: '100%',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text-primary)',
    padding: '0 12px', fontSize: 14
  }

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 12,
      border: '1px solid var(--border)', overflow: 'hidden'
    }}>
      {/* LINHA COMPACTA */}
      <div onClick={() => setExpandido(!expandido)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', cursor: 'pointer', gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
            background: 'var(--bg-input)', padding: '2px 7px', borderRadius: 6, flexShrink: 0
          }}>
            {eliminatoria ? partida.fase.toUpperCase() : `G${partida.grupo}`}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {partida.timeCasa?.nome} vs {partida.timeFora?.nome}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {partida.resultado_inserido ? (
            <span style={{
              fontSize: 13, fontWeight: 700, color: '#86efac',
              background: '#14532d', padding: '2px 10px', borderRadius: 999
            }}>
              {partida.gols_casa} x {partida.gols_fora}
              {partida.time_classificado_id && (
                <span style={{ fontSize: 11, marginLeft: 4, opacity: 0.8 }}>
                  (pen.)
                </span>
              )}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {new Date(partida.data_hora).toLocaleDateString('pt-BR')}
            </span>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {expandido ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* EXPANSÃO */}
      {expandido && (
        <div style={{
          borderTop: '1px solid var(--border)', padding: 14,
          display: 'flex', flexDirection: 'column', gap: 12
        }}>
          {/* DATA + FASE */}
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
            {new Date(partida.data_hora).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} · {partida.fase}
          </div>

          {/* PLACAR */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <input type="number" value={golsCasa} onChange={(e) => { setGolsCasa(e.target.value); setTimeClassificadoId('') }} style={inputStyle} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>x</span>
            <input type="number" value={golsFora} onChange={(e) => { setGolsFora(e.target.value); setTimeClassificadoId('') }} style={inputStyle} />
          </div>

          {/* SELETOR DE PÊNALTIS */}
          {eliminatoria && foiEmpate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
                Empate — quem passou de fase?
              </span>
              <select
                value={timeClassificadoId}
                onChange={(e) => setTimeClassificadoId(e.target.value)}
                style={selectStyle}
              >
                <option value="">Selecionar...</option>
                <option value={String(partida.time_casa_id)}>{partida.timeCasa?.nome}</option>
                <option value={String(partida.time_fora_id)}>{partida.timeFora?.nome}</option>
              </select>
            </div>
          )}

          {/* BOTÕES */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={salvarResultadoHandler} style={{
              flex: 1, height: 42, border: 'none', borderRadius: 10,
              background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: 14
            }}>Salvar resultado</button>
            <button onClick={excluirHandler} style={{
              width: 90, height: 42, border: 'none', borderRadius: 10,
              background: '#dc2626', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: 14
            }}>Excluir</button>
          </div>
        </div>
      )}
    </div>
  )
}