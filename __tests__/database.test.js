const { execSync } = require("child_process");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

function run(command) {
  return execSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

describe("database setup", () => {
  beforeAll(() => {
    run("npm run db:reset");
    run(
      "bash -lc 'for i in {1..40}; do docker compose exec -T postgres pg_isready -U pickup -d pickup >/dev/null 2>&1 && break; done'",
    );
    run("npm run db:migrate");
    run("npm run db:seed");
  });

  test("creates the core tables", () => {
    const result = run(
      "docker compose exec -T postgres psql -U pickup -d pickup -t -A -c \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'sports', 'venues', 'matches', 'match_participants');\"",
    );

    expect(result).toBe("5");
  });

  test("loads the seeded basketball match", () => {
    const result = run(
      "docker compose exec -T postgres psql -U pickup -d pickup -t -A -c \"SELECT m.title || '|' || COUNT(mp.user_id) FROM matches m LEFT JOIN match_participants mp ON mp.match_id = m.id AND mp.attendance_status = 'joined' GROUP BY m.id;\"",
    );

    expect(result).toBe("Beginner Basketball Run|2");
  });
});
