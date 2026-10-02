import { useEffect, useState } from 'react'
import type { Ajudante, Marcacao, ResumoFechamento, Vale } from '../types'
import { useObraContext } from '../lib/ObraContext'
import { obterRepositorio } from '../lib/repositorioFactory'
import { calcularFechamento } from '../lib/fechamento'
import { formatarDataBr, formatarMoeda, hojeIso, somarDiasIso } from '../lib/format'
import { gerarPdfComprovante, montarLinkWhatsApp, montarTextoComprovante } from '../lib/comprovante'

export function FechamentoPage() {
  const { obraSelecionada } = useObraContext()
  const [ajudantes, setAjudantes] = useState<Ajudante[]>([])
  const [ajudanteId, setAjudanteId] = useState('')
  const [periodoInicio, setPeriodoInicio] = useState(somarDiasIso(hojeIso(), -29))
  const [periodoFim, setPeriodoFim] = useState(hojeIso())
  const [resumo, setResumo] = useState<ResumoFechamento | null>(null)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!obraSelecionada) return
    obterRepositorio()
      .listarAjudantes(obraSelecionada.id)
      .then((lista) => {
        setAjudantes(lista)
        setAjudanteId((atual) => (lista.some((a) => a.id === atual) ? atual : (lista[0]?.id ?? '')))
      })
  }, [obraSelecionada?.id])

  useEffect(() => {
    if (ajudanteId) calcular()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ajudanteId, periodoInicio, periodoFim])

  async function calcular() {
    const ajudante = ajudantes.find((a) => a.id === ajudanteId)
    if (!ajudante) return
    setCarregando(true)
    try {
      const repo = obterRepositorio()
      const marcacoes: Marcacao[] = await repo.listarMarcacoes(ajudanteId)
      const vales: Vale[] = await repo.listarVales(ajudanteId)
      setResumo(calcularFechamento(ajudante, marcacoes, vales, periodoInicio, periodoFim))
    } finally {
      setCarregando(false)
    }
  }

  function compartilharWhatsApp() {
    if (!resumo || !obraSelecionada) return
    window.open(montarLinkWhatsApp(resumo, obraSelecionada), '_blank')
  }

  function baixarPdf() {
    if (!resumo || !obraSelecionada) return
    const doc = gerarPdfComprovante(resumo, obraSelecionada)
    const nomeArquivo = `comprovante_${resumo.ajudante.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`
    doc.save(nomeArquivo)
  }

  if (!obraSelecionada) {
    return <p className="estado-vazio">Selecione uma obra para calcular o fechamento.</p>
  }

  return (
    <div className="pagina">
      <h1>🧾 Fechamento</h1>

      <div className="formulario formulario-linha">
        <label>
          Ajudante
          <select value={ajudanteId} onChange={(e) => setAjudanteId(e.target.value)}>
            {ajudantes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          De
          <input type="date" value={periodoInicio} onChange={(e) => setPeriodoInicio(e.target.value)} />
        </label>
        <label>
          Até
          <input type="date" value={periodoFim} onChange={(e) => setPeriodoFim(e.target.value)} />
        </label>
      </div>

      {carregando && <p className="estado-vazio">Calculando…</p>}

      {resumo && !carregando && (
        <div className="comprovante">
          <h2>{resumo.ajudante.nome}</h2>
          <p className="comprovante-periodo">
            Período: {formatarDataBr(resumo.periodoInicio)} a {formatarDataBr(resumo.periodoFim)}
          </p>

          <div className="comprovante-grid">
            <div className="comprovante-item">
              <span>Dias trabalhados</span>
              <strong>{resumo.totalDias}</strong>
              <small>
                {resumo.diasInteiros} inteira(s) + {resumo.diasMeios} meia(s)
              </small>
            </div>
            <div className="comprovante-item">
              <span>Faltas</span>
              <strong>{resumo.faltas}</strong>
            </div>
            <div className="comprovante-item">
              <span>Valor da diária</span>
              <strong>{formatarMoeda(resumo.ajudante.valorDiaria)}</strong>
            </div>
            <div className="comprovante-item">
              <span>Valor bruto</span>
              <strong>{formatarMoeda(resumo.valorBruto)}</strong>
            </div>
            <div className="comprovante-item">
              <span>Vales descontados</span>
              <strong>{formatarMoeda(resumo.totalVales)}</strong>
            </div>
            <div className="comprovante-item comprovante-destaque">
              <span>Valor líquido</span>
              <strong>{formatarMoeda(resumo.valorLiquido)}</strong>
            </div>
          </div>

          {resumo.vales.length > 0 && (
            <div className="comprovante-vales">
              <h3>Vales no período</h3>
              <ul>
                {resumo.vales.map((v) => (
                  <li key={v.id}>
                    {formatarDataBr(v.data)} — {formatarMoeda(v.valor)}
                    {v.observacao && ` (${v.observacao})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <pre className="comprovante-texto">{montarTextoComprovante(resumo, obraSelecionada)}</pre>

          <div className="comprovante-acoes">
            <button className="botao botao-whatsapp botao-grande" onClick={compartilharWhatsApp}>
              📲 Compartilhar no WhatsApp
            </button>
            <button className="botao botao-secundario botao-grande" onClick={baixarPdf}>
              📄 Baixar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
