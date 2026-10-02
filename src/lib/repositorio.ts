import type { Ajudante, Marcacao, Obra, TipoMarcacao, Vale } from '../types'

export interface Repositorio {
  listarObras(): Promise<Obra[]>
  salvarObra(obra: Omit<Obra, 'id'> & { id?: string }): Promise<Obra>

  listarAjudantes(obraId?: string): Promise<Ajudante[]>
  salvarAjudante(ajudante: Omit<Ajudante, 'id'> & { id?: string }): Promise<Ajudante>

  listarMarcacoes(ajudanteId?: string): Promise<Marcacao[]>
  marcarDia(ajudanteId: string, data: string, tipo: TipoMarcacao): Promise<Marcacao>

  listarVales(ajudanteId?: string): Promise<Vale[]>
  lancarVale(vale: Omit<Vale, 'id'>): Promise<Vale>
}
