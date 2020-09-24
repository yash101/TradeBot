CREATE TABLE IF NOT EXISTS "configuration" (
    opt             TEXT            NOT NULL    PRIMARY KEY,
    val             TEXT,
    last_updated    TIMESTAMP       NOT NULL    default current_timestamp
);
