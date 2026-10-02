# Diárias de Obra — PWA para Pagamento de Ajudantes

PWA mobile-first para encarregados de obra controlarem presença, vales e
fechamento de pagamento de ajudantes diaristas direto do celular, inclusive sob
sol forte (alto contraste, botões grandes, poucos toques por ação). O app marca
diárias inteiras/meias/faltas, lança vales, calcula automaticamente o valor
líquido a pagar por período e gera um comprovante pronto para WhatsApp ou PDF.
Funciona 100% offline/local para demonstração, com arquitetura pronta para
Supabase (auth + banco) em produção. Resultado para o cliente: o fechamento que
dependia de conferência manual e "cabeça" passa a ser automático, sem erro de
conta, em segundos.

## Tecnologias

- React, TypeScript, Vite
- PWA (vite-plugin-pwa, manifest + service worker)
- Supabase (auth + Postgres), com modo local/demonstração automático
- jsPDF (comprovante em PDF)
- React Router, Vitest + Testing Library

## Ordem sugerida das capturas de tela

1. `01_marcacao_mobile.png` — marcação diária com botões grandes e coloridos (mobile).
2. `02_vales_mobile.png` — lançamento e histórico de vales (mobile).
3. `03_fechamento_mobile.png` — fechamento completo com comprovante e botões de WhatsApp/PDF (mobile).
4. `04_marcacao_desktop.png` — tela de marcação em desktop (responsividade).
5. `05_fechamento_desktop.png` — fechamento em desktop.
6. `06_cadastros_desktop.png` — cadastro de obras e ajudantes.
