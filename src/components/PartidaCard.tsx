import { useEffect, useState } from 'react'

import { salvarPalpite } from '../services/palpitesService'

type Props = {
  partida: any
  palpite?: any
}

export default function PartidaCard({
  partida,
  palpite
}: Props) {

  const [golsCasa, setGolsCasa] = useState('')
  const [golsFora, setGolsFora] = useState('')

  const jogoBloqueado =
    new Date() >= new Date(partida.data_hora)

  // =========================
  // CARREGA PALPITE EXISTENTE
  // =========================

  useEffect(() => {

    if (palpite) {

      setGolsCasa(
        String(palpite.palpite_casa)
      )

      setGolsFora(
        String(palpite.palpite_fora)
      )
    }

  }, [palpite])

  // =========================
  // SALVAR
  // =========================

  async function salvarPalpiteHandler() {

    try {

      if (jogoBloqueado) {

        alert('O jogo já começou')

        return
      }

      if (golsCasa === '' || golsFora === '') {

        alert('Preencha os dois placares')

        return
      }

      await salvarPalpite(
        partida.id,
        Number(golsCasa),
        Number(golsFora)
      )

      alert('Palpite salvo!')

    } catch (error) {

      console.error(error)

      alert('Erro ao salvar palpite')
    }
  }

  return (

    <div style={{
      background: 'white',

      borderRadius: 16,

      padding: 20,

      display: 'flex',
      flexDirection: 'column',
      gap: 20,

      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',

      opacity: jogoBloqueado ? 0.7 : 1
    }}>

      {/* CABEÇALHO */}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        <span style={{
          fontSize: 12,
          color: '#666'
        }}>
          {partida.fase}
        </span>

        <span style={{
          fontSize: 12,
          color: '#666'
        }}>
          {
            new Date(partida.data_hora)
              .toLocaleString('pt-BR')
          }
        </span>

      </div>

      {/* TIMES */}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>

        {/* CASA */}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>

            <div style={{
              width: 42,
              height: 42,

              borderRadius: '50%',

              background: '#f3f4f6',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              fontSize: 18
            }}>
              🏳️
            </div>

            <h2 style={{
              margin: 0,
              fontSize: 18
            }}>
              {partida.timeCasa?.nome}
            </h2>

          </div>

          <input
            type="number"
            min={0}

            disabled={jogoBloqueado}

            value={golsCasa}

            onChange={(e) =>
              setGolsCasa(e.target.value)
            }

            style={{
              width: 60,
              height: 50,

              borderRadius: 10,

              border: '1px solid #ddd',

              textAlign: 'center',

              fontSize: 22
            }}
          />

        </div>

        {/* FORA */}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>

            <div style={{
              width: 42,
              height: 42,

              borderRadius: '50%',

              background: '#f3f4f6',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              fontSize: 18
            }}>
              🏳️
            </div>

            <h2 style={{
              margin: 0,
              fontSize: 18
            }}>
              {partida.timeFora?.nome}
            </h2>

          </div>

          <input
            type="number"
            min={0}

            disabled={jogoBloqueado}

            value={golsFora}

            onChange={(e) =>
              setGolsFora(e.target.value)
            }

            style={{
              width: 60,
              height: 50,

              borderRadius: 10,

              border: '1px solid #ddd',

              textAlign: 'center',

              fontSize: 22
            }}
          />

        </div>

      </div>

      {/* STATUS */}

      {
        jogoBloqueado && (

          <div style={{
            background: '#fee2e2',

            color: '#991b1b',

            padding: 12,

            borderRadius: 10,

            textAlign: 'center',

            fontSize: 14
          }}>
            Palpites encerrados
          </div>
        )
      }

      {/* BOTÃO */}

      <button
        onClick={salvarPalpiteHandler}

        disabled={jogoBloqueado}

        style={{
          height: 50,

          border: 'none',

          borderRadius: 12,

          background: jogoBloqueado
            ? '#9ca3af'
            : '#111827',

          color: 'white',

          fontSize: 16,
          fontWeight: 'bold',

          cursor: 'pointer'
        }}
      >
        {
          palpite
            ? 'Atualizar palpite'
            : 'Salvar palpite'
        }
      </button>

    </div>
  )
}