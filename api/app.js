const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (_req, res) => {
  res.json({
    name: "pickup-api",
    ok: true,
    endpoints: [
      "GET /health",
      "GET /sports",
      "GET /venues",
      "GET /matches",
      "POST /matches",
      "POST /matches/:id/join",
    ],
  });
});

app.get("/sports", async (_req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, name
      FROM sports
      ORDER BY name ASC
      `,
    );

    res.json({ sports: result.rows });
  } catch (error) {
    res.status(500).json({ error: "failed_to_list_sports" });
  }
});

app.get("/venues", async (_req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, name, city
      FROM venues
      ORDER BY city ASC NULLS LAST, name ASC
      `,
    );

    res.json({ venues: result.rows });
  } catch (error) {
    res.status(500).json({ error: "failed_to_list_venues" });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", async (_req, res) => {
  try {
    const result = await db.query("SELECT NOW() AS now");
    res.json({ ok: true, dbTime: result.rows[0].now });
  } catch (error) {
    res.status(503).json({ ok: false, error: "database_unavailable" });
  }
});

app.get("/matches", async (req, res) => {
  const { status, city, sport } = req.query;

  const filters = [];
  const values = [];

  if (status) {
    values.push(status);
    filters.push(`m.status = $${values.length}`);
  }

  if (city) {
    values.push(city);
    filters.push(`LOWER(v.city) = LOWER($${values.length})`);
  }

  if (sport) {
    values.push(sport);
    filters.push(`LOWER(s.name) = LOWER($${values.length})`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  try {
    const result = await db.query(
      `
      SELECT
        m.id,
        m.title,
        m.starts_at,
        m.duration_minutes,
        m.max_players,
        m.status,
        s.name AS sport_name,
        v.name AS venue_name,
        v.city,
        host.display_name AS host_name,
        COUNT(mp.user_id) FILTER (WHERE mp.attendance_status = 'joined')::int AS joined_players
      FROM matches m
      JOIN sports s ON s.id = m.sport_id
      JOIN venues v ON v.id = m.venue_id
      JOIN users host ON host.id = m.host_user_id
      LEFT JOIN match_participants mp ON mp.match_id = m.id
      ${whereClause}
      GROUP BY m.id, s.name, v.name, v.city, host.display_name
      ORDER BY m.starts_at ASC
      `,
      values,
    );

    res.json({ matches: result.rows });
  } catch (error) {
    res.status(500).json({ error: "failed_to_list_matches" });
  }
});

app.post("/matches", async (req, res) => {
  const {
    hostUserId,
    sportId,
    venueId,
    title,
    startsAt,
    durationMinutes,
    maxPlayers,
  } = req.body;

  if (
    !hostUserId ||
    !sportId ||
    !venueId ||
    !title ||
    !startsAt ||
    !durationMinutes ||
    !maxPlayers
  ) {
    return res.status(400).json({ error: "missing_required_fields" });
  }

  try {
    const insertedMatch = await db.query(
      `
      INSERT INTO matches (
        host_user_id,
        sport_id,
        venue_id,
        title,
        starts_at,
        duration_minutes,
        max_players,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'open')
      RETURNING id
      `,
      [
        hostUserId,
        sportId,
        venueId,
        title,
        startsAt,
        durationMinutes,
        maxPlayers,
      ],
    );

    await db.query(
      `
      INSERT INTO match_participants (match_id, user_id, attendance_status, is_host)
      VALUES ($1, $2, 'joined', TRUE)
      ON CONFLICT (match_id, user_id)
      DO UPDATE SET attendance_status = 'joined', is_host = TRUE
      `,
      [insertedMatch.rows[0].id, hostUserId],
    );

    return res.status(201).json({ id: insertedMatch.rows[0].id });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({ error: "invalid_foreign_key_reference" });
    }

    if (error.code === "23514") {
      return res.status(400).json({ error: "invalid_match_values" });
    }

    return res.status(500).json({ error: "failed_to_create_match" });
  }
});

app.post("/matches/:id/join", async (req, res) => {
  const matchId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "missing_user_id" });
  }

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    const matchResult = await client.query(
      `
      SELECT id, max_players, status
      FROM matches
      WHERE id = $1
      FOR UPDATE
      `,
      [matchId],
    );

    if (matchResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "match_not_found" });
    }

    const match = matchResult.rows[0];

    if (match.status === "cancelled" || match.status === "completed") {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "match_is_not_joinable" });
    }

    const joinedCountResult = await client.query(
      `
      SELECT COUNT(*)::int AS count
      FROM match_participants
      WHERE match_id = $1 AND attendance_status = 'joined'
      `,
      [matchId],
    );

    const joinedCount = joinedCountResult.rows[0].count;

    const alreadyJoinedResult = await client.query(
      `
      SELECT 1
      FROM match_participants
      WHERE match_id = $1 AND user_id = $2 AND attendance_status = 'joined'
      `,
      [matchId, userId],
    );

    const alreadyJoined = alreadyJoinedResult.rowCount > 0;

    if (!alreadyJoined && joinedCount >= match.max_players) {
      await client.query("UPDATE matches SET status = 'full' WHERE id = $1", [
        matchId,
      ]);
      await client.query("COMMIT");
      return res.status(409).json({ error: "match_is_full" });
    }

    await client.query(
      `
      INSERT INTO match_participants (match_id, user_id, attendance_status, is_host)
      VALUES ($1, $2, 'joined', FALSE)
      ON CONFLICT (match_id, user_id)
      DO UPDATE SET attendance_status = 'joined'
      `,
      [matchId, userId],
    );

    const newJoinedCountResult = await client.query(
      `
      SELECT COUNT(*)::int AS count
      FROM match_participants
      WHERE match_id = $1 AND attendance_status = 'joined'
      `,
      [matchId],
    );

    const newJoinedCount = newJoinedCountResult.rows[0].count;
    const newStatus = newJoinedCount >= match.max_players ? "full" : "open";

    await client.query("UPDATE matches SET status = $1 WHERE id = $2", [
      newStatus,
      matchId,
    ]);

    await client.query("COMMIT");

    return res.json({
      ok: true,
      matchId,
      joinedPlayers: newJoinedCount,
      status: newStatus,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23503") {
      return res.status(400).json({ error: "invalid_user_id" });
    }

    return res.status(500).json({ error: "failed_to_join_match" });
  } finally {
    client.release();
  }
});

module.exports = app;
