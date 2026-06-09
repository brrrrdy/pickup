BEGIN;

INSERT INTO users (id, display_name, email)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Tom', 'tom@example.com'),
    ('22222222-2222-2222-2222-222222222222', 'Maya', 'maya@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO sports (id, name)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'Basketball'),
    ('44444444-4444-4444-4444-444444444444', 'Tennis')
ON CONFLICT (name) DO NOTHING;

INSERT INTO venues (id, name, city)
VALUES
    ('55555555-5555-5555-5555-555555555555', 'Clapham Common Courts', 'London'),
    ('66666666-6666-6666-6666-666666666666', 'Brockwell Park Courts', 'London'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Public Court', 'Monforte de Lemos')
ON CONFLICT DO NOTHING;

INSERT INTO matches (
    id,
    host_user_id,
    sport_id,
    venue_id,
    title,
    starts_at,
    duration_minutes,
    max_players,
    status
)
VALUES (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '55555555-5555-5555-5555-555555555555',
    'Beginner Basketball Run',
    NOW() + INTERVAL '1 day',
    90,
    10,
    'open'
)
ON CONFLICT DO NOTHING;

INSERT INTO match_participants (match_id, user_id, attendance_status, is_host)
VALUES
    ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'joined', TRUE),
    ('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'joined', FALSE)
ON CONFLICT (match_id, user_id) DO NOTHING;

COMMIT;