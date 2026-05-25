import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import { supabase } from '../lib/supabase'

type AuthContextType = {
  usuario: any
  user: any
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
)

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [usuario, setUsuario] = useState<any>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    buscarUsuario()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUsuario(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }

  }, [])

  async function buscarUsuario() {

    const { data } = await supabase.auth.getUser()

    setUsuario(data.user ?? null)

    setLoading(false)
  }

  async function logout() {

    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        user: usuario,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  return useContext(AuthContext)
}