import type { Ajudante, Marcacao, ResumoFechamento, Vale } from '../types'

export function calcularFechamento(
  ajudante: Ajudante,
  marcacoes: Marcacao[],
  vales: Vale[],
  periodoInicio: string,
  periodoFim: string,
): ResumoFechamento {
  const marcacoesDoAjudante = marcacoes.filter(
    (m) => m.ajudanteId === ajudante.id && m.data >= periodoInicio && m.data <= periodoFim,
  )
  const valesDoAjudante = vales.filter(
    (v) => v.ajudanteId === ajudante.id && v.data >= periodoInicio && v.data <= periodoFim,
  )

  const diasInteiros = marcacoesDoAjudante.filter((m) => m.tipo === 'inteira').length
  const diasMeios = marcacoesDoAjudante.filter((m) => m.tipo === 'meia').length
  const faltas = marcacoesDoAjudante.filter((m) => m.tipo === 'falta').length

  const totalDias = diasInteiros + diasMeios * 0.5
  const valorBruto = round2(totalDias * ajudante.valorDiaria)
  const totalVales = round2(valesDoAjudante.reduce((soma, v) => soma + v.valor, 0))
  const valorLiquido = round2(valorBruto - totalVales)

  return {
    ajudante,
    periodoInicio,
    periodoFim,
    diasInteiros,
    diasMeios,
    faltas,
    totalDias,
    valorBruto,
    totalVales,
    valorLiquido,
    vales: valesDoAjudante,
  }
}

function round2(valor: number): number {
  return Math.round(valor * 100) / 100
}
