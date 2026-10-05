# Diárias de Obra

## Problema de negócio

Encarregados de obra costumam controlar a presença e o pagamento de ajudantes
(diaristas) em papel ou em anotações soltas no celular: quem trabalhou, quem
faltou, quantos vales cada um já pegou e quanto falta pagar no fim da semana ou
do mês. Esse controle manual é fácil de perder, difícil de conferir e gera
atrito na hora do pagamento ("quanto eu já peguei de vale mesmo?").

Este aplicativo resolve isso com uma interface pensada para uso em campo, sob
sol, com uma mão só: botões grandes para marcar presença (diária inteira, meia
ou falta), lançamento rápido de vales e um fechamento automático que já calcula
o valor líquido a pagar e gera um comprovante pronto para enviar por WhatsApp
ou baixar em PDF.

## Funcionalidades

- **Cadastro de obras** e **ajudantes** (nome, telefone, valor da diária).
- **Marcação diária** com botões grandes (Inteira / Meia / Falta) por ajudante,
  com navegação rápida entre dias.
- **Lançamento de vales** (adiantamentos) por ajudante, com histórico.
- **Fechamento automático** por período: dias trabalhados × valor da diária,
  menos os vales — com resumo visual e o texto do comprovante já formatado.
- **Compartilhamento no WhatsApp** (link direto `wa.me` para o telefone do
  ajudante) e **exportação em PDF** do comprovante.
- **PWA instalável**: pode ser adicionado à tela inicial do celular e usado
  como um app nativo, inclusive offline após o primeiro carregamento.
- **Alto contraste e fontes grandes**, pensado para uso ao ar livre, com poucos
  toques por ação.
- **Modo demonstração**: funciona 100% localmente (dados salvos no navegador),
  sem precisar configurar nada — nenhum login é exigido nesse modo. Pronto para
  produção com **Supabase** (autenticação real por e-mail/senha + banco
  Postgres) quando as credenciais forem configuradas: nesse caso o app passa a
  exigir login antes de liberar o acesso.

## Stack

- React + TypeScript + Vite
- `vite-plugin-pwa` (manifest + service worker)
- Supabase (`@supabase/supabase-js`) — opcional, com fallback local automático
- jsPDF (geração do comprovante em PDF)
- React Router
- Vitest + Testing Library

## Como rodar localmente

```bash
npm install

# (Opcional) regenerar o dataset fictício de demonstração
npm run seed

# Rodar os testes
npm run test

# Subir o app em modo demonstração (sem Supabase)
npm run dev
```

Abra o endereço exibido pelo Vite no navegador — de preferência no modo de
emulação de dispositivo móvel do DevTools, já que a interface é mobile-first.
Sem nenhuma configuração adicional, o app já sobe com obras, ajudantes,
marcações e vales fictícios pré-carregados.

### Usando o Supabase real (produção)

1. Crie um projeto em [supabase.com](https://supabase.com) e rode o script em
   `supabase/schema.sql` no SQL Editor do projeto.
2. Copie `.env.example` para `.env` e preencha:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```
3. Crie o usuário do encarregado em **Authentication → Users → Add user** no
   painel do Supabase (e-mail + senha). Não há autocadastro pelo app — o login
   é restrito a usuários criados manualmente.
4. Suba o app normalmente (`npm run dev`); com as variáveis de `.env` definidas,
   o app passa a exigir login (Supabase Auth) e usa o banco real em vez do
   armazenamento local automaticamente.

## Deploy (demo ao vivo)

[Vercel](https://vercel.com), free tier — como é 100% estático e já tem modo
demonstração embutido (sem backend obrigatório), o deploy é só conectar o repo.
O `vercel.json` cuida do rewrite de rotas do React Router. Para rodar contra o
Supabase real em produção em vez do modo demonstração, defina
`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas variáveis de ambiente do
projeto na Vercel.

## Estrutura do projeto

```
diarias-obras/
├── src/
│   ├── lib/
│   │   ├── repositorio.ts          # Interface comum de acesso a dados
│   │   ├── repositorioLocal.ts     # Implementação local/demo (localStorage)
│   │   ├── repositorioSupabase.ts  # Implementação real (Supabase)
│   │   ├── repositorioFactory.ts   # Escolhe a implementação automaticamente
│   │   ├── seedData.ts             # Dataset fictício (gerado por scripts/)
│   │   ├── fechamento.ts           # Cálculo de fechamento (puro, testável)
│   │   ├── comprovante.ts          # Texto do comprovante, link WhatsApp e PDF
│   │   ├── AuthContext.tsx         # Sessão Supabase Auth (login/logout)
│   │   └── ObraContext.tsx         # Obra selecionada no momento
│   ├── pages/                      # Login, Marcação, Vales, Fechamento, Cadastros
│   └── components/
│       ├── Layout.tsx              # Navegação inferior + seletor de obra + sair
│       └── AuthGate.tsx            # Bloqueia o app sem sessão válida (pulado no modo demo)
├── scripts/
│   ├── gerar_dados_demo.mjs        # Gera samples/dados_demo.json e src/lib/seedData.ts
│   └── gerar_screenshots.py        # Automação Playwright para /screenshots
├── samples/
│   ├── dados_demo.json             # Dataset fictício de exemplo
│   └── comprovante_exemplo.pdf     # Comprovante de pagamento gerado pelo app
├── supabase/schema.sql             # Schema sugerido para produção
└── screenshots/
```

## Resultado para o cliente

O fechamento de pagamento de um ajudante, que antes dependia de conferir
anotações manuais e relembrar vales de cabeça, passa a ser **automático e sem
erro de conta**: o encarregado seleciona o ajudante e o período, confere o
resumo na tela e já envia o comprovante pelo WhatsApp — processo que levava
alguns minutos de conferência manual por ajudante agora leva segundos.
