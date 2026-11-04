-- pickup: alpha reference data
-- One city, one sport, four venues. Add venues later with a new migration
-- (or the dashboard); retire one with: update public.venues set is_active = false where name = '...';

insert into public.cities (name) values ('Monforte de Lemos');

insert into public.sports (name) values ('Padel');

insert into public.venues (name, city_id)
select v.name, c.id
from (
  values
    ('Pádel''Ante Club'),
    ('Lemos Padel'),
    ('Club Fluvial Monforte'),
    ('Sacra Pádel Monforte')
) as v (name)
cross join public.cities c
where c.name = 'Monforte de Lemos';
