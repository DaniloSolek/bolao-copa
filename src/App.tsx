import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import PalpitesPage from './pages/PalpitesPage'
import RankingPage from './pages/RankingPage'
import TabelaPage from './pages/TabelaPage'
import AdminPage from './pages/AdminPage'

export default function App() {

  const { usuario } = useAuth()

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={
            usuario
              ? <Navigate to="/palpites" />
              : <LoginPage />
          }
        />

        <Route
          path="/palpites"
          element={
            <ProtectedRoute>
              <PalpitesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classificacao"
          element={
            <ProtectedRoute>
              <RankingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tabela"
          element={
            <ProtectedRoute>
              <TabelaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate to="/login" />
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}