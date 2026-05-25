import { useEffect, useState } from 'react'

import MobileLayout from '../layouts/MobileLayout'

import { buscarRanking } from '../services/rankingService'

export default function RankingPage() {

  const [ranking, setRanking] = useState<any[]>([])

  useEffect(() => {

    carregarRanking()

  }, [])

  async function carregarRanking() {

    try {

      const data = await buscarRanking()

      setRanking(data)

    } catch (error) {

      console.error(error)

      alert('Erro ao carregar ranking')
    }
  }

  return (

    <MobileLayout>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>

        <h1>Classificação</h1>

        {
          ranking.map((usuario, index) => (

            <div
              key={usuario.user_id}

              style={{
                background: 'white',

                padding: 16,

                borderRadius: 12,

                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >

              <div>

                <strong>
                  #{index + 1}
                </strong>

                {' '}

                {usuario.username}

              </div>

              <strong>
                {usuario.pontos} pts
              </strong>

            </div>

          ))
        }

      </div>

    </MobileLayout>
  )
}