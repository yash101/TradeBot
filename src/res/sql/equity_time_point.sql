CREATE TABLE IF NOT EXISTS "stock_time_point" (
	symbol		VARCHAR(32)		NOT NULL,
	symbol		VARCHAR(32)		NOT NULL,

	tick_open	TIMESTAMP		NOT NULL,
	tick_width	INTERVAL		NOT NULL,

	open		FLOAT(4)		NOT NULL
	close		FLOAT(4)		NOT NULL,
	low			FLOAT(4)		NOT NULL,
	high		FLOAT(4)		NOT NULL,

	volume		INTEGER(4)		NOT NULL,
);

CREATE TABLE IF NOT EXISTS "option_time_point" (
	expiry			DATE		NOT NULL,
	strike			FLOAT(4)	NOT NULL,

	time_to_expiry	INTERVAL	NOT NULL
) INHERITS ('stock_time_point');
