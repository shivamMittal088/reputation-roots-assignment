import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from './state/useAuth'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import Header from './ui/Header'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, authReady } = useAuth()

  if (!authReady) {
    return <div className="p-6 text-center text-slate-500">Loading...</div>
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className={`min-h-screen text-slate-900 ${isLoginPage ? 'bg-black' : 'bg-linear-to-br from-slate-50 via-stone-50 to-zinc-100'}`}>
      {!isLoginPage && (
        <>
          <div className="pointer-events-none fixed inset-0">
            <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
            <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-linear-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-linear-to-tr from-cyan-400/10 to-blue-400/10 blur-3xl" />
          </div>
          <Header />
        </>
      )}
      <main className={`relative mx-auto ${isLoginPage ? '' : 'min-h-[calc(100vh-5rem)] max-w-6xl px-4 py-6 pb-8 sm:min-h-0 sm:px-6 lg:px-8'}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
