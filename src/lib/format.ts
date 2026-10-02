export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarDataBr(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

export function hojeIso(): string {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function somarDiasIso(iso: string, dias: number): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const data = new Date(ano, mes - 1, dia)
  data.setDate(data.getDate() + dias)
  const anoNovo = data.getFullYear()
  const mesNovo = String(data.getMonth() + 1).padStart(2, '0')
  const diaNovo = String(data.getDate()).padStart(2, '0')
  return `${anoNovo}-${mesNovo}-${diaNovo}`
}

export function primeiroDiaDoMesIso(iso: string): string {
  const [ano, mes] = iso.split('-')
  return `${ano}-${mes}-01`
}

export function somenteDigitos(telefone: string): string {
  return telefone.replace(/\D/g, '')
}

export function formatarTelefone(telefone: string): string {
  const digitos = somenteDigitos(telefone)
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`
  }
  return telefone
}
