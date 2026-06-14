import { useEffect, useMemo, useState } from 'react'
import MobileLayout from '../layouts/MobileLayout'
import { buscarPartidas } from '../services/partidasService'
import { buscarSelecoes } from '../services/selecoesService'
import ResultadoCard from '../components/ResultadoCard'
import { useAuth } from '../contexts/AuthContext'

export default function TabelaPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [partidas, setPartidas] = useState<any[]>([])
  const [selecoes, setSelecoes] = useState<any[]>([])

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const [partidasData, selecoesData] = await Promise.all([buscarPartidas(), buscarSelecoes()])
      setPartidas(partidasData)
      setSelecoes(selecoesData)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar tabela')
    } finally {
      setLoading(false)
    }
  }

  const partidasEncerradas = useMemo(() =>
    partidas
      .filter((p) => p.resultado_inserido)
      .map((p) => ({
        ...p,
        meuPalpite: user?.id ? (p.palpites ?? []).find((x: any) => x.user_id === user.id) : undefined
      })),
    [partidas, user]
  )

  const grupos = useMemo(() => {
    const tabela: any = {}

    selecoes.forEach((s: any) => {
      if (!tabela[s.grupo]) tabela[s.grupo] = []
      tabela[s.grupo].push({ nome: s.nome, grupo: s.grupo, pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0, saldo: 0 })
    })

    const mapa: any = {}
    Object.keys(tabela).forEach((g) => tabela[g].forEach((t: any) => { mapa[t.nome] = t }))

    partidasEncerradas.filter((p) => p.fase === 'grupos').forEach((p) => {
      const casa = mapa[p.timeCasa?.nome]
      const fora = mapa[p.timeFora?.nome]
      if (!casa || !fora) return

      casa.jogos++; fora.jogos++
      casa.golsPro += p.gols_casa; casa.golsContra += p.gols_fora
      fora.golsPro += p.gols_fora; fora.golsContra += p.gols_casa
      casa.saldo = casa.golsPro - casa.golsContra
      fora.saldo = fora.golsPro - fora.golsContra

      if (p.gols_casa > p.gols_fora) { casa.pontos += 3; casa.vitorias++; fora.derrotas++ }
      else if (p.gols_fora > p.gols_casa) { fora.pontos += 3; fora.vitorias++; casa.derrotas++ }
      else { casa.pontos++; fora.pontos++; casa.empates++; fora.empates++ }
    })

    Object.keys(tabela).forEach((g) =>
      tabela[g].sort((a: any, b: any) =>
        b.pontos !== a.pontos ? b.pontos - a.pontos :
        b.saldo !== a.saldo ? b.saldo - a.saldo :
        b.golsPro - a.golsPro
      )
    )
    return tabela
  }, [partidasEncerradas, selecoes])

  const fasesMataMata = useMemo(() => {
    const fases: any = { 'pre-oitavas': [], oitavas: [], quartas: [], semi: [], terceiro: [], final: [] }
    partidasEncerradas.forEach((p) => { if (p.fase !== 'grupos' && fases[p.fase]) fases[p.fase].push(p) })
    return fases
  }, [partidasEncerradas])

  if (loading) return <MobileLayout><h1>Carregando...</h1></MobileLayout>

  return (
    <MobileLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <h1 style={{ marginBottom: 4, color: 'var(--text-primary)' }}>Tabela da Copa</h1>
        </div>

        {/* GRUPOS */}
        {Object.keys(grupos).sort().map((grupo) => (
          <div key={grupo} style={{
            background: 'var(--bg-card)', borderRadius: 16, overflow: 'hidden',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid var(--border)',
              fontWeight: 'bold', fontSize: 16, color: 'var(--text-secondary)', background: '#0f172a'
            }}>
              Grupo {grupo}
            </div>

            {/* TABELA */}
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 20 }} />   {/* # */}
                <col />                         {/* Seleção */}
                <col style={{ width: 28 }} />   {/* P */}
                <col style={{ width: 24 }} />   {/* J */}
                <col style={{ width: 24 }} />   {/* V */}
                <col style={{ width: 24 }} />   {/* E */}
                <col style={{ width: 24 }} />   {/* D */}
                <col style={{ width: 24 }} />   {/* GP */}
                <col style={{ width: 24 }} />   {/* GC */}
                <col style={{ width: 28 }} />   {/* SG */}
              </colgroup>
              <thead>
                <tr style={{ background: '#162032' }}>
                  <th style={thStyle}>#</th>
                  <th style={{ ...thStyle, textAlign: 'left', paddingLeft: 8 }}>Seleção</th>
                  <th style={thStyle}>P</th>
                  <th style={thStyle}>J</th>
                  <th style={thStyle}>V</th>
                  <th style={thStyle}>E</th>
                  <th style={thStyle}>D</th>
                  <th style={thStyle}>GP</th>
                  <th style={thStyle}>GC</th>
                  <th style={thStyle}>SG</th>
                </tr>
              </thead>
              <tbody>
                {grupos[grupo].map((time: any, index: number) => (
                  <tr key={time.nome} style={{
                    borderBottom: '1px solid var(--border)',
                    background: index < 2 ? 'rgba(59,130,246,0.08)' : 'transparent'
                  }}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: 8, fontWeight: 600, color: 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {time.nome}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{time.pontos}</td>
                    <td style={tdStyle}>{time.jogos}</td>
                    <td style={tdStyle}>{time.vitorias}</td>
                    <td style={tdStyle}>{time.empates}</td>
                    <td style={tdStyle}>{time.derrotas}</td>
                    <td style={tdStyle}>{time.golsPro}</td>
                    <td style={tdStyle}>{time.golsContra}</td>
                    <td style={{ ...tdStyle, color: time.saldo > 0 ? '#4ade80' : time.saldo < 0 ? '#f87171' : 'var(--text-secondary)' }}>
                      {time.saldo > 0 ? `+${time.saldo}` : time.saldo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* JOGOS ENCERRADOS */}
            <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
                Jogos encerrados
              </h3>
              {partidasEncerradas
                .filter((p) => p.grupo === grupo && p.fase === 'grupos')
                .map((p) => <ResultadoCard key={p.id} partida={p} userId={user?.id} />)
              }
              {partidasEncerradas.filter((p) => p.grupo === grupo && p.fase === 'grupos').length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhum jogo encerrado.</div>
              )}
            </div>
          </div>
        ))}

        {/* MATA-MATA */}
        {Object.entries(fasesMataMata).map(([fase, jogos]: any) => {
          if (jogos.length === 0) return null
          return (
            <div key={fase} style={{
              background: 'var(--bg-card)', borderRadius: 16, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{traduzirFase(fase)}</h2>
              {jogos.map((p: any) => <ResultadoCard key={p.id} partida={p} userId={user?.id} />)}
            </div>
          )
        })}

      </div>
    </MobileLayout>
  )
}

function traduzirFase(fase: string) {
  switch (fase) {
    case 'pre-oitavas': return 'Pré-oitavas'
    case 'oitavas': return 'Oitavas de final'
    case 'quartas': return 'Quartas de final'
    case 'semi': return 'Semifinal'
    case 'terceiro': return 'Disputa de 3° lugar'
    case 'final': return 'Final'
    default: return fase
  }
}

const thStyle = {
  padding: '10px 2px', fontSize: 11,
  color: 'var(--text-secondary)',
  textAlign: 'center' as const,
  fontWeight: 600
}

const tdStyle = {
  padding: '11px 2px', fontSize: 12,
  color: 'var(--text-secondary)',
  textAlign: 'center' as const
}