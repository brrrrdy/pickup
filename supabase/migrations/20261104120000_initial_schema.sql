-- pickup: initial schema
-- Invite-only alpha. Accounts live in auth.users; app data lives in public.
-- Past matches are never deleted: venues are deactivated, matches are cancelled,
-- and deleting a user leaves their matches behind with a NULL user link.

-------------------------------------------------------------------------------
-- Reference tables
-------------------------------------------------------------------------------

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.sports (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city_id uuid not null references public.cities (id) on delete restrict,
  -- false = unavailable for new matches; history is kept.
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, city_id)
);

create index venues_city_id_idx on public.venues (city_id);

-------------------------------------------------------------------------------
-- Profiles (one per auth user, created by trigger)
-------------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (length(trim(display_name)) > 0),
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-------------------------------------------------------------------------------
-- Matches
-------------------------------------------------------------------------------

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  -- NULL once the host's account is deleted ("Deleted user").
  host_user_id uuid references public.profiles (id) on delete set null,
  sport_id uuid not null references public.sports (id) on delete restrict,
  venue_id uuid not null references public.venues (id) on delete restrict,
  starts_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  -- NULL = open (no limit).
  max_players integer check (max_players > 1),
  notes text,
  -- "full" and "completed" are derived, not stored.
  status text not null default 'scheduled'
    check (status in ('scheduled', 'cancelled')),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  check ((status = 'cancelled') = (cancelled_at is not null))
);

create index matches_starts_at_idx on public.matches (starts_at);
create index matches_host_user_id_idx on public.matches (host_user_id);
create index matches_sport_id_idx on public.matches (sport_id);
create index matches_venue_id_idx on public.matches (venue_id);

create table public.match_participants (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete restrict,
  -- NULL once the player's account is deleted.
  user_id uuid references public.profiles (id) on delete set null,
  joined_at timestamptz not null default now(),
  -- Set when the player leaves; the row is kept.
  left_at timestamptz,
  unique (match_id, user_id)
);

create index match_participants_user_id_idx on public.match_participants (user_id);

-- The host is always the first participant.
create function public.add_host_as_participant()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.host_user_id is not null then
    insert into public.match_participants (match_id, user_id)
    values (new.id, new.host_user_id);
  end if;
  return new;
end;
$$;

create trigger on_match_created
  after insert on public.matches
  for each row execute function public.add_host_as_participant();

-------------------------------------------------------------------------------
-- Match templates (private to their owner)
-------------------------------------------------------------------------------

create table public.match_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  sport_id uuid not null references public.sports (id) on delete restrict,
  venue_id uuid references public.venues (id) on delete restrict,
  duration_minutes integer check (duration_minutes > 0),
  max_players integer check (max_players > 1),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create index match_templates_user_id_idx on public.match_templates (user_id);

-------------------------------------------------------------------------------
-- Match actions (the only way to change matches / participants)
-------------------------------------------------------------------------------

create function public.join_match(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_match public.matches%rowtype;
  v_count integer;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Lock the match so two people can't take the last spot at once.
  select * into v_match from public.matches where id = p_match_id for update;
  if not found then
    raise exception 'match not found' using errcode = 'P0002';
  end if;
  if v_match.status <> 'scheduled' then
    raise exception 'match is cancelled';
  end if;
  if v_match.starts_at <= now() then
    raise exception 'match has already started';
  end if;

  if exists (
    select 1 from public.match_participants
    where match_id = p_match_id and user_id = v_user and left_at is null
  ) then
    return; -- already in
  end if;

  if v_match.max_players is not null then
    select count(*) into v_count
    from public.match_participants
    where match_id = p_match_id and left_at is null;
    if v_count >= v_match.max_players then
      raise exception 'match is full';
    end if;
  end if;

  insert into public.match_participants (match_id, user_id)
  values (p_match_id, v_user)
  on conflict (match_id, user_id)
    do update set left_at = null, joined_at = now();
end;
$$;

create function public.leave_match(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_match public.matches%rowtype;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into v_match from public.matches where id = p_match_id for update;
  if not found then
    raise exception 'match not found' using errcode = 'P0002';
  end if;
  if v_match.host_user_id = v_user then
    raise exception 'the host cannot leave; cancel the match instead';
  end if;
  if v_match.starts_at <= now() then
    raise exception 'match has already started';
  end if;

  update public.match_participants
  set left_at = now()
  where match_id = p_match_id and user_id = v_user and left_at is null;
end;
$$;

create function public.cancel_match(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_match public.matches%rowtype;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into v_match from public.matches where id = p_match_id for update;
  if not found then
    raise exception 'match not found' using errcode = 'P0002';
  end if;
  if v_match.host_user_id is distinct from v_user then
    raise exception 'only the host can cancel this match' using errcode = '42501';
  end if;
  if v_match.status = 'cancelled' then
    return;
  end if;
  if v_match.starts_at <= now() then
    raise exception 'match has already started';
  end if;

  update public.matches
  set status = 'cancelled', cancelled_at = now()
  where id = p_match_id;
end;
$$;

-- Only signed-in users may call these (and never the internal trigger functions).
revoke execute on function public.join_match(uuid) from public, anon;
revoke execute on function public.leave_match(uuid) from public, anon;
revoke execute on function public.cancel_match(uuid) from public, anon;
grant execute on function public.join_match(uuid) to authenticated;
grant execute on function public.leave_match(uuid) to authenticated;
grant execute on function public.cancel_match(uuid) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.add_host_as_participant() from public, anon, authenticated;

-------------------------------------------------------------------------------
-- Row Level Security
-------------------------------------------------------------------------------

alter table public.cities enable row level security;
alter table public.sports enable row level security;
alter table public.venues enable row level security;
alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.match_participants enable row level security;
alter table public.match_templates enable row level security;

-- Reference data: read-only for signed-in users (edited by the admin in the dashboard).
create policy "signed-in users can read cities"
  on public.cities for select to authenticated using (true);

create policy "signed-in users can read sports"
  on public.sports for select to authenticated using (true);

create policy "signed-in users can read venues"
  on public.venues for select to authenticated using (true);

-- Profiles: everyone signed in can see names; you can edit only your own.
create policy "signed-in users can read profiles"
  on public.profiles for select to authenticated using (true);

create policy "users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Matches: anyone signed in can read and create (as themselves, at an active venue,
-- in the future). No update/delete policies: cancelling goes through cancel_match().
create policy "signed-in users can read matches"
  on public.matches for select to authenticated using (true);

create policy "users can create matches they host"
  on public.matches for insert to authenticated
  with check (
    host_user_id = (select auth.uid())
    and status = 'scheduled'
    and cancelled_at is null
    and starts_at > now()
    and exists (
      select 1 from public.venues v
      where v.id = venue_id and v.is_active
    )
  );

-- Participants: read-only; joining/leaving goes through join_match()/leave_match().
create policy "signed-in users can read participants"
  on public.match_participants for select to authenticated using (true);

-- Templates: private to their owner.
create policy "users can read their own templates"
  on public.match_templates for select to authenticated
  using (user_id = (select auth.uid()));

create policy "users can create their own templates"
  on public.match_templates for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "users can update their own templates"
  on public.match_templates for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "users can delete their own templates"
  on public.match_templates for delete to authenticated
  using (user_id = (select auth.uid()));
