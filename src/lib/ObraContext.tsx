import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Obra } from '../types'
import { obterRepositorio } from './repositorioFactory'

const CHAVE_OBRA_SELECIONADA = 'diarias-obras:obra-selecionada'

interface ObraContextValor {
  obras: Obra[]
  carregando: boolean
  obraSelecionadaId: string | null
  obraSelecionada: Obra | null
  selecionarObra: (id: string) => void
  recarregarObras: () => Promise<void>
}

const ObraContext = createContext<ObraContextValor | null>(null)

export function ObraProvider({ children }: { children: ReactNode }) {
  const [obras, setObras] = useState<Obra[]>([])
  const [carregando, setCarregando] = useState(true)
  const [obraSelecionadaId, setObraSelecionadaId] = useState<string | null>(
    () => localStorage.getItem(CHAVE_OBRA_SELECIONADA),
  )

  async function recarregarObras() {
    setCarregando(true)
    try {
      const lista = await obterRepositorio().listarObras()
      setObras(lista)
      setObraSelecionadaId((atual) => {
        if (atual && lista.some((o) => o.id === atual)) return atual
        return lista[0]?.id ?? null
      })
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    recarregarObras()
  }, [])

  function selecionarObra(id: string) {
    setObraSelecionadaId(id)
    localStorage.setItem(CHAVE_OBRA_SELECIONADA, id)
  }

  const obraSelecionada = obras.find((o) => o.id === obraSelecionadaId) ?? null

  return (
    <ObraContext.Provider
      value={{ obras, carregando, obraSelecionadaId, obraSelecionada, selecionarObra, recarregarObras }}
    >
      {children}
    </ObraContext.Provider>
  )
}

export function useObraContext() {
  const contexto = useContext(ObraContext)
  if (!contexto) throw new Error('useObraContext deve ser usado dentro de ObraProvider')
  return contexto
}
