import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigurado } from './supabaseClient'

interface AuthContextValor {
  /** Quando true, o app roda no modo local/demonstração e nenhum login é exigido. */
  autenticacaoDispensada: boolean
  carregando: boolean
  session: Session | null
  entrar: (email: string, senha: string) => Promise<{ erro: string | null }>
  sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextValor | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [carregando, setCarregando] = useState(supabaseConfigurado)

  useEffect(() => {
    if (!supabaseConfigurado || !supabase) {
      setCarregando(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCarregando(false)
    })

    const { data: assinatura } = supabase.auth.onAuthStateChange((_evento, novaSession) => {
      setSession(novaSession)
    })

    return () => assinatura.subscription.unsubscribe()
  }, [])

  async function entrar(email: string, senha: string): Promise<{ erro: string | null }> {
    if (!supabase) return { erro: 'Supabase não está configurado.' }
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    return { erro: error?.message ?? null }
  }

  async function sair() {
    await supabase?.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ autenticacaoDispensada: !supabaseConfigurado, carregando, session, entrar, sair }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  return contexto
}
