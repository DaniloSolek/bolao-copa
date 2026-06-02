# Simulador de bolão

Aplicação web para bolão da Copa do Mundo. Jogadores fazem palpites de resultados de partidas e acumulam pontos conforme os acertos. Ranking em tempo real, tabela de grupos e fase mata-mata.

---

## Funcionalidades

- Cadastro e login simples de usuários
- Palpites de partidas com prazo automático (24h antes do jogo)
- Sistema de pontuação baseado nos resultados
- Ranking geral em tempo real
- Tabela de classificação por grupo
- Painel admin para cadastrar partidas e inserir resultados
- Visualização dos palpites de todos os jogadores por partida

---

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend/Banco:** Supabase
- **Deploy:** Vercel

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/bolao-copa.git
cd bolao-copa
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

Crie um projeto gratuito em [supabase.com](https://supabase.com) e rode os SQLs abaixo no **SQL Editor**.

#### Tabelas

```sql
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table public.selecoes (
  id serial primary key,
  nome text not null,
  grupo text not null,
  created_at timestamptz default now()
);

create table public.partidas (
  id serial primary key,
  time_casa_id int references public.selecoes(id),
  time_fora_id int references public.selecoes(id),
  data_hora timestamptz not null,
  fase text default 'grupos',
  grupo text default 'A',
  gols_casa int,
  gols_fora int,
  time_classificado_id int references public.selecoes(id),
  resultado_inserido boolean default false
);

create table public.palpites (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  partida_id int references public.partidas(id) on delete cascade,
  palpite_casa int not null,
  palpite_fora int not null,
  palpite_classificado_id int references public.selecoes(id),
  pontos int default 0,
  created_at timestamptz default now(),
  unique(user_id, partida_id)
);
```

#### Views

```sql
-- Partidas abertas para palpite (até 24h antes do jogo)
create or replace view public.partidas_abertas as
select
  p.*,
  row_to_json(tc.*) as "timeCasa",
  row_to_json(tf.*) as "timeFora"
from partidas p
join selecoes tc on tc.id = p.time_casa_id
join selecoes tf on tf.id = p.time_fora_id
where
  p.resultado_inserido = false
  and p.data_hora <= (now() + interval '24 hours')
order by p.data_hora asc;

-- Ranking geral
create or replace view public.ranking as
select
  pr.id as user_id,
  pr.username,
  coalesce(sum(pa.pontos), 0) as pontos
from profiles pr
left join palpites pa on pa.user_id = pr.id
left join partidas p on p.id = pa.partida_id and p.resultado_inserido = true
group by pr.id, pr.username
order by pontos desc;

-- Permissões
grant select on public.partidas_abertas to anon, authenticated;
grant select on public.ranking to anon, authenticated;
```

#### RLS (Row Level Security)

```sql
alter table public.profiles enable row level security;
alter table public.selecoes enable row level security;
alter table public.partidas enable row level security;
alter table public.palpites enable row level security;

create policy "Profiles visíveis para todos" on public.profiles for select using (true);
create policy "Usuário edita próprio perfil" on public.profiles for all using (auth.uid() = id);

create policy "Seleções visíveis para todos" on public.selecoes for select using (true);
create policy "Autenticado gerencia seleções" on public.selecoes for all using (auth.uid() is not null);

create policy "Partidas visíveis para todos" on public.partidas for select using (true);
create policy "Autenticado gerencia partidas" on public.partidas for all using (auth.uid() is not null);

create policy "Autenticados leem todos os palpites" on public.palpites for select using (auth.uid() is not null);
create policy "Usuário insere próprio palpite" on public.palpites for insert with check (auth.uid() = user_id);
create policy "Usuário atualiza próprio palpite" on public.palpites for update using (auth.uid() = user_id);
```

#### Trigger de novo usuário

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### Desativar confirmação de email

Em **Authentication → Settings**, desative **Enable email confirmations**.

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

As chaves estão em **Settings → API** no painel do Supabase.

### 5. Rode o projeto

```bash
npm run dev
```

Acesse localmente pelo localhost provido

---

## Deploy no Vercel

1. Suba o projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
4. Clique em **Deploy**
5. No Supabase, vá em **Authentication → URL Configuration** e adicione a URL do Vercel em **Site URL** e **Redirect URLs**

---

## Configuração inicial

### Tornar-se admin

Após criar sua conta, acesse o **Table Editor** no Supabase, abra a tabela `profiles`, encontre seu usuário e defina `is_admin = true`.

### Cadastrar as seleções

Com acesso admin, as seleções precisam ser inseridas na tabela `selecoes` com nome e grupo. Você pode usar o SQL Editor para inserir em lote ou cadastrar pelo Table Editor.

### Fluxo de uso

1. Admin cadastra as partidas no painel **/admin**
2. Jogadores se cadastram e fazem palpites em **/palpites**
3. Após cada jogo, admin insere o resultado no painel admin
4. Pontos são calculados automaticamente
5. Ranking atualizado em **/classificacao**

---

## Sistema de pontuação

### Fase de grupos
| Acerto | Pontos |
|---|---|
| Placar exato | 3 pts |
| Acertar vencedor ou empate | 1 pt |
| Errar | 0 pts |

### Fases eliminatórias
| Acerto | Pontos |
|---|---|
| Placar exato + acertar quem passa | 4 pts |
| Placar exato + errar quem passa (como em decisão por pênaltis) | 3 pts |
| Errar placar exato + acertar resultado + acertar quem passa | 2 pts |
| Acertar quem passa sem acertar o placar ou resultado | 1 pt |
| Errar tudo | 0 pts |