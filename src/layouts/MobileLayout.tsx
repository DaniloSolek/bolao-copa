import { useEffect, useState } from 'react'

import {
  Link,
  useLocation
} from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

import { verificarAdmin } from '../services/adminService'

export default function MobileLayout({
  children
}: {
  children: React.ReactNode
}) {

  const [menuAberto, setMenuAberto] =
    useState(false)

  const [isAdmin, setIsAdmin] =
    useState(false)

  const { logout } = useAuth()

  const location = useLocation()

  // =========================
  // ADMIN
  // =========================

  useEffect(() => {

    carregarAdmin()

  }, [])

  async function carregarAdmin() {

    const admin = await verificarAdmin()

    setIsAdmin(admin)
  }

  // =========================
  // LOGOUT
  // =========================

  async function sair() {

    await logout()
  }

  // =========================
  // ACTIVE LINK
  // =========================

  function isActive(path: string) {

    return location.pathname === path
  }

  return (

    <div style={{
      minHeight: '100vh',

      background: '#f3f4f6',

      fontFamily: 'Arial',

      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <header style={{
        height: 60,

        background: '#111827',

        color: 'white',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        padding: '0 16px',

        position: 'sticky',
        top: 0,

        zIndex: 100
      }}>

        {/* MENU BUTTON */}

        <button
          onClick={() => setMenuAberto(true)}
          style={{
            background: 'transparent',

            border: 'none',

            color: 'white',

            fontSize: 26,

            cursor: 'pointer'
          }}
        >
          ☰
        </button>

        {/* TITLE */}

        <h1 style={{
          fontSize: 18,
          margin: 0
        }}>
          Bolão Copa
        </h1>

        {/* RIGHT */}

        <div style={{
          width: 26
        }} />

      </header>

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      {
        menuAberto && (

          <>
            {/* BACKDROP */}

            <div
              onClick={() =>
                setMenuAberto(false)
              }

              style={{
                position: 'fixed',

                inset: 0,

                background:
                  'rgba(0,0,0,0.4)',

                zIndex: 200
              }}
            />

            {/* MENU */}

            <aside style={{
              position: 'fixed',

              top: 0,
              left: 0,

              width: 280,

              height: '100vh',

              background: 'white',

              zIndex: 300,

              padding: 20,

              display: 'flex',
              flexDirection: 'column',

              boxShadow:
                '2px 0 12px rgba(0,0,0,0.15)'
            }}>

              {/* HEADER */}

              <div style={{
                marginBottom: 32
              }}>

                <h2 style={{
                  margin: 0,
                  fontSize: 22
                }}>
                  Menu
                </h2>

              </div>

              {/* LINKS */}

              <nav style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>

                {/* PALPITES */}

                <Link
                  to="/palpites"

                  onClick={() =>
                    setMenuAberto(false)
                  }

                  style={{
                    padding: 14,

                    borderRadius: 10,

                    textDecoration: 'none',

                    color:
                      isActive('/palpites')
                        ? 'white'
                        : '#111827',

                    background:
                      isActive('/palpites')
                        ? '#111827'
                        : 'transparent',

                    fontWeight: 600
                  }}
                >
                  🏆 Palpites
                </Link>

                {/* CLASSIFICAÇÃO */}

                <Link
                  to="/classificacao"

                  onClick={() =>
                    setMenuAberto(false)
                  }

                  style={{
                    padding: 14,

                    borderRadius: 10,

                    textDecoration: 'none',

                    color:
                      isActive('/classificacao')
                        ? 'white'
                        : '#111827',

                    background:
                      isActive('/classificacao')
                        ? '#111827'
                        : 'transparent',

                    fontWeight: 600
                  }}
                >
                  📊 Classificação
                </Link>

                {/* TABELA */}

                <Link
                  to="/tabela"

                  onClick={() =>
                    setMenuAberto(false)
                  }

                  style={{
                    padding: 14,

                    borderRadius: 10,

                    textDecoration: 'none',

                    color:
                      isActive('/tabela')
                        ? 'white'
                        : '#111827',

                    background:
                      isActive('/tabela')
                        ? '#111827'
                        : 'transparent',

                    fontWeight: 600
                  }}
                >
                  ⚽ Tabela
                </Link>

                {/* ADMIN */}

                {
                  isAdmin && (

                    <Link
                      to="/admin"

                      onClick={() =>
                        setMenuAberto(false)
                      }

                      style={{
                        padding: 14,

                        borderRadius: 10,

                        textDecoration: 'none',

                        color:
                          isActive('/admin')
                            ? 'white'
                            : '#111827',

                        background:
                          isActive('/admin')
                            ? '#111827'
                            : 'transparent',

                        fontWeight: 600
                      }}
                    >
                      🛠️ Admin
                    </Link>

                  )
                }

              </nav>

              {/* FOOTER */}

              <div style={{
                marginTop: 'auto'
              }}>

                <button
                  onClick={sair}

                  style={{
                    width: '100%',

                    height: 50,

                    border: 'none',

                    borderRadius: 12,

                    background: '#dc2626',

                    color: 'white',

                    fontSize: 16,
                    fontWeight: 600,

                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>

              </div>

            </aside>
          </>
        )
      }

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <main style={{
        flex: 1,

        padding: 16,

        width: '100%',

        maxWidth: 700,

        margin: '0 auto'
      }}>

        {children}

      </main>

    </div>
  )
}