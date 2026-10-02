import { NavLink, Outlet } from 'react-router-dom'
import { modoDemonstracao } from '../lib/repositorioFactory'
import { useObraContext } from '../lib/ObraContext'

const ITENS_NAV = [
  { to: '/', label: 'Marcação', icone: '✅', fim: true },
  { to: '/vales', label: 'Vales', icone: '💵' },
  { to: '/fechamento', label: 'Fechamento', icone: '🧾' },
  { to: '/cadastros', label: 'Cadastros', icone: '🏗️' },
]

export function Layout() {
  const { obras, obraSelecionadaId, selecionarObra } = useObraContext()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-titulo">
          <span className="topbar-icone">👷</span>
          <span>Diárias de Obra</span>
        </div>
        {obras.length > 0 && (
          <select
            className="seletor-obra"
            value={obraSelecionadaId ?? ''}
            onChange={(e) => selecionarObra(e.target.value)}
            aria-label="Obra selecionada"
          >
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>
                {obra.nome}
              </option>
            ))}
          </select>
        )}
      </header>

      {modoDemonstracao && (
        <div className="banner-demo">
          🧪 Modo demonstração — dados salvos somente neste dispositivo. Configure o Supabase para
          sincronizar entre dispositivos e múltiplos usuários.
        </div>
      )}

      <main className="conteudo">
        <Outlet />
      </main>

      <nav className="nav-inferior">
        {ITENS_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.fim}
            className={({ isActive }) => `nav-item ${isActive ? 'ativo' : ''}`}
          >
            <span className="nav-item-icone">{item.icone}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
