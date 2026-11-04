-- pickup: which sports each venue offers, and each city's timezone.

-------------------------------------------------------------------------------
-- Venue sports
-------------------------------------------------------------------------------

create table public.venue_sports (
  venue_id uuid not null references public.venues (id) on delete restrict,
  sport_id uuid not null references public.sports (id) on delete restrict,
  primary key (venue_id, sport_id)
);

create index venue_sports_sport_id_idx on public.venue_sports (sport_id);

alter table public.venue_sports enable row level security;

create policy "signed-in users can read venue sports"
  on public.venue_sports for select to authenticated using (true);

insert into public.venue_sports (venue_id, sport_id)
select v.id, s.id
from public.venues v
join public.cities c on c.id = v.city_id
cross join public.sports s
where c.name = 'Monforte de Lemos'
  and s.name = 'Padel';

-------------------------------------------------------------------------------
-- City timezone: match start times are wall-clock times in the venue's city.
-------------------------------------------------------------------------------

alter table public.cities
  add column timezone text not null default 'Europe/Madrid';

-------------------------------------------------------------------------------
-- A match can only be created for a sport its venue offers.
-------------------------------------------------------------------------------

drop policy "users can create matches they host" on public.matches;

create policy "users can create matches they host"
  on public.matches for insert to authenticated
  with check (
    host_user_id = (select auth.uid())
    and status = 'scheduled'
    and cancelled_at is null
    and starts_at > now()
    and exists (
      select 1 from public.venues v
      where v.id = matches.venue_id and v.is_active
    )
    and exists (
      select 1 from public.venue_sports vs
      where vs.venue_id = matches.venue_id
        and vs.sport_id = matches.sport_id
    )
  );
