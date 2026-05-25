type Props = {
  partida: any
  userId?: string
}

export default function ResultadoCard({
  partida,
  userId
}: Props) {

  // =====================================
  // PALPITE USUÁRIO
  // =====================================

  const meuPalpite =
    partida.palpites?.find(
      (p: any) =>
        p.user_id === userId
    )

  // =====================================
  // COMPONENT
  // =====================================

  return (

    <div style={{
      background: 'white',

      borderRadius: 14,

      padding: 14,

      display: 'flex',
      flexDirection: 'column',

      gap: 10,

      border:
        '1px solid #f1f5f9'
    }}>

      {/* TIMES */}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        gap: 10
      }}>

        <div style={{
          flex: 1,

          textAlign: 'right',

          fontWeight: 600,

          fontSize: 14
        }}>
          {partida.timeCasa?.nome}
        </div>

        {/* RESULTADO */}

        <div style={{
          fontWeight: 'bold',

          fontSize: 18,

          minWidth: 70,

          textAlign: 'center'
        }}>
          {partida.gols_casa} x {partida.gols_fora}
        </div>

        <div style={{
          flex: 1,

          fontWeight: 600,

          fontSize: 14
        }}>
          {partida.timeFora?.nome}
        </div>

      </div>

      {/* PALPITE */}

      {
        meuPalpite && (

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

            background: '#f8fafc',

            borderRadius: 10,

            padding: '10px 12px',

            fontSize: 13
          }}>

            <div>

              Seu palpite:

              <strong>
                {' '}
                {meuPalpite.palpite_casa}
                {' x '}
                {meuPalpite.palpite_fora}
              </strong>

            </div>

            <div style={{
              fontWeight: 'bold',

              color:
                meuPalpite.pontos > 0
                  ? '#16a34a'
                  : '#dc2626'
            }}>

              +{meuPalpite.pontos} pts

            </div>

          </div>

        )
      }

      {/* DATA */}

      <div style={{
        textAlign: 'center',

        fontSize: 12,

        color: '#666'
      }}>
        {
          new Date(
            partida.data_hora
          ).toLocaleString('pt-BR')
        }
      </div>

    </div>
  )
}