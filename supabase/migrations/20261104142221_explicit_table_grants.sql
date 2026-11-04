-- pickup: explicit table privileges.
-- Newer hosted projects don't grant table access to anon/authenticated by
-- default, while the local stack grants everything. Spell it out so both
-- behave the same: signed-in users get exactly what the RLS policies allow,
-- anonymous visitors get nothing. Joining, leaving and cancelling go through
-- the security-definer RPCs, which are granted in the initial schema.

revoke all on
  public.cities,
  public.sports,
  public.venues,
  public.venue_sports,
  public.profiles,
  public.matches,
  public.match_participants,
  public.match_templates
from anon, authenticated;

grant select on
  public.cities,
  public.sports,
  public.venues,
  public.venue_sports,
  public.profiles,
  public.matches,
  public.match_participants,
  public.match_templates
to authenticated;

grant update on public.profiles to authenticated;
grant insert on public.matches to authenticated;
grant insert, update, delete on public.match_templates to authenticated;
