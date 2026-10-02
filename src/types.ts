export interface Obra {
  id: string
  nome: string
  endereco: string | null
  ativa: boolean
}

export interface Ajudante {
  id: string
  nome: string
  telefone: string
  valorDiaria: number
  obraId: string
}

export type TipoMarcacao = 'inteira' | 'meia' | 'falta'

export interface Marcacao {
  id: string
  ajudanteId: string
  data: string // YYYY-MM-DD
  tipo: TipoMarcacao
}

export interface Vale {
  id: string
  ajudanteId: string
  data: string // YYYY-MM-DD
  valor: number
  observacao: string
}

export interface ResumoFechamento {
  ajudante: Ajudante
  periodoInicio: string
  periodoFim: string
  diasInteiros: number
  diasMeios: number
  faltas: number
  totalDias: number
  valorBruto: number
  totalVales: number
  valorLiquido: number
  vales: Vale[]
}
