CREATE TABLE IF NOT EXISTS user (
	uid					SERIAL			NOT NULL		PRIMARY KEY,
	email				VARCHAR(320),
	first_name			VARCHAR(256),
	last_name			VARCHAR(256),
	tdameritrade_id		SERIAL
);
