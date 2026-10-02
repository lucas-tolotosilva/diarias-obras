/**
 * Implementação real do repositório usando Supabase (Postgres + auth).
 * Esperada para produção, quando VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * estiverem configuradas. Tabelas esperadas: obras, ajudantes, marcacoes, vales
 * (ver schema sugerido em supabase/schema.sql).
 */
import type { Ajudante, Marcacao, Obra, TipoMarcacao, Vale } from '../types'
import type { Repositorio } from './repositorio'
import { supabase } from './supabaseClient'

function clienteOuErro() {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
  }
  return supabase
}

export class RepositorioSupabase implements Repositorio {
  async listarObras(): Promise<Obra[]> {
    const { data, error } = await clienteOuErro().from('obras').select('*').order('nome')
    if (error) throw error
    return (data ?? []).map((linha) => ({
      id: linha.id,
      nome: linha.nome,
      endereco: linha.endereco,
      ativa: linha.ativa,
    }))
  }

  async salvarObra(obra: Omit<Obra, 'id'> & { id?: string }): Promise<Obra> {
    const payload = { nome: obra.nome, endereco: obra.endereco, ativa: obra.ativa }
    const query = obra.id
      ? clienteOuErro().from('obras').update(payload).eq('id', obra.id).select().single()
      : clienteOuErro().from('obras').insert(payload).select().single()
    const { data, error } = await query
    if (error) throw error
    return { id: data.id, nome: data.nome, endereco: data.endereco, ativa: data.ativa }
  }

  async listarAjudantes(obraId?: string): Promise<Ajudante[]> {
    let query = clienteOuErro().from('ajudantes').select('*').order('nome')
    if (obraId) query = query.eq('obra_id', obraId)
    const { data, error } = await query
    if (error) throw error
    return (data ?? []).map((linha) => ({
      id: linha.id,
      nome: linha.nome,
      telefone: linha.telefone,
      valorDiaria: linha.valor_diaria,
      obraId: linha.obra_id,
    }))
  }

  async salvarAjudante(ajudante: Omit<Ajudante, 'id'> & { id?: string }): Promise<Ajudante> {
    const payload = {
      nome: ajudante.nome,
      telefone: ajudante.telefone,
      valor_diaria: ajudante.valorDiaria,
      obra_id: ajudante.obraId,
    }
    const query = ajudante.id
      ? clienteOuErro().from('ajudantes').update(payload).eq('id', ajudante.id).select().single()
      : clienteOuErro().from('ajudantes').insert(payload).select().single()
    const { data, error } = await query
    if (error) throw error
    return {
      id: data.id,
      nome: data.nome,
      telefone: data.telefone,
      valorDiaria: data.valor_diaria,
      obraId: data.obra_id,
    }
  }

  async listarMarcacoes(ajudanteId?: string): Promise<Marcacao[]> {
    let query = clienteOuErro().from('marcacoes').select('*')
    if (ajudanteId) query = query.eq('ajudante_id', ajudanteId)
    const { data, error } = await query
    if (error) throw error
    return (data ?? []).map((linha) => ({
      id: linha.id,
      ajudanteId: linha.ajudante_id,
      data: linha.data,
      tipo: linha.tipo,
    }))
  }

  async marcarDia(ajudanteId: string, data: string, tipo: TipoMarcacao): Promise<Marcacao> {
    const { data: linha, error } = await clienteOuErro()
      .from('marcacoes')
      .upsert({ ajudante_id: ajudanteId, data, tipo }, { onConflict: 'ajudante_id,data' })
      .select()
      .single()
    if (error) throw error
    return { id: linha.id, ajudanteId: linha.ajudante_id, data: linha.data, tipo: linha.tipo }
  }

  async listarVales(ajudanteId?: string): Promise<Vale[]> {
    let query = clienteOuErro().from('vales').select('*')
    if (ajudanteId) query = query.eq('ajudante_id', ajudanteId)
    const { data, error } = await query
    if (error) throw error
    return (data ?? []).map((linha) => ({
      id: linha.id,
      ajudanteId: linha.ajudante_id,
      data: linha.data,
      valor: linha.valor,
      observacao: linha.observacao,
    }))
  }

  async lancarVale(vale: Omit<Vale, 'id'>): Promise<Vale> {
    const { data, error } = await clienteOuErro()
      .from('vales')
      .insert({
        ajudante_id: vale.ajudanteId,
        data: vale.data,
        valor: vale.valor,
        observacao: vale.observacao,
      })
      .select()
      .single()
    if (error) throw error
    return {
      id: data.id,
      ajudanteId: data.ajudante_id,
      data: data.data,
      valor: data.valor,
      observacao: data.observacao,
    }
  }
}
