-- Ugglebot Web — Databasschema
-- Kör detta i Supabase SQL Editor

-- Profiler (utökar auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  stripe_customer_id text,
  subscription_status text default 'inactive'
    check (subscription_status in ('active', 'canceled', 'past_due', 'inactive')),
  created_at timestamptz default now()
);

-- Enheter (varje fysisk uggla)
create table devices (
  id uuid primary key default gen_random_uuid(),
  pairing_code text unique not null,
  owner_id uuid references profiles(id) on delete set null,
  device_name text default 'Min uggla',
  api_key text unique default encode(gen_random_bytes(32), 'hex'),
  paired_at timestamptz,
  last_seen_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Inställningar per uggla
create table device_settings (
  device_id uuid primary key references devices(id) on delete cascade,
  child_name text default '',
  child_age int default 6 check (child_age between 4 and 10),
  language text default 'sv',
  voice_id text default 'zrHiDhphv9ZnVXBqCLjz',
  voice_stability float default 0.5,
  voice_similarity float default 0.75,
  daily_budget_sek float default 5.0,
  session_max_minutes int default 30,
  idle_timeout_seconds int default 120,
  max_tokens int default 200,
  updated_at timestamptz default now()
);

-- Kostnadshistorik
create table usage_logs (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references devices(id) on delete cascade,
  date date not null,
  whisper_cost float default 0,
  claude_cost float default 0,
  elevenlabs_cost float default 0,
  total_sek float default 0,
  interactions int default 0,
  created_at timestamptz default now(),
  unique(device_id, date)
);

-- Auto-skapa profil vid signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-skapa device_settings vid ny enhet
create or replace function handle_new_device()
returns trigger as $$
begin
  insert into device_settings (device_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_device_created
  after insert on devices
  for each row execute function handle_new_device();

-- RLS Policies
alter table profiles enable row level security;
alter table devices enable row level security;
alter table device_settings enable row level security;
alter table usage_logs enable row level security;

-- Profiler: användare kan läsa/uppdatera sin egen
create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Enheter: ägare kan läsa/uppdatera sina
create policy "Owners can read own devices"
  on devices for select using (auth.uid() = owner_id);
create policy "Owners can update own devices"
  on devices for update using (auth.uid() = owner_id);

-- Device settings: ägare kan läsa/uppdatera
create policy "Owners can read device settings"
  on device_settings for select using (
    exists (select 1 from devices where devices.id = device_id and devices.owner_id = auth.uid())
  );
create policy "Owners can update device settings"
  on device_settings for update using (
    exists (select 1 from devices where devices.id = device_id and devices.owner_id = auth.uid())
  );

-- Usage logs: ägare kan läsa
create policy "Owners can read usage logs"
  on usage_logs for select using (
    exists (select 1 from devices where devices.id = device_id and devices.owner_id = auth.uid())
  );

-- Skapa en test-enhet (byt parkopplingskod till något eget)
insert into devices (pairing_code) values ('UGGLA1');
