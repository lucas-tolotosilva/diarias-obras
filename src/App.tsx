import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { MarcacaoPage } from './pages/MarcacaoPage'
import { ValesPage } from './pages/ValesPage'
import { FechamentoPage } from './pages/FechamentoPage'
import { CadastrosPage } from './pages/CadastrosPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MarcacaoPage />} />
        <Route path="/vales" element={<ValesPage />} />
        <Route path="/fechamento" element={<FechamentoPage />} />
        <Route path="/cadastros" element={<CadastrosPage />} />
      </Route>
    </Routes>
  )
}

export default App
