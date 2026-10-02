// Gera o dataset fictício de demonstração em /samples/dados_demo.json.
// Esse mesmo arquivo é carregado pelo app (modo local/demonstração) na primeira execução.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SAIDA_JSON = join(__dirname, '..', 'samples', 'dados_demo.json')
const SAIDA_TS = join(__dirname, '..', 'src', 'lib', 'seedData.ts')

// PRNG determinístico (mulberry32) para o dataset ser sempre o mesmo entre execuções.
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const aleatorio = mulberry32(42)

const PERIODO_INICIO = '2026-09-01'
const PERIODO_FIM = '2026-09-20'

function listarDatas(inicio, fim) {
  const datas = []
  let [ano, mes, dia] = inicio.split('-').map(Number)
  const dataFim = fim
  while (true) {
    const iso = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    datas.push(iso)
    if (iso === dataFim) break
    const d = new Date(ano, mes - 1, dia + 1)
    ano = d.getFullYear()
    mes = d.getMonth() + 1
    dia = d.getDate()
  }
  return datas
}

const obras = [
  { id: 'obra-1', nome: 'Residencial Vista Alegre', endereco: 'Rua das Palmeiras, 450 - Botucatu/SP', ativa: true },
  { id: 'obra-2', nome: 'Galpão Industrial Santa Fé', endereco: 'Av. Industrial, 1200 - Botucatu/SP', ativa: true },
]

const ajudantes = [
  { id: 'aju-1', nome: 'João da Silva', telefone: '(14) 99988-7766', valorDiaria: 140, obraId: 'obra-1' },
  { id: 'aju-2', nome: 'Pedro Henrique Souza', telefone: '(14) 99877-6655', valorDiaria: 150, obraId: 'obra-1' },
  { id: 'aju-3', nome: 'Marcos Antônio Lima', telefone: '(14) 99766-5544', valorDiaria: 130, obraId: 'obra-1' },
  { id: 'aju-4', nome: 'Antônio Carlos Ferreira', telefone: '(14) 99655-4433', valorDiaria: 160, obraId: 'obra-2' },
  { id: 'aju-5', nome: 'José Roberto Santos', telefone: '(14) 99544-3322', valorDiaria: 145, obraId: 'obra-2' },
  { id: 'aju-6', nome: 'Francisco das Chagas Oliveira', telefone: '(14) 99433-2211', valorDiaria: 135, obraId: 'obra-2' },
]

const datas = listarDatas(PERIODO_INICIO, PERIODO_FIM)

function sortearTipo() {
  const r = aleatorio()
  if (r < 0.72) return 'inteira'
  if (r < 0.87) return 'meia'
  return 'falta'
}

const marcacoes = []
let contadorMarcacao = 1
for (const ajudante of ajudantes) {
  for (const data of datas) {
    marcacoes.push({
      id: `marc-${contadorMarcacao++}`,
      ajudanteId: ajudante.id,
      data,
      tipo: sortearTipo(),
    })
  }
}

const vales = []
let contadorVale = 1
for (const ajudante of ajudantes) {
  const quantidadeVales = 1 + Math.floor(aleatorio() * 2) // 1 ou 2 vales
  for (let i = 0; i < quantidadeVales; i++) {
    const data = datas[Math.floor(aleatorio() * datas.length)]
    const valor = Math.round((50 + aleatorio() * 150) * 100) / 100
    vales.push({
      id: `vale-${contadorVale++}`,
      ajudanteId: ajudante.id,
      data,
      valor,
      observacao: i === 0 ? 'Vale combustível/alimentação' : 'Adiantamento',
    })
  }
}

const dataset = { obras, ajudantes, marcacoes, vales }
const json = JSON.stringify(dataset, null, 2)

writeFileSync(SAIDA_JSON, json + '\n', 'utf-8')

const conteudoTs = `// Arquivo GERADO por scripts/gerar_dados_demo.mjs — não editar manualmente.
// Dataset idêntico ao de samples/dados_demo.json, importado diretamente pelo
// RepositorioLocal (modo demonstração) para evitar problemas de resolução de
// módulos JSON fora da pasta src/ no build do TypeScript.
import type { Ajudante, Marcacao, Obra, Vale } from '../types'

export const dadosDemoSeed: { obras: Obra[]; ajudantes: Ajudante[]; marcacoes: Marcacao[]; vales: Vale[] } = ${json}
`
writeFileSync(SAIDA_TS, conteudoTs, 'utf-8')

console.log(`Gerado ${SAIDA_JSON}`)
console.log(`Gerado ${SAIDA_TS}`)
console.log(`${obras.length} obras, ${ajudantes.length} ajudantes, ${marcacoes.length} marcações, ${vales.length} vales`)
