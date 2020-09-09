CREATE TABLE IF NOT EXISTS "tdameritrade_trading_account" (
	account_id			SERIAL		PRIMARY KEY		NOT NULL,
	positions			JSONB,
	orders				SERIAL[]
);
