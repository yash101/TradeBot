CREATE TABLE IF NOT EXISTS "positions" (
    position_id     BIGINT          NOT NULL    PRIMARY KEY     GENERATED ALWAYS AS IDENTITY,
    account_id      BIGINT          NOT NULL,
    
    quantity        INT             DEFAULT 0,
    symbol          VARCHAR(32)     DEFAULT NULL,

    instrument_type InstrumentType  DEFAULT NULL,
    strike          FLOAT(4)        DEFAULT NULL,
    expiry          TIMESTAMPTZ     DEFAULT NULL,
    direction       OptionDirection DEFAULT NULL,

    CONSTRAINT fk_acct_id FOREIGN KEY(account_id) REFERENCES brokerage_account(account_id)
);
