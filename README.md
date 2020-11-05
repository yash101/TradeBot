# TradeBot

## Components

- TradeBot: the tradebot application. Brokers data and trading abilities
- TradeBot-UI: the user interface that allows you to use TradeBot

## TradeBot - Configuration

# TradeBot Backend

## Environment Variables

- The main database settings are stored as environment variables:
	- `PG_HOST`: Postgres database hostname
	- `PG_PORT`: Postgres database server port
	- `PG_DB`: Postgres database name
	- `PG_USER`: Postgres database access username
	- `PG_PASS`: Postgres database access password
- The rest of the configuration for TradeBot are stored in the database in a "configuration" table

## Database-Stored Variables

- `session.secret`: the secret used to sign the sessions. This is automatically generated the first time TradeBot is started and configuration is generally not necessary
- `webapi.port`: the port on which the webapi for TradeBot listens for HTTP requests
