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
