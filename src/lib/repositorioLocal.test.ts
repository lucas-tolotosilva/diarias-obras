import { beforeEach, describe, expect, it } from 'vitest'
import { RepositorioLocal } from './repositorioLocal'

beforeEach(() => {
  localStorage.clear()
})

describe('RepositorioLocal', () => {
  it('semeia dados de demonstração no primeiro acesso', async () => {
    const repo = new RepositorioLocal()
    const obras = await repo.listarObras()
    const ajudantes = await repo.listarAjudantes()

    expect(obras.length).toBeGreaterThan(0)
    expect(ajudantes.length).toBeGreaterThan(0)
  })

  it('persiste uma nova obra entre instâncias', async () => {
    const repo1 = new RepositorioLocal()
    await repo1.salvarObra({ nome: 'Obra Nova', endereco: null, ativa: true })

    const repo2 = new RepositorioLocal()
    const obras = await repo2.listarObras()
    expect(obras.some((o) => o.nome === 'Obra Nova')).toBe(true)
  })

  it('marcarDia cria uma marcação quando não existe', async () => {
    const repo = new RepositorioLocal()
    const [ajudante] = await repo.listarAjudantes()

    const marcacao = await repo.marcarDia(ajudante.id, '2026-12-01', 'inteira')
    expect(marcacao.tipo).toBe('inteira')

    const marcacoes = await repo.listarMarcacoes(ajudante.id)
    expect(marcacoes.filter((m) => m.data === '2026-12-01')).toHaveLength(1)
  })

  it('marcarDia atualiza a marcação existente em vez de duplicar', async () => {
    const repo = new RepositorioLocal()
    const [ajudante] = await repo.listarAjudantes()

    await repo.marcarDia(ajudante.id, '2026-12-01', 'inteira')
    await repo.marcarDia(ajudante.id, '2026-12-01', 'falta')

    const marcacoes = await repo.listarMarcacoes(ajudante.id)
    const doDia = marcacoes.filter((m) => m.data === '2026-12-01')
    expect(doDia).toHaveLength(1)
    expect(doDia[0].tipo).toBe('falta')
  })

  it('lancarVale adiciona um novo vale', async () => {
    const repo = new RepositorioLocal()
    const [ajudante] = await repo.listarAjudantes()
    const valesAntes = await repo.listarVales(ajudante.id)

    await repo.lancarVale({ ajudanteId: ajudante.id, data: '2026-12-01', valor: 75, observacao: 'teste' })

    const valesDepois = await repo.listarVales(ajudante.id)
    expect(valesDepois.length).toBe(valesAntes.length + 1)
  })

  it('listarAjudantes filtra por obra', async () => {
    const repo = new RepositorioLocal()
    const obras = await repo.listarObras()
    const ajudantesDaPrimeiraObra = await repo.listarAjudantes(obras[0].id)

    expect(ajudantesDaPrimeiraObra.every((a) => a.obraId === obras[0].id)).toBe(true)
  })
})
