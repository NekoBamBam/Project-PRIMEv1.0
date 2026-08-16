-- ESTE ARCHIVO ES SOLO DOCUMENTACIÓN / REFERENCIA.
-- Refleja tu esquema REAL de Supabase (confirmado por vos), usado por los
-- hooks en src/hooks/. No se ejecuta automáticamente.

create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,                -- título del hábito (ej: "Entrenar")
  position int not null default 0,    -- orden de aparición en la lista (0-6)
  created_at timestamptz not null default now()
);

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  date date not null,                 -- ej: '2026-08-14'
  status text not null default 'neutral' check (status in ('neutral', 'done', 'fail')),
  created_at timestamptz not null default now(),
  unique (habit_id, date)             -- un solo registro por hábito y día
);

create table monthly_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  year_month text not null,           -- formato "YYYY-MM", ej: '2026-08'
  do_less text not null default '',   -- "Hacer Menos"
  do_more text not null default '',   -- "Hacer Más"
  updated_at timestamptz not null default now(),
  unique (user_id, year_month)        -- una fila de notas por usuario y período
);

-- RLS típico para las tres tablas (ajustar si ya tenés políticas distintas):
-- alter table habits enable row level security;
-- create policy "usuarios ven sus propios hábitos" on habits
--   for select using (auth.uid() = user_id);
-- create policy "usuarios insertan sus propios hábitos" on habits
--   for insert with check (auth.uid() = user_id);
-- create policy "usuarios editan sus propios hábitos" on habits
--   for update using (auth.uid() = user_id);
-- create policy "usuarios borran sus propios hábitos" on habits
--   for delete using (auth.uid() = user_id);
-- (repetir el mismo patrón para habit_logs y monthly_notes)
