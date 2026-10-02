import { describe, expect, it } from 'vitest'
import { formatarDataBr, formatarMoeda, formatarTelefone, somarDiasIso } from './format'

function semEspacosEspeciais(texto: string): string {
  return texto.replace(/ /g, ' ')
}

describe('formatarMoeda', () => {
  it('formata número como moeda brasileira', () => {
    expect(semEspacosEspeciais(formatarMoeda(1234.5))).toBe('R$ 1.234,50')
  })
})

describe('formatarDataBr', () => {
  it('converte data ISO para dd/mm/aaaa', () => {
    expect(formatarDataBr('2026-09-05')).toBe('05/09/2026')
  })
})

describe('somarDiasIso', () => {
  it('soma dias dentro do mesmo mês', () => {
    expect(somarDiasIso('2026-09-01', 4)).toBe('2026-09-05')
  })

  it('soma dias atravessando o fim do mês', () => {
    expect(somarDiasIso('2026-09-29', 3)).toBe('2026-10-02')
  })

  it('subtrai dias corretamente', () => {
    expect(somarDiasIso('2026-09-01', -1)).toBe('2026-08-31')
  })
})

describe('formatarTelefone', () => {
  it('formata celular com 11 dígitos', () => {
    expect(formatarTelefone('14999887766')).toBe('(14) 99988-7766')
  })

  it('formata fixo com 10 dígitos', () => {
    expect(formatarTelefone('1433221100')).toBe('(14) 3322-1100')
  })

  it('mantém o valor original quando não reconhece o formato', () => {
    expect(formatarTelefone('123')).toBe('123')
  })
})
