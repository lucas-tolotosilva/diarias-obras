import { describe, expect, it } from 'vitest'
import { calcularFechamento } from './fechamento'
import type { Ajudante, Marcacao, Vale } from '../types'

const ajudante: Ajudante = {
  id: 'aju-1',
  nome: 'Teste da Silva',
  telefone: '(14) 99999-0000',
  valorDiaria: 100,
  obraId: 'obra-1',
}

function marcacao(data: string, tipo: Marcacao['tipo']): Marcacao {
  return { id: `m-${data}`, ajudanteId: 'aju-1', data, tipo }
}

function vale(data: string, valor: number): Vale {
  return { id: `v-${data}`, ajudanteId: 'aju-1', data, valor, observacao: '' }
}

describe('calcularFechamento', () => {
  it('soma diárias inteiras e meias corretamente', () => {
    const marcacoes = [
      marcacao('2026-09-01', 'inteira'),
      marcacao('2026-09-02', 'inteira'),
      marcacao('2026-09-03', 'meia'),
      marcacao('2026-09-04', 'falta'),
    ]
    const resumo = calcularFechamento(ajudante, marcacoes, [], '2026-09-01', '2026-09-30')

    expect(resumo.diasInteiros).toBe(2)
    expect(resumo.diasMeios).toBe(1)
    expect(resumo.faltas).toBe(1)
    expect(resumo.totalDias).toBe(2.5)
    expect(resumo.valorBruto).toBe(250)
  })

  it('desconta vales do valor bruto', () => {
    const marcacoes = [marcacao('2026-09-01', 'inteira'), marcacao('2026-09-02', 'inteira')]
    const vales = [vale('2026-09-01', 50), vale('2026-09-02', 30)]
    const resumo = calcularFechamento(ajudante, marcacoes, vales, '2026-09-01', '2026-09-30')

    expect(resumo.valorBruto).toBe(200)
    expect(resumo.totalVales).toBe(80)
    expect(resumo.valorLiquido).toBe(120)
  })

  it('ignora marcações e vales fora do período', () => {
    const marcacoes = [marcacao('2026-08-31', 'inteira'), marcacao('2026-09-01', 'inteira')]
    const vales = [vale('2026-08-31', 999)]
    const resumo = calcularFechamento(ajudante, marcacoes, vales, '2026-09-01', '2026-09-30')

    expect(resumo.diasInteiros).toBe(1)
    expect(resumo.totalVales).toBe(0)
  })

  it('ignora marcações e vales de outro ajudante', () => {
    const marcacoesOutro: Marcacao[] = [
      { id: 'm-x', ajudanteId: 'aju-2', data: '2026-09-01', tipo: 'inteira' },
    ]
    const resumo = calcularFechamento(ajudante, marcacoesOutro, [], '2026-09-01', '2026-09-30')

    expect(resumo.totalDias).toBe(0)
    expect(resumo.valorBruto).toBe(0)
  })

  it('retorna zero quando não há marcações nem vales', () => {
    const resumo = calcularFechamento(ajudante, [], [], '2026-09-01', '2026-09-30')

    expect(resumo.totalDias).toBe(0)
    expect(resumo.valorBruto).toBe(0)
    expect(resumo.valorLiquido).toBe(0)
  })
})
