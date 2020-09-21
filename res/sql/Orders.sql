CREATE TABLE IF NOT EXISTS "orders" (
    order_id        BIGINT          NOT NULL        PRIMARY KEY     GENERATED ALWAYS AS IDENTITY,
    account_id      BIGINT          NOT NULL,

    opened          TIMESTAMPTZ     NOT NULL,
    closed          TIMESTAMPTZ     DEFAULT NULL,
    order_status    OrderStatus     DEFAULT NULL,
    order_type      OrderType       DEFAULT NULL,

    quantity        INT             NOT NULL        DEFAULT 0,
    filled_quantity INT             NOT NULL        DEFAULT 0,

    limit_price     FLOAT(4)        DEFAULT NULL,
    avg_fill_price  FLOAT(4)        DEFAULT NULL,

    instrument_type InstrumentType  DEFAULT NULL,
    strike          FLOAT(4)        DEFAULT NULL,
    expiry          TIMESTAMPTZ     DEFAULT NULL,
    direction       OptionDirection DEFAULT NULL,

    CONSTRAINT fk_acct_id FOREIGN KEY(account_id) REFERENCES brokerage_account(account_id)
);
