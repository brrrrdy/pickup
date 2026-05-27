# pickup

## Description

A cross-platform application that brings together users searching for casual, non-competitive 'pick-up' sports games hosted at both free-to-use public venues (public basketball courts, padel courts, parks, town squares) and privately owned venues (tennis clubs, venues that require an external booking, golf courses, 5-a-side pitches, private tennis and basketball courts etc).

I am primarily trying to appeal to people interested in picking up a sport for the first time. It can be difficult and even counter-productive to start in a more formal environment when playing something new. Sports clubs and even private lessons can be and very often are difficult to approach, and act as a gatekeeper, both in financial and social terms, to accessing a sport. I want to remove that barrier, to encourage community outside the closed-garden of traditional sports clubs, and to make accessing a sport easy and hassle free.

Whilst free-to-use outdoor spaces such as municipal parks, recreation grounds, basketball and football courts are the primary focus during the first phase of development, the goal once this proof of concept prototype has been demonstrated, will be to incorporate paid-for facilities that require a separate action to access.

Users will download and sign up to pickup. They will be able to create matches at a venue, specify values such as a start time and how long they would like to play for, skill level, languages spoken, age ranges, competitiveness, availability to teach players how to play, and then push the match 'live'. Other users on the app interested in playing casual sports will be presented with these matches and subsequently sign up for a particular session.

My intention for security and privacy purposes is to handle all communication within the app itself. Users are free to share personal contact details but should be dissuaded from doing so as, in addition to security concerns, keeping these interactions in-house and within the 'ecosystem' promotes inclusion and new users hoping to join games.

## Stack

Supabase

Full out-the-box backend. Essentially Firebase, but open-source and built on PostgreSQL.

- Database (PostgreSQL)
- Authentication (users, OAuth, social login)
- APIs (REST and GraphQL out of the box)
- Storage (files, images)
- Real-time updates (WebSocket-based subscriptions)
- Serverless functions (optional backend logic)
- Typescript (React Native with Expo)
- Tailwind CSS (Nativewind)

## Local API (current)

The project now includes a small Node + Express API in `api/` that connects to the local Postgres database.

### Run locally

1. Start Postgres:

```bash
npm run db:up
```

2. Apply schema + seed data:

```bash
npm run db:migrate
npm run db:seed
```

3. Start API:

```bash
npm run api:start
```

If you want to load environment variables from `.env.local`, use:

```bash
npm run api:start:local
```

### Endpoints

- `GET /health`: check API and database connectivity.
- `GET /matches`: list matches (supports optional query params: `status`, `city`, `sport`).
- `POST /matches`: create a new match and auto-add host as a participant.
- `POST /matches/:id/join`: join a match and update status (`open` or `full`).
