import {
  useEffect,
  useMemo,
  useState
} from 'react'

import MobileLayout from '../layouts/MobileLayout'

import {
  buscarPartidas
} from '../services/partidasService'

import {
  buscarSelecoes
} from '../services/selecoesService'

import ResultadoCard from '../components/ResultadoCard'

import {
  useAuth
} from '../contexts/AuthContext'

export default function TabelaPage() {

  // =====================================
  // AUTH
  // =====================================

  const { user } = useAuth()

  // =====================================
  // STATES
  // =====================================

  const [loading, setLoading] =
    useState(true)

  const [partidas, setPartidas] =
    useState<any[]>([])

  const [selecoes, setSelecoes] =
    useState<any[]>([])

  // =====================================
  // INIT
  // =====================================

  useEffect(() => {

    carregar()

  }, [])

  async function carregar() {

    try {

      const [
        partidasData,
        selecoesData
      ] = await Promise.all([
        buscarPartidas(),
        buscarSelecoes()
      ])

      setPartidas(partidasData)
      setSelecoes(selecoesData)

    } catch (error) {

      console.error(error)

      alert('Erro ao carregar tabela')

    } finally {

      setLoading(false)
    }
  }

  // =====================================
  // PARTIDAS ENCERRADAS
  // =====================================

  const partidasEncerradas =
  useMemo(() => {

    return partidas
      .filter((partida) => partida.resultado_inserido)
      .map((partida) => {

        // filtra o palpite do usuário logado dentro dos palpites da partida
        const meuPalpite = user?.id
          ? (partida.palpites ?? []).find(
              (p: any) => p.user_id === user.id
            )
          : undefined

        return {
          ...partida,
          meuPalpite   // ResultadoCard lê este campo
        }
      })

  }, [partidas, user])

  // =====================================
  // CALCULAR CLASSIFICAÇÃO
  // =====================================

  const grupos =
    useMemo(() => {

      const tabela: any = {}

      // =====================================
      // CRIAR TODOS OS TIMES
      // =====================================

      selecoes.forEach((selecao: any) => {

        if (!tabela[selecao.grupo]) {

          tabela[selecao.grupo] = []
        }

        tabela[selecao.grupo].push({

          nome: selecao.nome,

          grupo: selecao.grupo,

          pontos: 0,

          jogos: 0,

          vitorias: 0,

          empates: 0,

          derrotas: 0,

          golsPro: 0,

          golsContra: 0,

          saldo: 0
        })
      })

      // =====================================
      // MAPA DE TIMES
      // =====================================

      const mapaTimes: any = {}

      Object.keys(tabela)
        .forEach((grupo) => {

          tabela[grupo]
            .forEach((time: any) => {

              mapaTimes[
                time.nome
              ] = time
            })
        })

      // =====================================
      // CALCULAR RESULTADOS
      // =====================================

      partidasEncerradas
        .forEach((partida) => {

          const timeCasa =
            mapaTimes[
              partida.timeCasa?.nome
            ]

          const timeFora =
            mapaTimes[
              partida.timeFora?.nome
            ]

          if (
            !timeCasa ||
            !timeFora
          ) {
            return
          }

          const golsCasa =
            partida.gols_casa

          const golsFora =
            partida.gols_fora

          // JOGOS

          timeCasa.jogos += 1
          timeFora.jogos += 1

          // GOLS

          timeCasa.golsPro += golsCasa
          timeCasa.golsContra += golsFora

          timeFora.golsPro += golsFora
          timeFora.golsContra += golsCasa

          // SALDO

          timeCasa.saldo =
            timeCasa.golsPro -
            timeCasa.golsContra

          timeFora.saldo =
            timeFora.golsPro -
            timeFora.golsContra

          // RESULTADO

          if (golsCasa > golsFora) {

            timeCasa.pontos += 3

            timeCasa.vitorias += 1

            timeFora.derrotas += 1

          } else if (
            golsFora > golsCasa
          ) {

            timeFora.pontos += 3

            timeFora.vitorias += 1

            timeCasa.derrotas += 1

          } else {

            timeCasa.pontos += 1
            timeFora.pontos += 1

            timeCasa.empates += 1
            timeFora.empates += 1
          }

        })

      // =====================================
      // ORDENAR
      // =====================================

      Object.keys(tabela)
        .forEach((grupo) => {

          tabela[grupo]
            .sort((a: any, b: any) => {

              // PONTOS

              if (
                b.pontos !== a.pontos
              ) {

                return (
                  b.pontos -
                  a.pontos
                )
              }

              // SALDO

              if (
                b.saldo !== a.saldo
              ) {

                return (
                  b.saldo -
                  a.saldo
                )
              }

              // GOLS PRÓ

              return (
                b.golsPro -
                a.golsPro
              )
            })
        })

      return tabela

    }, [
      partidasEncerradas,
      selecoes
    ])

  // =====================================
  // SEPARAR FASES
  // =====================================

  const fasesMataMata =
    useMemo(() => {

      const fases = {

        'pre-oitavas': [],
        oitavas: [],
        quartas: [],
        semi: [],
        final: []

      } as any

      partidasEncerradas
        .forEach((partida) => {

          if (
            partida.fase !== 'grupos'
          ) {

            if (
              !fases[partida.fase]
            ) {

              fases[
                partida.fase
              ] = []
            }

            fases[
              partida.fase
            ].push(partida)
          }

        })

      return fases

    }, [partidasEncerradas])

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <MobileLayout>

        <h1>
          Carregando...
        </h1>

      </MobileLayout>
    )
  }

  // =====================================
  // PAGE
  // =====================================

  return (

    <MobileLayout>

      <div style={{
        display: 'flex',
        flexDirection: 'column',

        gap: 24
      }}>

        {/* HEADER */}

        <div>

          <h1 style={{
            marginBottom: 8
          }}>
            Tabela da Copa
          </h1>

          <p style={{
            color: '#666',
            margin: 0
          }}>
            Classificação atualizada
          </p>

        </div>

        {/* ===================================== */}
        {/* GRUPOS */}
        {/* ===================================== */}

        {
          Object.keys(grupos)
            .sort()
            .map((grupo) => (

              <div
                key={grupo}

                style={{
                  background: 'white',

                  borderRadius: 16,

                  overflow: 'hidden'
                }}
              >

                {/* HEADER */}

                <div style={{
                  padding: 16,

                  borderBottom:
                    '1px solid #eee',

                  fontWeight: 'bold',

                  fontSize: 18
                }}>
                  Grupo {grupo}
                </div>

                {/* TABELA */}

                <div style={{
                  overflowX: 'auto'
                }}>

                  <table style={{
                    width: '100%',

                    borderCollapse:
                      'collapse'
                  }}>

                    <thead>

                      <tr style={{
                        background: '#f9fafb'
                      }}>

                        <th style={thStyle}>
                          #
                        </th>

                        <th style={{
                          ...thStyle,
                          textAlign: 'left'
                        }}>
                          Seleção
                        </th>

                        <th style={thStyle}>
                          P
                        </th>

                        <th style={thStyle}>
                          J
                        </th>

                        <th style={thStyle}>
                          V
                        </th>

                        <th style={thStyle}>
                          E
                        </th>

                        <th style={thStyle}>
                          D
                        </th>

                        <th style={thStyle}>
                          GP
                        </th>

                        <th style={thStyle}>
                          GC
                        </th>

                        <th style={thStyle}>
                          SG
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {
                        grupos[grupo]
                          .map((
                            time: any,
                            index: number
                          ) => (

                            <tr
                              key={time.nome}

                              style={{
                                borderBottom:
                                  '1px solid #f3f4f6'
                              }}
                            >

                              <td style={tdStyle}>
                                {index + 1}
                              </td>

                              <td style={{
                                ...tdStyle,
                                textAlign: 'left',
                                fontWeight: 600
                              }}>
                                {time.nome}
                              </td>

                              <td style={tdStyle}>
                                {time.pontos}
                              </td>

                              <td style={tdStyle}>
                                {time.jogos}
                              </td>

                              <td style={tdStyle}>
                                {time.vitorias}
                              </td>

                              <td style={tdStyle}>
                                {time.empates}
                              </td>

                              <td style={tdStyle}>
                                {time.derrotas}
                              </td>

                              <td style={tdStyle}>
                                {time.golsPro}
                              </td>

                              <td style={tdStyle}>
                                {time.golsContra}
                              </td>

                              <td style={tdStyle}>
                                {time.saldo}
                              </td>

                            </tr>

                          ))
                      }

                    </tbody>

                  </table>

                </div>

                {/* RESULTADOS */}

                <div style={{
                  padding: 16,

                  borderTop:
                    '1px solid #eee',

                  display: 'flex',
                  flexDirection: 'column',

                  gap: 12
                }}>

                  <h3 style={{
                    margin: 0
                  }}>
                    Jogos encerrados
                  </h3>

                  {
                    partidasEncerradas
                      .filter(
                        (partida) =>
                          partida.grupo === grupo
                          &&
                          partida.fase === 'grupos'
                      )
                      .map((partida) => (

                        <ResultadoCard
                          key={partida.id}
                          partida={partida}
                          userId={user?.id}
                        />

                      ))
                  }

                  {
                    partidasEncerradas
                      .filter(
                        (partida) =>
                          partida.grupo === grupo
                          &&
                          partida.fase === 'grupos'
                      ).length === 0 && (

                        <div style={{
                          color: '#666',
                          fontSize: 14
                        }}>
                          Nenhum jogo encerrado.
                        </div>

                      )
                  }

                </div>

              </div>

            ))
        }

        {/* ===================================== */}
        {/* MATA-MATA */}
        {/* ===================================== */}

        {
          Object.entries(fasesMataMata)
            .map(([fase, jogos]: any) => {

              if (jogos.length === 0) {
                return null
              }

              return (

                <div
                  key={fase}

                  style={{
                    background: 'white',

                    borderRadius: 16,

                    padding: 16,

                    display: 'flex',
                    flexDirection: 'column',

                    gap: 12
                  }}
                >

                  <h2 style={{
                    margin: 0
                  }}>
                    {
                      traduzirFase(fase)
                    }
                  </h2>

                  {
                    jogos.map(
                      (partida: any) => (

                        <ResultadoCard
                          key={partida.id}
                          partida={partida}
                          userId={user?.id}
                        />

                      )
                    )
                  }

                </div>

              )
            })
        }

      </div>

    </MobileLayout>
  )
}

// =====================================
// HELPERS
// =====================================

function traduzirFase(
  fase: string
) {

  switch (fase) {

    case 'pre-oitavas':
      return 'Pré-oitavas'

    case 'oitavas':
      return 'Oitavas de final'

    case 'quartas':
      return 'Quartas de final'

    case 'semi':
      return 'Semifinal'

    case 'final':
      return 'Final'

    default:
      return fase
  }
}

// =====================================
// STYLES
// =====================================

const thStyle = {

  padding: '12px 8px',

  fontSize: 12,

  color: '#666',

  textAlign: 'center' as const
}

const tdStyle = {

  padding: '12px 8px',

  fontSize: 14,

  textAlign: 'center' as const
}