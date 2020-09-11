CREATE TABLE IF NOT EXISTS "order" (
	order_id		SERIAL		NOT NULL	PRIMARY KEY,
	brokerage		VARCHAR(32)	NOT NULL,
	symbol			VARCHAR(32)	NOT NULL,
	opened			TIMESTAMP	NOT NULL,
	closed			TIMESTAMP,
	target_quantity	INTEGER		NOT NULL,
	filled			INTEGER		NOT NULL,
	order_status	VARCHAR(32),
	tif				VARCHAR(32),
	option_expiry	TIMESTAMP,
	option_strike	FLOAT(4),
	limit_price		FLOAT(4)	NOT NULL,
	filled_price	FLOAT(4)
);
