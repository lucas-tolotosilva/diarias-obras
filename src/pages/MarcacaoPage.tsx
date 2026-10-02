import { useEffect, useState } from 'react'
import type { Ajudante, Marcacao, TipoMarcacao } from '../types'
import { useObraContext } from '../lib/ObraContext'
import { obterRepositorio } from '../lib/repositorioFactory'
import { formatarDataBr, hojeIso, somarDiasIso } from '../lib/format'

const OPCOES: { tipo: TipoMarcacao; rotulo: string; classe: string }[] = [
  { tipo: 'inteira', rotulo: 'Inteira', classe: 'botao-inteira' },
  { tipo: 'meia', rotulo: 'Meia', classe: 'botao-meia' },
  { tipo: 'falta', rotulo: 'Falta', classe: 'botao-falta' },
]

export function MarcacaoPage() {
  const { obraSelecionada, carregando: carregandoObra } = useObraContext()
  const [data, setData] = useState(hojeIso())
  const [ajudantes, setAjudantes] = useState<Ajudante[]>([])
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!obraSelecionada) return
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obraSelecionada?.id, data])

  async function carregar() {
    if (!obraSelecionada) return
    setCarregando(true)
    try {
      const repo = obterRepositorio()
      const listaAjudantes = await repo.listarAjudantes(obraSelecionada.id)
      const todasMarcacoes = await repo.listarMarcacoes()
      setAjudantes(listaAjudantes)
      setMarcacoes(todasMarcacoes.filter((m) => m.data === data))
    } finally {
      setCarregando(false)
    }
  }

  async function marcar(ajudanteId: string, tipo: TipoMarcacao) {
    const nova = await obterRepositorio().marcarDia(ajudanteId, data, tipo)
    setMarcacoes((atual) => {
      const semEsse = atual.filter((m) => m.ajudanteId !== ajudanteId)
      return [...semEsse, nova]
    })
  }

  function tipoAtual(ajudanteId: string): TipoMarcacao | undefined {
    return marcacoes.find((m) => m.ajudanteId === ajudanteId)?.tipo
  }

  if (carregandoObra) return <p className="estado-vazio">Carregando…</p>
  if (!obraSelecionada) {
    return <p className="estado-vazio">Cadastre uma obra em “Cadastros” para começar.</p>
  }

  return (
    <div className="pagina">
      <h1>✅ Marcação do Dia</h1>

      <div className="seletor-data">
        <button
          type="button"
          className="botao-data"
          onClick={() => setData((d) => somarDiasIso(d, -1))}
          aria-label="Dia anterior"
        >
          ◀
        </button>
        <div className="data-atual">
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          <span>{formatarDataBr(data)}</span>
        </div>
        <button
          type="button"
          className="botao-data"
          onClick={() => setData((d) => somarDiasIso(d, 1))}
          aria-label="Próximo dia"
        >
          ▶
        </button>
      </div>

      {carregando && <p className="estado-vazio">Carregando ajudantes…</p>}
      {!carregando && ajudantes.length === 0 && (
        <p className="estado-vazio">Nenhum ajudante cadastrado nesta obra ainda.</p>
      )}

      <div className="lista-marcacao">
        {ajudantes.map((ajudante) => {
          const atual = tipoAtual(ajudante.id)
          return (
            <div key={ajudante.id} className="card-marcacao">
              <span className="card-marcacao-nome">{ajudante.nome}</span>
              <div className="botoes-marcacao">
                {OPCOES.map((opcao) => (
                  <button
                    key={opcao.tipo}
                    type="button"
                    className={`botao-marcacao ${opcao.classe} ${atual === opcao.tipo ? 'selecionado' : ''}`}
                    onClick={() => marcar(ajudante.id, opcao.tipo)}
                  >
                    {opcao.rotulo}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
