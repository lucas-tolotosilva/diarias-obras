/**
 * Implementação local/demonstração do repositório: persiste em localStorage,
 * semeada a partir de samples/dados_demo.json no primeiro acesso. Usada quando
 * o Supabase não está configurado (ver repositorioFactory.ts).
 */
import { dadosDemoSeed } from './seedData'
import type { Ajudante, Marcacao, Obra, TipoMarcacao, Vale } from '../types'
import type { Repositorio } from './repositorio'

const CHAVE = 'diarias-obras:dados'

interface Dataset {
  obras: Obra[]
  ajudantes: Ajudante[]
  marcacoes: Marcacao[]
  vales: Vale[]
}

function carregarDataset(): Dataset {
  const bruto = localStorage.getItem(CHAVE)
  if (bruto) {
    try {
      return JSON.parse(bruto) as Dataset
    } catch {
      // dado corrompido: recria a partir do seed
    }
  }
  const seed = structuredClone(dadosDemoSeed) as Dataset
  salvarDataset(seed)
  return seed
}

function salvarDataset(dataset: Dataset) {
  localStorage.setItem(CHAVE, JSON.stringify(dataset))
}

function gerarId(prefixo: string): string {
  return `${prefixo}-${crypto.randomUUID()}`
}

export class RepositorioLocal implements Repositorio {
  private dataset: Dataset

  constructor() {
    this.dataset = carregarDataset()
  }

  private persistir() {
    salvarDataset(this.dataset)
  }

  async listarObras(): Promise<Obra[]> {
    return [...this.dataset.obras]
  }

  async salvarObra(obra: Omit<Obra, 'id'> & { id?: string }): Promise<Obra> {
    if (obra.id) {
      const indice = this.dataset.obras.findIndex((o) => o.id === obra.id)
      if (indice >= 0) {
        this.dataset.obras[indice] = { ...this.dataset.obras[indice], ...obra, id: obra.id }
        this.persistir()
        return this.dataset.obras[indice]
      }
    }
    const nova: Obra = { ...obra, id: gerarId('obra') }
    this.dataset.obras.push(nova)
    this.persistir()
    return nova
  }

  async listarAjudantes(obraId?: string): Promise<Ajudante[]> {
    const todos = [...this.dataset.ajudantes]
    return obraId ? todos.filter((a) => a.obraId === obraId) : todos
  }

  async salvarAjudante(ajudante: Omit<Ajudante, 'id'> & { id?: string }): Promise<Ajudante> {
    if (ajudante.id) {
      const indice = this.dataset.ajudantes.findIndex((a) => a.id === ajudante.id)
      if (indice >= 0) {
        this.dataset.ajudantes[indice] = { ...this.dataset.ajudantes[indice], ...ajudante, id: ajudante.id }
        this.persistir()
        return this.dataset.ajudantes[indice]
      }
    }
    const novo: Ajudante = { ...ajudante, id: gerarId('aju') }
    this.dataset.ajudantes.push(novo)
    this.persistir()
    return novo
  }

  async listarMarcacoes(ajudanteId?: string): Promise<Marcacao[]> {
    const todas = [...this.dataset.marcacoes]
    return ajudanteId ? todas.filter((m) => m.ajudanteId === ajudanteId) : todas
  }

  async marcarDia(ajudanteId: string, data: string, tipo: TipoMarcacao): Promise<Marcacao> {
    const existente = this.dataset.marcacoes.find(
      (m) => m.ajudanteId === ajudanteId && m.data === data,
    )
    if (existente) {
      existente.tipo = tipo
      this.persistir()
      return existente
    }
    const nova: Marcacao = { id: gerarId('marc'), ajudanteId, data, tipo }
    this.dataset.marcacoes.push(nova)
    this.persistir()
    return nova
  }

  async listarVales(ajudanteId?: string): Promise<Vale[]> {
    const todos = [...this.dataset.vales]
    return ajudanteId ? todos.filter((v) => v.ajudanteId === ajudanteId) : todos
  }

  async lancarVale(vale: Omit<Vale, 'id'>): Promise<Vale> {
    const novo: Vale = { ...vale, id: gerarId('vale') }
    this.dataset.vales.push(novo)
    this.persistir()
    return novo
  }
}
