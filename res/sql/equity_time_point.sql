CREATE TABLE IF NOT EXISTS "stock_time_point" (
	symbol		VARCHAR(32)		NOT NULL,

	tick_open	TIMESTAMP		NOT NULL,
	tick_width	INTERVAL		NOT NULL,

	open_price	FLOAT(4)		NOT NULL,
	close_price	FLOAT(4)		NOT NULL,
	low_price	FLOAT(4)		NOT NULL,
	high_price	FLOAT(4)		NOT NULL,

    volume		INTEGER			NOT NULL
);

CREATE TABLE IF NOT EXISTS "option_time_point" (
	expiry			DATE		NOT NULL,
	strike			FLOAT(4)	NOT NULL,

	time_to_expiry	INTERVAL	NOT NULL
) INHERITS ("stock_time_point");
