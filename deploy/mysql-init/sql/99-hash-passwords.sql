-- sampledb.sql seeds every account with the plaintext password "password123",
-- but the app's login checks bcrypt.compare(). This replaces it with a
-- pre-computed bcrypt hash (10 rounds) of "password123" so every seeded
-- account can log in immediately after `docker compose up`.
UPDATE Resident SET password = '$2b$10$uVsZr7javpt9/338Hj6HfOC94v1UvribDSwNkNEEfzl/N1BBBXHHq' WHERE isDeleted = FALSE;
UPDATE Employee SET password = '$2b$10$uVsZr7javpt9/338Hj6HfOC94v1UvribDSwNkNEEfzl/N1BBBXHHq' WHERE isDeleted = FALSE;
