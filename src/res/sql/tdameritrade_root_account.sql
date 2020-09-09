CREATE TABLE IF NOT EXISTS "tdameritrade_authentication" (
	local_id		SERIAL		NOT NULL	PRIMARY KEY,
	primary_acct_no	INTEGER(8)	NOT NULL	PRIMARY KEY,
	refresh_token	TEXT,
	access_token	TEXT,			--- should be cached in a hashmap in TradeBot locally
	refresh_exp		TIMESTAMP,
	access_exp		TIMESTAMP
);
