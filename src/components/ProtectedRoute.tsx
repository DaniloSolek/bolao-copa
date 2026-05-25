import { Navigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {

  const {
    usuario,
    loading
  } = useAuth()

  if (loading) {
    return <h1>Carregando...</h1>
  }

  if (!usuario) {
    return <Navigate to="/login" />
  }

  return children
}