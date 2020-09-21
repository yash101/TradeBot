CREATE TABLE IF NOT EXISTS "users" (
    user_id         BIGINT          PRIMARY KEY     GENERATED ALWAYS AS IDENTITY,
    username        VARCHAR(96),
    full_name       VARCHAR(128),
    email           VARCHAR(256)
);

