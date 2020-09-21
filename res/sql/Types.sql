DO $$
    BEGIN
        CREATE TYPE BrokerageName AS ENUM ('TDAmeritrade', 'IBKR', 'Robinhood', 'E*Trade');
        CREATE TYPE OrderStatus AS ENUM ('waiting', 'triggered', 'cancelled', 'filled', 'partially_filled');
        CREATE TYPE OrderType AS ENUM ('market', 'limit', 'stop_limit', 'trailing_stop_price', 'trailing_stop_percent', 'moc', 'exercise', 'trail_stop_limit_price', 'trail_stop_limit_percent');
        CREATE TYPE InstrumentType AS ENUM ('stock', 'option');
        CREATE TYPE OptionDirection AS ENUM ('call', 'put');
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;