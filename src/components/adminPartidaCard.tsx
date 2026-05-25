import {
  useState
} from 'react'

import {
  salvarResultado,
  excluirPartida
} from '../services/partidasService'

type Props = {
  partida: any
  recarregar: () => void
}

export default function AdminPartidaCard({
  partida,
  recarregar
}: Props) {

  // =====================================
  // RESULTADO
  // =====================================

  const [golsCasa, setGolsCasa] =
    useState(
      partida.gols_casa ?? ''
    )

  const [golsFora, setGolsFora] =
    useState(
      partida.gols_fora ?? ''
    )

  // =====================================
  // EXCLUIR
  // =====================================

  async function excluirHandler() {

    const confirmar =
      confirm(
        'Deseja excluir esta partida?'
      )

    if (!confirmar) {
      return
    }

    try {

      await excluirPartida(
        partida.id
      )

      alert('Partida excluída!')

      recarregar()

    } catch (error) {

      console.error(error)

      alert('Erro ao excluir partida')
    }
  }

  // =====================================
  // RESULTADO
  // =====================================

  async function salvarResultadoHandler() {

    try {

      await salvarResultado(
        partida.id,
        Number(golsCasa),
        Number(golsFora)
      )

      alert('Resultado salvo!')

      recarregar()

    } catch (error) {

      console.error(error)

      alert('Erro ao salvar resultado')
    }
  }

  // =====================================
  // COMPONENT
  // =====================================

  return (

    <div style={{
      background: 'white',

      borderRadius: 16,

      padding: 20,

      display: 'flex',
      flexDirection: 'column',

      gap: 16
    }}>

      {/* HEADER */}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        <div>

          <div style={{
            fontWeight: 'bold'
          }}>
            Grupo {partida.grupo}
          </div>

          <div style={{
            color: '#666',
            fontSize: 14
          }}>
            {partida.fase}
          </div>

        </div>

        {
          partida.resultado_inserido && (

            <div style={{
              background: '#dcfce7',

              color: '#166534',

              padding: '6px 12px',

              borderRadius: 999,

              fontSize: 13,

              fontWeight: 'bold'
            }}>
              Encerrado
            </div>

          )
        }

      </div>

      {/* TIMES */}

      <div style={{
        textAlign: 'center'
      }}>

        <h2 style={{
          marginBottom: 8
        }}>
          {partida.timeCasa?.nome}
        </h2>

        <div style={{
          color: '#666'
        }}>
          vs
        </div>

        <h2 style={{
          marginTop: 8
        }}>
          {partida.timeFora?.nome}
        </h2>

      </div>

      {/* DATA */}

      <div style={{
        textAlign: 'center',

        color: '#666',

        fontSize: 14
      }}>
        {
          new Date(
            partida.data_hora
          ).toLocaleString('pt-BR')
        }
      </div>

      {/* RESULTADO */}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        gap: 12
      }}>

        <input
          type="number"

          value={golsCasa}

          onChange={(e) =>
            setGolsCasa(e.target.value)
          }

          style={{
            width: 70,
            height: 55,

            borderRadius: 12,

            border: '1px solid #ddd',

            textAlign: 'center',

            fontSize: 24
          }}
        />

        <div>
          x
        </div>

        <input
          type="number"

          value={golsFora}

          onChange={(e) =>
            setGolsFora(e.target.value)
          }

          style={{
            width: 70,
            height: 55,

            borderRadius: 12,

            border: '1px solid #ddd',

            textAlign: 'center',

            fontSize: 24
          }}
        />

      </div>

      {/* BOTÕES */}

      <div style={{
        display: 'flex',
        gap: 12
      }}>

        <button
          onClick={salvarResultadoHandler}

          style={{
            flex: 1,

            height: 50,

            border: 'none',

            borderRadius: 12,

            background: '#111827',

            color: 'white',

            fontWeight: 'bold'
          }}
        >
          Salvar resultado
        </button>

        <button
          onClick={excluirHandler}

          style={{
            width: 110,

            border: 'none',

            borderRadius: 12,

            background: '#dc2626',

            color: 'white',

            fontWeight: 'bold'
          }}
        >
          Excluir
        </button>

      </div>

    </div>
  )
}