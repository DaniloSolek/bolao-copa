import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { verificarAdmin } from '../services/adminService'

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { logout } = useAuth()
  const location = useLocation()

  useEffect(() => { carregarAdmin() }, [])

  async function carregarAdmin() {
    const admin = await verificarAdmin()
    setIsAdmin(admin)
  }

  async function sair() { await logout() }

  function isActive(path: string) { return location.pathname === path }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-page)',
      fontFamily: 'Arial',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* HEADER */}
      <header style={{
        height: 60,
        background: '#0f172a',
        borderBottom: '1px solid var(--border)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button onClick={() => setMenuAberto(true)} style={{
          background: 'transparent', border: 'none', color: 'white', fontSize: 26, cursor: 'pointer'
        }}>☰</button>
        <h1 style={{ fontSize: 18, margin: 0, color: 'white' }}>Bolão Resenhudo 2026</h1>
        <div style={{ width: 26 }} />
      </header>

      {/* SIDEBAR */}
      {menuAberto && (
        <>
          <div onClick={() => setMenuAberto(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200
          }} />
          <aside style={{
            position: 'fixed', top: 0, left: 0, width: 280, height: '100vh',
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border)',
            zIndex: 300, padding: 20,
            display: 'flex', flexDirection: 'column',
            boxShadow: '2px 0 12px rgba(0,0,0,0.4)'
          }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ margin: 0, fontSize: 22, color: 'var(--text-primary)' }}>Menu</h2>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/palpites', label: '🏆 Palpites' },
                { to: '/classificacao', label: '📊 Ranking' },
                { to: '/tabela', label: '⚽ Tabela' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setMenuAberto(false)} style={{
                  padding: 14, borderRadius: 10, textDecoration: 'none', fontWeight: 600,
                  color: isActive(to) ? 'white' : 'var(--text-primary)',
                  background: isActive(to) ? '#3b82f6' : 'transparent',
                }}>
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuAberto(false)} style={{
                  padding: 14, borderRadius: 10, textDecoration: 'none', fontWeight: 600,
                  color: isActive('/admin') ? 'white' : 'var(--text-primary)',
                  background: isActive('/admin') ? '#3b82f6' : 'transparent',
                }}>
                  🛠️ Admin
                </Link>
              )}
            </nav>
            <div style={{ marginTop: 'auto', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
              <button onClick={sair} style={{
                width: '100%', height: 50, border: 'none', borderRadius: 12,
                background: '#dc2626', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer'
              }}>Logout</button>
            </div>
          </aside>
        </>
      )}

      {/* MAIN */}
      <main style={{ flex: 1, padding: 16, width: '100%', maxWidth: 700, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}