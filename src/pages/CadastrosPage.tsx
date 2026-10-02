import { useEffect, useState } from 'react'
import type { Ajudante, Obra } from '../types'
import { useObraContext } from '../lib/ObraContext'
import { obterRepositorio } from '../lib/repositorioFactory'
import { formatarMoeda, formatarTelefone } from '../lib/format'

export function CadastrosPage() {
  const [aba, setAba] = useState<'obras' | 'ajudantes'>('obras')

  return (
    <div className="pagina">
      <h1>🏗️ Cadastros</h1>
      <div className="abas">
        <button className={aba === 'obras' ? 'ativo' : ''} onClick={() => setAba('obras')}>
          Obras
        </button>
        <button className={aba === 'ajudantes' ? 'ativo' : ''} onClick={() => setAba('ajudantes')}>
          Ajudantes
        </button>
      </div>

      {aba === 'obras' ? <AbaObras /> : <AbaAjudantes />}
    </div>
  )
}

function AbaObras() {
  const { obras, recarregarObras } = useObraContext()
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return
    setSalvando(true)
    try {
      await obterRepositorio().salvarObra({ nome: nome.trim(), endereco: endereco.trim() || null, ativa: true })
      setNome('')
      setEndereco('')
      await recarregarObras()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <form className="formulario" onSubmit={salvar}>
        <label>
          Nome da obra
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Residencial Vista Alegre" required />
        </label>
        <label>
          Endereço (opcional)
          <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Ex.: Rua das Palmeiras, 450" />
        </label>
        <button className="botao botao-primario botao-grande" type="submit" disabled={salvando}>
          {salvando ? 'Salvando…' : '+ Adicionar Obra'}
        </button>
      </form>

      <div className="lista-cadastro">
        {obras.map((obra: Obra) => (
          <div key={obra.id} className="card-cadastro">
            <strong>{obra.nome}</strong>
            {obra.endereco && <span className="card-cadastro-detalhe">{obra.endereco}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function AbaAjudantes() {
  const { obras, obraSelecionada, obraSelecionadaId, selecionarObra } = useObraContext()
  const [ajudantes, setAjudantes] = useState<Ajudante[]>([])
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [valorDiaria, setValorDiaria] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (obraSelecionadaId) carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obraSelecionadaId])

  async function carregar() {
    if (!obraSelecionadaId) return
    const lista = await obterRepositorio().listarAjudantes(obraSelecionadaId)
    setAjudantes(lista)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const valor = parseFloat(valorDiaria.replace(',', '.'))
    if (!nome.trim() || !telefone.trim() || !valor || !obraSelecionadaId) return
    setSalvando(true)
    try {
      await obterRepositorio().salvarAjudante({
        nome: nome.trim(),
        telefone: telefone.trim(),
        valorDiaria: valor,
        obraId: obraSelecionadaId,
      })
      setNome('')
      setTelefone('')
      setValorDiaria('')
      await carregar()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <label className="campo-isolado">
        Obra
        <select value={obraSelecionadaId ?? ''} onChange={(e) => selecionarObra(e.target.value)}>
          {obras.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nome}
            </option>
          ))}
        </select>
      </label>

      <form className="formulario" onSubmit={salvar}>
        <label>
          Nome
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" required />
        </label>
        <label>
          Telefone
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(14) 99999-9999" required />
        </label>
        <label>
          Valor da diária (R$)
          <input type="text" inputMode="decimal" value={valorDiaria} onChange={(e) => setValorDiaria(e.target.value)} placeholder="Ex.: 140,00" required />
        </label>
        <button className="botao botao-primario botao-grande" type="submit" disabled={salvando || !obraSelecionada}>
          {salvando ? 'Salvando…' : '+ Adicionar Ajudante'}
        </button>
      </form>

      <div className="lista-cadastro">
        {ajudantes.map((ajudante) => (
          <div key={ajudante.id} className="card-cadastro">
            <strong>{ajudante.nome}</strong>
            <span className="card-cadastro-detalhe">
              {formatarTelefone(ajudante.telefone)} · {formatarMoeda(ajudante.valorDiaria)}/diária
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
