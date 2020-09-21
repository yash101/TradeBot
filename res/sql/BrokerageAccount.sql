CREATE TABLE IF NOT EXISTS "brokerage_account" (
    account_id          BIGINT          NOT NULL        PRIMARY KEY     GENERATED ALWAYS AS IDENTITY,
    brokerage_id        BIGINT          NOT NULL,
    user_id             BIGINT          NOT NULL,
    brokerage_name      BrokerageName   NOT NULL,
    td_acct_no          BIGINT          DEFAULT NULL,

    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);
