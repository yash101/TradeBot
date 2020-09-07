CREATE TABLE IF NOT EXISTS tdameritrade_authentication (
	uid SERIAL NOT NULL PRIMARY KEY,
	primaryAccountNumber VARCHAR(24) NOT NULL PRIMARY KEY,
	refreshTokenExpiry TIMESTAMP NOT NULL PRIMARY KEY,
	accessTokenExpiry TIMESTAMP NOT NULL PRIMARY KEY,
	refreshToken TEXT NOT NULL,
	accessToken TEXT
);
