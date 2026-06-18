CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "display_name" TEXT NULL,
    "email" TEXT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NULL DEFAULT NOW());
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "sports"(
    "id" UUID NOT NULL,
    "sportname" TEXT NULL
);
ALTER TABLE
    "sports" ADD PRIMARY KEY("id");
ALTER TABLE
    "sports" ADD CONSTRAINT "sports_sportname_unique" UNIQUE("sportname");
CREATE TABLE "venues"(
    "id" UUID NOT NULL,
    "venuename" TEXT NULL,
    "city" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "venues" ADD PRIMARY KEY("id");
CREATE TABLE "matches"(
    "id" UUID NOT NULL,
    "host_user_id" UUID NULL,
    "sport_id" UUID NULL,
    "venue_id" UUID NULL,
    "title" TEXT NULL,
    "starts_at" TIMESTAMP(0) WITH
        TIME zone NULL,
        "duration_minutes" INTEGER NULL,
        "max_players" TEXT NULL DEFAULT 'open',
        "status" TEXT NULL DEFAULT 'open',
        "created_at" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL DEFAULT NOW());
ALTER TABLE
    "matches" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "matches"."duration_minutes" IS 'matches.duration_minutes > 0';
COMMENT
ON COLUMN
    "matches"."max_players" IS 'matches.max_players > 1';
COMMENT
ON COLUMN
    "matches"."status" IS 'allowed: open, full, cancelled, completed';
CREATE TABLE "match_participants"(
    "match_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "attendance_status" TEXT NULL DEFAULT 'joined',
    "is_host" BOOLEAN NULL DEFAULT FALSE,
    "joined_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT 'now'
);
ALTER TABLE
    "match_participants" ADD PRIMARY KEY("match_id");
ALTER TABLE
    "match_participants" ADD PRIMARY KEY("user_id");
COMMENT
ON COLUMN
    "match_participants"."attendance_status" IS 'allowed: joined, waitlist, left';
ALTER TABLE
    "sports" ADD CONSTRAINT "sports_sportname_foreign" FOREIGN KEY("sportname") REFERENCES "matches"("sport_id");
ALTER TABLE
    "matches" ADD CONSTRAINT "matches_venue_id_foreign" FOREIGN KEY("venue_id") REFERENCES "venues"("id");
ALTER TABLE
    "match_participants" ADD CONSTRAINT "match_participants_match_id_foreign" FOREIGN KEY("match_id") REFERENCES "matches"("id");
ALTER TABLE
    "matches" ADD CONSTRAINT "matches_host_user_id_foreign" FOREIGN KEY("host_user_id") REFERENCES "users"("id");
ALTER TABLE
    "match_participants" ADD CONSTRAINT "match_participants_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "matches" ADD CONSTRAINT "matches_venue_id_foreign" FOREIGN KEY("venue_id") REFERENCES "venues"("id");
ALTER TABLE
    "match_participants" ADD CONSTRAINT "match_participants_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "match_participants" ADD CONSTRAINT "match_participants_match_id_foreign" FOREIGN KEY("match_id") REFERENCES "matches"("id");
ALTER TABLE
    "matches" ADD CONSTRAINT "matches_sport_id_foreign" FOREIGN KEY("sport_id") REFERENCES "sports"("id");