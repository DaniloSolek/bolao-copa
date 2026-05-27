import { useEffect, useState, useMemo } from 'react'
import MobileLayout from '../layouts/MobileLayout'
import { verificarAdmin } from '../services/adminService'
import { buscarPartidas, criarPartida } from '../services/partidasService'
import { buscarSelecoes } from '../services/selecoesService'
import AdminPartidaCard from '../components/adminPartidaCard'

const selectStyle = {
  height: 50, borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--bg-input)', color: 'var(--text-primary)',
  padding: '0 12px', width: '100%', fontSize: 15
}

type Filtro = 'todas' | 'abertas' | 'encerradas'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [partidas, setPartidas] = useState<any[]>([])
  const [selecoes, setSelecoes] = useState<any[]>([])
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [timeCasaId, setTimeCasaId] = useState('')
  const [timeForaId, setTimeForaId] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [fase, setFase] = useState('grupos')
  const [grupo, setGrupo] = useState('A')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const admin = await verificarAdmin()
      setIsAdmin(admin)
      if (admin) {
        const [partidasData, selecoesData] = await Promise.all([buscarPartidas(), buscarSelecoes()])
        setPartidas(partidasData)
        setSelecoes(selecoesData)
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar admin')
    } finally {
      setLoading(false)
    }
  }

  async function criarPartidaHandler() {
    if (!timeCasaId || !timeForaId || !dataHora) { alert('Preencha todos os campos'); return }
    if (timeCasaId === timeForaId) { alert('Selecione seleções diferentes'); return }
    try {
      await criarPartida({ timeCasaId: Number(timeCasaId), timeForaId: Number(timeForaId), dataHora, fase, grupo })
      alert('Partida criada!')
      setTimeCasaId(''); setTimeForaId(''); setDataHora('')
      carregar()
    } catch (error) { console.error(error); alert('Erro ao criar partida') }
  }

  const selecoesAgrupadas = selecoes.reduce((acc: any, s: any) => {
    if (!acc[s.grupo]) acc[s.grupo] = []
    acc[s.grupo].push(s)
    return acc
  }, {})

  const renderOpcoes = () =>
    Object.entries(selecoesAgrupadas).map(([g, times]: any) => (
      <optgroup key={g} label={`Grupo ${g}`}>
        {times.map((s: any) => <option key={s.id} value={s.id}>{s.nome}</option>)}
      </optgroup>
    ))

  const partidasFiltradas = useMemo(() => {
    if (filtro === 'abertas') return partidas.filter((p) => !p.resultado_inserido)
    if (filtro === 'encerradas') return partidas.filter((p) => p.resultado_inserido)
    return partidas
  }, [partidas, filtro])

  const contagem = useMemo(() => ({
    todas: partidas.length,
    abertas: partidas.filter((p) => !p.resultado_inserido).length,
    encerradas: partidas.filter((p) => p.resultado_inserido).length,
  }), [partidas])

  if (loading) return <MobileLayout><h1>Carregando...</h1></MobileLayout>
  if (!isAdmin) return <MobileLayout><h1>Acesso negado</h1></MobileLayout>

  const btnFiltro = (f: Filtro, label: string) => (
    <button
      key={f}
      onClick={() => setFiltro(f)}
      style={{
        flex: 1, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer',
        fontWeight: 600, fontSize: 13,
        background: filtro === f ? '#3b82f6' : 'var(--bg-input)',
        color: filtro === f ? 'white' : 'var(--text-secondary)',
      }}
    >
      {label} <span style={{ opacity: 0.7, fontSize: 11 }}>({contagem[f]})</span>
    </button>
  )

  return (
    <MobileLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* CRIAR PARTIDA */}
        <div style={{
          background: 'var(--bg-card)', padding: 20, borderRadius: 16,
          display: 'flex', flexDirection: 'column', gap: 12,
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ color: 'var(--text-primary)' }}>Criar partida</h2>
          <select value={timeCasaId} onChange={(e) => setTimeCasaId(e.target.value)} style={selectStyle}>
            <option value="">Seleção da casa</option>{renderOpcoes()}
          </select>
          <select value={timeForaId} onChange={(e) => setTimeForaId(e.target.value)} style={selectStyle}>
            <option value="">Seleção visitante</option>{renderOpcoes()}
          </select>
          <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)}
            style={{ ...selectStyle, padding: '0 12px' }} />
          <select value={fase} onChange={(e) => setFase(e.target.value)} style={selectStyle}>
            <option value="grupos">Fase de grupos</option>
            <option value="pre-oitavas">Pré-oitavas</option>
            <option value="oitavas">Oitavas</option>
            <option value="quartas">Quartas</option>
            <option value="semi">Semifinal</option>
            <option value="final">Final</option>
          </select>
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)} style={selectStyle}>
            {'ABCDEFGHIJKL'.split('').map((g) => <option key={g} value={g}>Grupo {g}</option>)}
          </select>
          <button onClick={criarPartidaHandler} style={{
            height: 50, border: 'none', borderRadius: 12,
            background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: 16
          }}>Criar partida</button>
        </div>

        {/* PARTIDAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Partidas cadastradas</h2>
          </div>

          {/* FILTROS */}
          <div style={{ display: 'flex', gap: 8 }}>
            {btnFiltro('todas', 'Todas')}
            {btnFiltro('abertas', 'Abertas')}
            {btnFiltro('encerradas', 'Encerradas')}
          </div>

          {/* LISTA */}
          {partidasFiltradas.length === 0 && (
            <div style={{
              background: 'var(--bg-card)', borderRadius: 12, padding: 20,
              textAlign: 'center', color: 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}>Nenhuma partida encontrada.</div>
          )}
          {partidasFiltradas.map((partida) => (
            <AdminPartidaCard key={partida.id} partida={partida} recarregar={carregar} />
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}