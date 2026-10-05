import type { ReactNode } from 'react'
import { useAuthContext } from '../lib/AuthContext'
import { LoginPage } from '../pages/LoginPage'

/**
 * Bloqueia o acesso ao app até haver uma sessão Supabase válida.
 * No modo demonstração (sem Supabase configurado) deixa passar direto.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { autenticacaoDispensada, carregando, session } = useAuthContext()

  if (autenticacaoDispensada) return <>{children}</>
  if (carregando) return <div className="estado-vazio">Carregando…</div>
  if (!session) return <LoginPage />

  return <>{children}</>
}
