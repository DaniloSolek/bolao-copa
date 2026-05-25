import { useState } from 'react'

import { supabase } from '../lib/supabase'

export default function LoginPage() {

  const [isCadastro, setIsCadastro] = useState(false)

  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  async function cadastrar() {

    const fakeEmail = `${username}@bolao.local`

    const { error } = await supabase.auth.signUp({
      email: fakeEmail,
      password: senha,

      options: {
        data: {
          username
        }
      }
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Conta criada!')

    setIsCadastro(false)
  }

  async function login() {

    const fakeEmail = `${username}@bolao.local`

    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password: senha
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Login realizado!')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      fontFamily: 'Arial'
    }}>

      <div style={{
        width: '100%',
        maxWidth: 350,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>

        <h1>
          {isCadastro ? 'Criar Conta' : 'Login'}
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: 12,
            fontSize: 16
          }}
        />

        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            padding: 12,
            fontSize: 16
          }}
        />

        {
          isCadastro ? (
            <>
              <button
                onClick={cadastrar}
                style={{
                  padding: 12
                }}
              >
                Cadastrar
              </button>

              <button
                onClick={() => setIsCadastro(false)}
                style={{
                  padding: 12
                }}
              >
                Já tenho conta
              </button>
            </>
          ) : (
            <>
              <button
                onClick={login}
                style={{
                  padding: 12
                }}
              >
                Entrar
              </button>

              <button
                onClick={() => setIsCadastro(true)}
                style={{
                  padding: 12
                }}
              >
                Criar conta
              </button>
            </>
          )
        }

      </div>

    </div>
  )
}