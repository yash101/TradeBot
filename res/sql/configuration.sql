CREATE TABLE IF NOT EXISTS "Configuration" (
    opt             VARCHAR(32)     NOT NULL    PRIMARY KEY,
    val             TEXT,
    last_updated    TIMESTAMP       NOT NULL    default current_timestamp
);
