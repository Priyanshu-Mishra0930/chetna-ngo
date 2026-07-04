-- SELECT
--     id,
--     name,
--     status
-- FROM "users"
-- WHERE id IN (3, 4, 6);
UPDATE "users"
SET status = 'completed'
WHERE id IN (3, 4);