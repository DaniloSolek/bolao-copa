import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [isCadastro, setIsCadastro] = useState(false)
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  async function cadastrar() {
    const fakeEmail = `${username}@bolao.local`
    const { error } = await supabase.auth.signUp({
      email: fakeEmail, password: senha,
      options: { data: { username } }
    })
    if (error) { alert(error.message); return }
    alert('Conta criada!')
    setIsCadastro(false)
  }

  async function login() {
    const fakeEmail = `${username}@bolao.local`
    const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password: senha })
    if (error) { alert(error.message); return }
  }

  const inputStyle = {
    padding: 14, fontSize: 16, borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text-primary)',
    width: '100%', boxSizing: 'border-box' as const
  }

  const btnPrimary = {
    padding: 14, fontSize: 16, fontWeight: 'bold' as const,
    border: 'none', borderRadius: 10, cursor: 'pointer',
    background: '#3b82f6', color: 'white', width: '100%'
  }

  const btnSecondary = {
    padding: 14, fontSize: 16,
    border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
    background: 'transparent', color: 'var(--text-secondary)', width: '100%'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: 20, background: 'var(--bg-page)'
    }}>
      <div style={{ width: '100%', maxWidth: 350, display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>Bolão Resenhudo 2026</h1>
        </div>

        <input placeholder="Usuário" value={username}
          onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

        <input placeholder="Senha" type="password" value={senha}
          onChange={(e) => setSenha(e.target.value)} style={inputStyle} />

        {isCadastro ? (
          <>
            <button onClick={cadastrar} style={btnPrimary}>Criar</button>
            <button onClick={() => setIsCadastro(false)} style={btnSecondary}>Já sou usuário</button>
          </>
        ) : (
          <>
            <button onClick={login} style={btnPrimary}>Entrar</button>
            <button onClick={() => setIsCadastro(true)} style={btnSecondary}>Criar usuário</button>
          </>
        )}
      </div>
    </div>
  )
}