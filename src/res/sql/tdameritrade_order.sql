CREATE TABLE IF NOT EXISTS "tdameritrade_order" (
	order_id		SERIAL		NOT NULL		PRIMARY KEY,
	td_order_id		INTEGER(8)	NOT NULL		PRIMARY KEY
);