# pickup

## Description

A cross-platform application that brings together users searching for casual, non-competitive 'pick-up' sports games hosted at both free-to-use public venues (public basketball courts, padel courts, parks, town squares) and privately owned venues (tennis clubs, venues that require an external booking, golf courses, 5-a-side pitches, private tennis and basketball courts etc).

I am primarily trying to appeal to people interested in picking up a sport for the first time. It can be difficult and even counter-productive to start in a more formal environment when playing something new. Sports clubs and even private lessons can be and very often are difficult to approach, and act as a gatekeeper, both in financial and social terms, to accessing a sport. I want to remove that barrier, to encourage community outside the closed-garden of traditional sports clubs, and to make accessing a sport easy and hassle free.

Whilst free-to-use outdoor spaces such as municipal parks, recreation grounds, basketball and football courts are the primary focus during the first phase of development, the goal once this proof of concept prototype has been demonstrated, will be to incorporate paid-for facilities that require a separate action to access.

Users will download and sign up to pickup. They will be able to create matches at a venue, specify values such as a start time and how long they would like to play for, skill level, languages spoken, age ranges, competitiveness, availability to teach players how to play, and then push the match 'live'. Other users on the app interested in playing casual sports will be presented with these matches and subsequently sign up for a particular session.

My intention for security and privacy purposes is to handle all communication within the app itself. Users are free to share personal contact details but should be dissuaded from doing so as, in addition to security concerns, keeping these interactions in-house and within the 'ecosystem' promotes inclusion and new users hoping to join games.

## Current architecture

This repository currently runs as a local-first full-stack prototype.

- Frontend: React Native with Expo (TypeScript), styled with NativeWind/Tailwind.
- Backend API: Node.js + Express in `api/`.
- Database: PostgreSQL (Docker), accessed via `pg`.
- Database lifecycle: SQL migrations and seed scripts in `db/migrations/` and `db/seeds/`.
- Testing: Jest + Supertest integration tests against a separate Docker test database (`postgres_test` on port `5433`).

## Planned future architecture (Supabase)

Supabase remains the intended target architecture once local POC is running and validated against test suite.

Planned Supabase capabilities:

- Managed PostgreSQL database.
- Authentication (users, OAuth, social login).
- Generated APIs (REST and GraphQL).
- Storage for user and venue media.
- Optional serverless functions for custom backend logic.

## Internal docs

Operational API runbooks, endpoint notes, and local data-safety procedures are maintained in private documentation and are intentionally not published in this repository.
