import { describe, expect, it } from 'vitest'
import { montarLinkWhatsApp, montarTextoComprovante } from './comprovante'
import type { Ajudante, Obra, ResumoFechamento } from '../types'

const obra: Obra = { id: 'obra-1', nome: 'Obra Teste', endereco: null, ativa: true }
const ajudante: Ajudante = {
  id: 'aju-1',
  nome: 'Carlos Teste',
  telefone: '(14) 99988-7766',
  valorDiaria: 140,
  obraId: 'obra-1',
}

const resumo: ResumoFechamento = {
  ajudante,
  periodoInicio: '2026-09-01',
  periodoFim: '2026-09-20',
  diasInteiros: 10,
  diasMeios: 2,
  faltas: 1,
  totalDias: 11,
  valorBruto: 1540,
  totalVales: 200,
  valorLiquido: 1340,
  vales: [],
}

describe('montarTextoComprovante', () => {
  it('inclui os principais dados do fechamento', () => {
    const texto = montarTextoComprovante(resumo, obra)
    expect(texto).toContain('Obra Teste')
    expect(texto).toContain('Carlos Teste')
    expect(texto.replace(/ /g, ' ')).toContain('R$ 1.340,00')
    expect(texto).toContain('11')
  })
})

describe('montarLinkWhatsApp', () => {
  it('gera link wa.me com telefone limpo e prefixo 55', () => {
    const link = montarLinkWhatsApp(resumo, obra)
    expect(link).toMatch(/^https:\/\/wa\.me\/5514999887766\?text=/)
  })
})
