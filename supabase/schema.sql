-- Schema sugerido para produção com Supabase.
-- Rode isto no SQL editor do seu projeto Supabase antes de configurar
-- VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env do frontend.

create table if not exists obras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  endereco text,
  ativa boolean not null default true
);

create table if not exists ajudantes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  valor_diaria numeric(10, 2) not null,
  obra_id uuid not null references obras (id) on delete cascade
);

create table if not exists marcacoes (
  id uuid primary key default gen_random_uuid(),
  ajudante_id uuid not null references ajudantes (id) on delete cascade,
  data date not null,
  tipo text not null check (tipo in ('inteira', 'meia', 'falta')),
  unique (ajudante_id, data)
);

create table if not exists vales (
  id uuid primary key default gen_random_uuid(),
  ajudante_id uuid not null references ajudantes (id) on delete cascade,
  data date not null,
  valor numeric(10, 2) not null,
  observacao text
);

alter table obras enable row level security;
alter table ajudantes enable row level security;
alter table marcacoes enable row level security;
alter table vales enable row level security;

-- Política simples para um único usuário/equipe autenticada (ajuste conforme a necessidade real).
create policy "Usuários autenticados podem gerenciar obras" on obras
  for all using (auth.role() = 'authenticated');
create policy "Usuários autenticados podem gerenciar ajudantes" on ajudantes
  for all using (auth.role() = 'authenticated');
create policy "Usuários autenticados podem gerenciar marcações" on marcacoes
  for all using (auth.role() = 'authenticated');
create policy "Usuários autenticados podem gerenciar vales" on vales
  for all using (auth.role() = 'authenticated');
