const path = require("path");
const { execSync } = require("child_process");

process.env.PGHOST = process.env.PGHOST || "host.docker.internal";
process.env.PGPORT = process.env.PGPORT || "5433";
process.env.PGUSER = process.env.PGUSER || "pickup";
process.env.PGPASSWORD = process.env.PGPASSWORD || "pickup";
process.env.PGDATABASE = process.env.PGDATABASE || "pickup_test";

const request = require("supertest");
const app = require("../api/app");
const db = require("../api/db");

const repoRoot = path.resolve(__dirname, "..");

const TOM_USER_ID = "11111111-1111-1111-1111-111111111111";
const MAYA_USER_ID = "22222222-2222-2222-2222-222222222222";
const BASKETBALL_SPORT_ID = "33333333-3333-3333-3333-333333333333";
const TEST_VENUE_ID = "55555555-5555-5555-5555-555555555555";

function run(command) {
  return execSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

describe("API endpoints", () => {
  beforeAll(() => {
    run("npm run db:test:reset");
    run(
      "bash -lc 'for i in {1..40}; do docker compose exec -T postgres_test pg_isready -U pickup -d pickup_test >/dev/null 2>&1 && break; done'",
    );
    run("npm run db:test:migrate");
    run("npm run db:test:seed");
  });

  afterAll(async () => {
    await db.pool.end();
  });

  test("GET / serves the single-page test UI", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain("pickup Test UI");
  });

  test("GET /api returns API metadata", async () => {
    const response = await request(app).get("/api");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.name).toBe("pickup-api");
    expect(response.body.endpoints).toContain("POST /matches");
  });

  test("GET /matches returns seeded match data", async () => {
    const response = await request(app).get("/matches");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.matches)).toBe(true);
    expect(response.body.matches.length).toBeGreaterThan(0);

    const seeded = response.body.matches.find(
      (m) => m.title === "Beginner Basketball Run",
    );

    expect(seeded).toBeDefined();
    expect(seeded.host_name).toBe("Tom");
  });

  test("POST /matches creates a match and adds host as participant", async () => {
    const title = `API Test Create ${Date.now()}`;
    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const createResponse = await request(app).post("/matches").send({
      hostUserId: TOM_USER_ID,
      sportId: BASKETBALL_SPORT_ID,
      venueId: TEST_VENUE_ID,
      title,
      startsAt,
      durationMinutes: 60,
      maxPlayers: 8,
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeDefined();

    const matchId = createResponse.body.id;

    const participantResult = run(
      `docker compose exec -T postgres_test psql -U pickup -d pickup_test -t -A -c "SELECT COUNT(*) FROM match_participants WHERE match_id = '${matchId}' AND user_id = '${TOM_USER_ID}' AND attendance_status = 'joined' AND is_host = TRUE;"`,
    );

    expect(participantResult).toBe("1");
  });

  test("POST /matches/:id/join returns full when second player fills the match", async () => {
    const title = `API Test Join ${Date.now()}`;
    const startsAt = new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const createResponse = await request(app).post("/matches").send({
      hostUserId: TOM_USER_ID,
      sportId: BASKETBALL_SPORT_ID,
      venueId: TEST_VENUE_ID,
      title,
      startsAt,
      durationMinutes: 45,
      maxPlayers: 2,
    });

    expect(createResponse.status).toBe(201);

    const matchId = createResponse.body.id;

    const joinResponse = await request(app)
      .post(`/matches/${matchId}/join`)
      .send({ userId: MAYA_USER_ID });

    expect(joinResponse.status).toBe(200);
    expect(joinResponse.body.ok).toBe(true);
    expect(joinResponse.body.joinedPlayers).toBe(2);
    expect(joinResponse.body.status).toBe("full");
  });

  test("POST /matches returns 400 when required fields are missing", async () => {
    const response = await request(app).post("/matches").send({
      hostUserId: TOM_USER_ID,
      title: "Missing required fields",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("missing_required_fields");
  });

  test("POST /matches returns 400 on invalid foreign keys", async () => {
    const response = await request(app)
      .post("/matches")
      .send({
        hostUserId: "99999999-9999-9999-9999-999999999999",
        sportId: BASKETBALL_SPORT_ID,
        venueId: TEST_VENUE_ID,
        title: "Invalid FK",
        startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60,
        maxPlayers: 8,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid_foreign_key_reference");
  });

  test("POST /matches/:id/join returns 400 when userId is missing", async () => {
    const response = await request(app)
      .post("/matches/77777777-7777-7777-7777-777777777777/join")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("missing_user_id");
  });

  test("POST /matches/:id/join returns 404 for unknown match", async () => {
    const response = await request(app)
      .post("/matches/88888888-8888-8888-8888-888888888888/join")
      .send({ userId: MAYA_USER_ID });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("match_not_found");
  });

  test("POST /matches/:id/join returns 409 when match is already full", async () => {
    const ALEX_USER_ID = "99999999-9999-9999-9999-999999999998";

    await db.query(
      `
      INSERT INTO users (id, display_name, email)
      VALUES ($1, 'Alex', 'alex@example.com')
      ON CONFLICT (email) DO NOTHING
      `,
      [ALEX_USER_ID],
    );

    const createResponse = await request(app)
      .post("/matches")
      .send({
        hostUserId: TOM_USER_ID,
        sportId: BASKETBALL_SPORT_ID,
        venueId: TEST_VENUE_ID,
        title: `Already Full ${Date.now()}`,
        startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 45,
        maxPlayers: 2,
      });

    expect(createResponse.status).toBe(201);

    const matchId = createResponse.body.id;
    const fillResponse = await request(app)
      .post(`/matches/${matchId}/join`)
      .send({ userId: MAYA_USER_ID });

    expect(fillResponse.status).toBe(200);

    const joinResponse = await request(app)
      .post(`/matches/${matchId}/join`)
      .send({ userId: ALEX_USER_ID });

    expect(joinResponse.status).toBe(409);
    expect(joinResponse.body.error).toBe("match_is_full");
  });
});
