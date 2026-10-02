import { jsPDF } from 'jspdf'
import type { Obra, ResumoFechamento } from '../types'
import { formatarDataBr, formatarMoeda, somenteDigitos } from './format'

export function montarTextoComprovante(resumo: ResumoFechamento, obra: Obra): string {
  const linhas = [
    '*Comprovante de Pagamento*',
    '',
    `Obra: ${obra.nome}`,
    `Ajudante: ${resumo.ajudante.nome}`,
    `Período: ${formatarDataBr(resumo.periodoInicio)} a ${formatarDataBr(resumo.periodoFim)}`,
    '',
    `Dias trabalhados: ${resumo.totalDias} (${resumo.diasInteiros} inteira(s) + ${resumo.diasMeios} meia(s))`,
    `Faltas: ${resumo.faltas}`,
    `Valor da diária: ${formatarMoeda(resumo.ajudante.valorDiaria)}`,
    `Valor bruto: ${formatarMoeda(resumo.valorBruto)}`,
    `Vales descontados: ${formatarMoeda(resumo.totalVales)}`,
    '',
    `*Valor líquido a receber: ${formatarMoeda(resumo.valorLiquido)}*`,
  ]
  return linhas.join('\n')
}

export function montarLinkWhatsApp(resumo: ResumoFechamento, obra: Obra): string {
  const texto = montarTextoComprovante(resumo, obra)
  const telefone = somenteDigitos(resumo.ajudante.telefone)
  const prefixo = telefone.length <= 11 ? '55' : ''
  return `https://wa.me/${prefixo}${telefone}?text=${encodeURIComponent(texto)}`
}

export function gerarPdfComprovante(resumo: ResumoFechamento, obra: Obra): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  const margemEsquerda = 15
  let y = 20

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Comprovante de Pagamento', margemEsquerda, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const campos: [string, string][] = [
    ['Obra', obra.nome],
    ['Ajudante', resumo.ajudante.nome],
    ['Período', `${formatarDataBr(resumo.periodoInicio)} a ${formatarDataBr(resumo.periodoFim)}`],
    ['Dias trabalhados', `${resumo.totalDias} (${resumo.diasInteiros} inteira(s) + ${resumo.diasMeios} meia(s))`],
    ['Faltas', String(resumo.faltas)],
    ['Valor da diária', formatarMoeda(resumo.ajudante.valorDiaria)],
    ['Valor bruto', formatarMoeda(resumo.valorBruto)],
    ['Vales descontados', formatarMoeda(resumo.totalVales)],
  ]

  for (const [rotulo, valor] of campos) {
    doc.text(`${rotulo}:`, margemEsquerda, y)
    doc.text(valor, margemEsquerda + 45, y)
    y += 8
  }

  y += 4
  doc.setDrawColor(47, 95, 138)
  doc.line(margemEsquerda, y, 148 - margemEsquerda, y)
  y += 10

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`Valor líquido a receber: ${formatarMoeda(resumo.valorLiquido)}`, margemEsquerda, y)

  return doc
}
