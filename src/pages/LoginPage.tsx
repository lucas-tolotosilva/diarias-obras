import { useState } from 'react'
import { useAuthContext } from '../lib/AuthContext'

export function LoginPage() {
  const { entrar } = useAuthContext()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [entrando, setEntrando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setEntrando(true)
    try {
      const { erro: erroLogin } = await entrar(email, senha)
      if (erroLogin) setErro(traduzirErro(erroLogin))
    } finally {
      setEntrando(false)
    }
  }

  return (
    <div className="pagina-login">
      <div className="card-login">
        <div className="card-login-titulo">
          <span className="topbar-icone">👷</span>
          <span>Diárias de Obra</span>
        </div>

        <form className="formulario" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {erro && <div className="alerta alerta-erro">{erro}</div>}

          <button className="botao botao-primario botao-grande" type="submit" disabled={entrando}>
            {entrando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="card-login-rodape">
          Acesso restrito ao encarregado da obra. Peça ao administrador para criar seu usuário no
          Supabase (Authentication → Users).
        </p>
      </div>
    </div>
  )
}

function traduzirErro(mensagem: string): string {
  if (mensagem.toLowerCase().includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.'
  }
  return mensagem
}
