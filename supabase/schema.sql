-- Esquema de base de datos para PokéSearch (ejecutar en el SQL Editor de Supabase)
-- Crea las tablas profiles y scores con sus políticas RLS y el trigger de perfil.

-- ============================================
-- TABLA: profiles (nombre de usuario visible)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Perfiles visibles para todos"
  on public.profiles for select
  using (true);

create policy "Usuario gestiona su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuario actualiza su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- TABLA: scores (puntuaciones del ranking)
-- ============================================
create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score >= 0),
  mode text not null check (mode in ('classic','hard','expert','infinite')),
  created_at timestamptz default now()
);

alter table public.scores enable row level security;

create policy "Ranking visible para todos"
  on public.scores for select
  using (true);

create policy "Usuario inserta sus propias puntuaciones"
  on public.scores for insert
  with check (auth.uid() = user_id);

create index scores_score_idx on public.scores (score desc);

-- ============================================
-- TRIGGER: crea el perfil automáticamente al registrarse
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
