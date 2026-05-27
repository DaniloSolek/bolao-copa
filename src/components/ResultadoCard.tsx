type Props = { partida: any; userId?: string }

export default function ResultadoCard({ partida, userId }: Props) {
  const meuPalpite = partida.palpites?.find((p: any) => p.user_id === userId)

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 14, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
      border: '1px solid var(--border)'
    }}>
      {/* TIMES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, textAlign: 'right', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
          {partida.timeCasa?.nome}
        </div>
        <div style={{ fontWeight: 'bold', fontSize: 18, minWidth: 70, textAlign: 'center', color: 'var(--text-primary)' }}>
          {partida.gols_casa} x {partida.gols_fora}
        </div>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
          {partida.timeFora?.nome}
        </div>
      </div>

      {/* PALPITE */}
      {meuPalpite && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg-input)', borderRadius: 10, padding: '10px 12px', fontSize: 13
        }}>
          <div style={{ color: 'var(--text-primary)' }}>
            Seu palpite: <strong>{meuPalpite.palpite_casa} x {meuPalpite.palpite_fora}</strong>
          </div>
          <div style={{ fontWeight: 'bold', color: meuPalpite.pontos > 0 ? '#4ade80' : '#f87171' }}>
            +{meuPalpite.pontos} pts
          </div>
        </div>
      )}

      {/* DATA */}
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
        {new Date(partida.data_hora).toLocaleString('pt-BR')}
      </div>
    </div>
  )
}