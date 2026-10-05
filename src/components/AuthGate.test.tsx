import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthGate } from './AuthGate'
import * as AuthContextModule from '../lib/AuthContext'

function mockAuthContext(valor: Partial<ReturnType<typeof AuthContextModule.useAuthContext>>) {
  vi.spyOn(AuthContextModule, 'useAuthContext').mockReturnValue({
    autenticacaoDispensada: false,
    carregando: false,
    session: null,
    entrar: vi.fn(),
    sair: vi.fn(),
    ...valor,
  })
}

describe('AuthGate', () => {
  it('libera o conteúdo direto no modo demonstração, mesmo sem sessão', () => {
    mockAuthContext({ autenticacaoDispensada: true, session: null })
    render(
      <AuthGate>
        <div>Conteúdo protegido</div>
      </AuthGate>,
    )
    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
  })

  it('mostra estado de carregamento enquanto verifica a sessão', () => {
    mockAuthContext({ autenticacaoDispensada: false, carregando: true })
    render(
      <AuthGate>
        <div>Conteúdo protegido</div>
      </AuthGate>,
    )
    expect(screen.queryByText('Conteúdo protegido')).not.toBeInTheDocument()
  })

  it('mostra a tela de login quando não há sessão e o Supabase está configurado', () => {
    mockAuthContext({ autenticacaoDispensada: false, carregando: false, session: null })
    render(
      <AuthGate>
        <div>Conteúdo protegido</div>
      </AuthGate>,
    )
    expect(screen.queryByText('Conteúdo protegido')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('libera o conteúdo quando há uma sessão válida', () => {
    mockAuthContext({
      autenticacaoDispensada: false,
      carregando: false,
      session: { access_token: 'token' } as never,
    })
    render(
      <AuthGate>
        <div>Conteúdo protegido</div>
      </AuthGate>,
    )
    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
  })
})
