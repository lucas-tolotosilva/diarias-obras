import type { Repositorio } from './repositorio'
import { RepositorioLocal } from './repositorioLocal'
import { RepositorioSupabase } from './repositorioSupabase'
import { supabaseConfigurado } from './supabaseClient'

export const modoDemonstracao = !supabaseConfigurado

let instancia: Repositorio | null = null

export function obterRepositorio(): Repositorio {
  if (!instancia) {
    instancia = supabaseConfigurado ? new RepositorioSupabase() : new RepositorioLocal()
  }
  return instancia
}
