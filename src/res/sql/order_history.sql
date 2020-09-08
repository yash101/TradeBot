CREATE TABLE IF NOT EXISTS "order_history" (
	order_id			SERIAL			NOT NULL PRIMARY KEY,
	timestamp_placed	TIMESTAMP		NOT NULL,
	timestamp_closed	TIMESTAMP		NOT NULL,
	instrument			SERIAL			NOT NULL,	--- instrument ID
	avg_price			FLOAT(4)		NOT NULL,
	quantity			INTEGER			NOT NULL,
	status				VARCHAR(16)		NOT NULL,
	extra				JSONB
);
