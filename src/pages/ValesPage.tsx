import { useEffect, useState } from 'react'
import type { Ajudante, Vale } from '../types'
import { useObraContext } from '../lib/ObraContext'
import { obterRepositorio } from '../lib/repositorioFactory'
import { formatarDataBr, formatarMoeda, hojeIso } from '../lib/format'

export function ValesPage() {
  const { obraSelecionada } = useObraContext()
  const [ajudantes, setAjudantes] = useState<Ajudante[]>([])
  const [vales, setVales] = useState<Vale[]>([])
  const [ajudanteId, setAjudanteId] = useState('')
  const [data, setData] = useState(hojeIso())
  const [valor, setValor] = useState('')
  const [observacao, setObservacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState<string | null>(null)

  useEffect(() => {
    if (!obraSelecionada) return
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obraSelecionada?.id])

  async function carregar() {
    if (!obraSelecionada) return
    const repo = obterRepositorio()
    const listaAjudantes = await repo.listarAjudantes(obraSelecionada.id)
    setAjudantes(listaAjudantes)
    if (!ajudanteId && listaAjudantes.length > 0) setAjudanteId(listaAjudantes[0].id)

    const todosVales = await repo.listarVales()
    const idsDaObra = new Set(listaAjudantes.map((a) => a.id))
    setVales(
      todosVales
        .filter((v) => idsDaObra.has(v.ajudanteId))
        .sort((a, b) => (a.data < b.data ? 1 : -1)),
    )
  }

  async function lancar(e: React.FormEvent) {
    e.preventDefault()
    const valorNumerico = parseFloat(valor.replace(',', '.'))
    if (!ajudanteId || !valorNumerico || valorNumerico <= 0) return

    setSalvando(true)
    setMensagem(null)
    try {
      await obterRepositorio().lancarVale({ ajudanteId, data, valor: valorNumerico, observacao })
      setValor('')
      setObservacao('')
      setMensagem('✅ Vale lançado com sucesso.')
      await carregar()
    } finally {
      setSalvando(false)
    }
  }

  function nomeAjudante(id: string): string {
    return ajudantes.find((a) => a.id === id)?.nome ?? '—'
  }

  if (!obraSelecionada) {
    return <p className="estado-vazio">Selecione uma obra para lançar vales.</p>
  }

  return (
    <div className="pagina">
      <h1>💵 Lançar Vale</h1>

      <form className="formulario" onSubmit={lancar}>
        <label>
          Ajudante
          <select value={ajudanteId} onChange={(e) => setAjudanteId(e.target.value)} required>
            {ajudantes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
        </label>

        <label>
          Valor (R$)
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 100,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </label>

        <label>
          Observação (opcional)
          <input
            type="text"
            placeholder="Ex.: Vale combustível"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </label>

        <button className="botao botao-primario botao-grande" type="submit" disabled={salvando}>
          {salvando ? 'Salvando…' : '💾 Lançar Vale'}
        </button>
      </form>

      {mensagem && <div className="alerta alerta-sucesso">{mensagem}</div>}

      <h2 className="subtitulo-secao">Vales lançados</h2>
      {vales.length === 0 && <p className="estado-vazio">Nenhum vale lançado ainda.</p>}
      <div className="lista-vales">
        {vales.map((vale) => (
          <div key={vale.id} className="card-vale">
            <div>
              <strong>{nomeAjudante(vale.ajudanteId)}</strong>
              <div className="card-vale-detalhe">
                {formatarDataBr(vale.data)} {vale.observacao && `· ${vale.observacao}`}
              </div>
            </div>
            <span className="card-vale-valor">{formatarMoeda(vale.valor)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
