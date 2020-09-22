--- /res/sql/Types.sql
DO $$
    BEGIN
        CREATE TYPE BrokerageName AS ENUM ('TDAmeritrade', 'IBKR', 'Robinhood', 'E*Trade');
        CREATE TYPE OrderStatus AS ENUM ('waiting', 'triggered', 'cancelled', 'filled', 'partially_filled');
        CREATE TYPE OrderType AS ENUM ('market', 'limit', 'stop_limit', 'trailing_stop_price', 'trailing_stop_percent', 'moc', 'exercise', 'trail_stop_limit_price', 'trail_stop_limit_percent');
        CREATE TYPE InstrumentType AS ENUM ('stock', 'option');
        CREATE TYPE OptionDirection AS ENUM ('call', 'put');
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;


--- /res/sql/Configuration.sql
CREATE TABLE IF NOT EXISTS "configuration" (
    opt             VARCHAR(32)     NOT NULL    PRIMARY KEY,
    val             TEXT,
    last_updated    TIMESTAMP       NOT NULL    default current_timestamp
);


--- /res/sql/User.sql
CREATE TABLE IF NOT EXISTS "users" (
    user_id         BIGINT          PRIMARY KEY     GENERATED ALWAYS AS IDENTITY,
    username        VARCHAR(96),
    full_name       VARCHAR(128),
    email           VARCHAR(256)
);


--- /res/sql/BrokerageAccount.sql
CREATE TABLE IF NOT EXISTS "brokerage_account" (
    account_id          BIGINT          NOT NULL        PRIMARY KEY     GENERATED ALWAYS AS IDENTITY,
    brokerage_id        BIGINT          NOT NULL,
    user_id             BIGINT          NOT NULL,
    brokerage_name      BrokerageName   NOT NULL,
    td_acct_no          BIGINT          DEFAULT NULL,

    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);


--- /res/sql/TDAmeritradeAuthentication.sql
CREATE TABLE IF NOT EXISTS "tdameritrade_authentication" (
    tda_acct_id         BIGINT          NOT NULL        PRIMARY KEY    GENERATED ALWAYS AS IDENTITY,
    user_id             BIGINT          NOT NULL,
    consumer_key        TEXT            DEFAULT NULL,
    refresh_token       TEXT            DEFAULT NULL,
    access_token        TEXT            DEFAULT NULL,
    refresh_token_exp   TIMESTAMPTZ     DEFAULT NULL,
    access_token_exp    TIMESTAMPTZ     DEFAULT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES users(user_id)
);


--- /res/sql/Positions.sql
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


--- /res/sql/Orders.sql
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

