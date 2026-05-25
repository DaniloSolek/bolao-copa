import {
  useEffect,
  useState
} from 'react'

import MobileLayout from '../layouts/MobileLayout'

import {
  verificarAdmin
} from '../services/adminService'

import {
  buscarPartidas,
  criarPartida
} from '../services/partidasService'

import {
  buscarSelecoes
} from '../services/selecoesService'

import AdminPartidaCard from '../components/adminPartidaCard'

export default function AdminPage() {

  // =====================================
  // STATES
  // =====================================

  const [loading, setLoading] =
    useState(true)

  const [isAdmin, setIsAdmin] =
    useState(false)

  const [partidas, setPartidas] =
    useState<any[]>([])

  const [selecoes, setSelecoes] =
    useState<any[]>([])

  // =====================================
  // FORM PARTIDA
  // =====================================

  const [timeCasaId, setTimeCasaId] =
    useState('')

  const [timeForaId, setTimeForaId] =
    useState('')

  const [dataHora, setDataHora] =
    useState('')

  const [fase, setFase] =
    useState('grupos')

  const [grupo, setGrupo] =
    useState('A')

  // =====================================
  // INIT
  // =====================================

  useEffect(() => {

    carregar()

  }, [])

  async function carregar() {

    try {

      const admin =
        await verificarAdmin()

      setIsAdmin(admin)

      if (admin) {

        const [
          partidasData,
          selecoesData
        ] = await Promise.all([
          buscarPartidas(),
          buscarSelecoes()
        ])

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

  // =====================================
  // CRIAR PARTIDA
  // =====================================

  async function criarPartidaHandler() {

    try {

      if (
        !timeCasaId
        ||
        !timeForaId
        ||
        !dataHora
      ) {

        alert('Preencha todos os campos')

        return
      }

      if (timeCasaId === timeForaId) {

        alert('Selecione seleções diferentes')

        return
      }

      await criarPartida({

        timeCasaId: Number(timeCasaId),
        timeForaId: Number(timeForaId),

        dataHora,
        fase,
        grupo

      })

      alert('Partida criada!')

      setTimeCasaId('')
      setTimeForaId('')
      setDataHora('')

      carregar()

    } catch (error) {

      console.error(error)

      alert('Erro ao criar partida')
    }
  }

  // =====================================
  // AGRUPAR SELEÇÕES
  // =====================================

  const selecoesAgrupadas =
    selecoes.reduce((acc: any, selecao: any) => {

      if (!acc[selecao.grupo]) {
        acc[selecao.grupo] = []
      }

      acc[selecao.grupo].push(selecao)

      return acc

    }, {})

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
  // NÃO ADMIN
  // =====================================

  if (!isAdmin) {

    return (

      <MobileLayout>

        <h1>
          Acesso negado
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

        {/* ===================================== */}
        {/* CRIAR PARTIDA */}
        {/* ===================================== */}

        <div style={{
          background: 'white',

          padding: 20,

          borderRadius: 16,

          display: 'flex',
          flexDirection: 'column',

          gap: 12
        }}>

          <h2>
            Criar partida
          </h2>

          {/* CASA */}

          <select
            value={timeCasaId}

            onChange={(e) =>
              setTimeCasaId(e.target.value)
            }

            style={{
              height: 50,

              borderRadius: 10,

              border: '1px solid #ddd',

              padding: '0 12px'
            }}
          >

            <option value="">
              Seleção da casa
            </option>

            {
              Object.entries(selecoesAgrupadas)
                .map(([grupo, times]: any) => (

                  <optgroup
                    key={grupo}
                    label={`Grupo ${grupo}`}
                  >

                    {
                      times.map((selecao: any) => (

                        <option
                          key={selecao.id}
                          value={selecao.id}
                        >
                          {selecao.nome}
                        </option>

                      ))
                    }

                  </optgroup>

                ))
            }

          </select>

          {/* FORA */}

          <select
            value={timeForaId}

            onChange={(e) =>
              setTimeForaId(e.target.value)
            }

            style={{
              height: 50,

              borderRadius: 10,

              border: '1px solid #ddd',

              padding: '0 12px'
            }}
          >

            <option value="">
              Seleção visitante
            </option>

            {
              Object.entries(selecoesAgrupadas)
                .map(([grupo, times]: any) => (

                  <optgroup
                    key={grupo}
                    label={`Grupo ${grupo}`}
                  >

                    {
                      times.map((selecao: any) => (

                        <option
                          key={selecao.id}
                          value={selecao.id}
                        >
                          {selecao.nome}
                        </option>

                      ))
                    }

                  </optgroup>

                ))
            }

          </select>

          {/* DATA */}

          <input
            type="datetime-local"

            value={dataHora}

            onChange={(e) =>
              setDataHora(e.target.value)
            }

            style={{
              height: 50,

              borderRadius: 10,

              border: '1px solid #ddd',

              padding: '0 12px'
            }}
          />

          {/* FASE */}

          <select
            value={fase}

            onChange={(e) =>
              setFase(e.target.value)
            }

            style={{
              height: 50,

              borderRadius: 10,

              border: '1px solid #ddd',

              padding: '0 12px'
            }}
          >

            <option value="grupos">
              Fase de grupos
            </option>

            <option value="pre-oitavas">
              Pré-oitavas
            </option>

            <option value="oitavas">
              Oitavas
            </option>

            <option value="quartas">
              Quartas
            </option>

            <option value="semi">
              Semifinal
            </option>

            <option value="final">
              Final
            </option>

          </select>

          {/* GRUPO */}

          <select
            value={grupo}

            onChange={(e) =>
              setGrupo(e.target.value)
            }

            style={{
              height: 50,

              borderRadius: 10,

              border: '1px solid #ddd',

              padding: '0 12px'
            }}
          >

            {
              'ABCDEFGHIJKL'
                .split('')
                .map((grupo) => (

                  <option
                    key={grupo}
                    value={grupo}
                  >
                    Grupo {grupo}
                  </option>

                ))
            }

          </select>

          {/* BOTÃO */}

          <button
            onClick={criarPartidaHandler}

            style={{
              height: 50,

              border: 'none',

              borderRadius: 12,

              background: '#111827',

              color: 'white',

              fontWeight: 'bold'
            }}
          >
            Criar partida
          </button>

        </div>

        {/* ===================================== */}
        {/* PARTIDAS */}
        {/* ===================================== */}

        <div style={{
          display: 'flex',
          flexDirection: 'column',

          gap: 16
        }}>

          <h2>
            Partidas cadastradas
          </h2>

          {
            partidas.length === 0 && (

              <div style={{
                background: 'white',

                borderRadius: 16,

                padding: 24,

                textAlign: 'center'
              }}>
                Nenhuma partida cadastrada.
              </div>

            )
          }

          {
            partidas.map((partida) => (

              <AdminPartidaCard
                key={partida.id}
                partida={partida}
                recarregar={carregar}
              />

            ))
          }

        </div>

      </div>

    </MobileLayout>
  )
}