CREATE TABLE IF NOT EXISTS "configuration" (
    opt             TEXT            NOT NULL    PRIMARY KEY,
    val             TEXT,
    last_updated    TIMESTAMP       NOT NULL    default current_timestamp
);

CREATE OR REPLACE FUNCTION get_conf_or_update(conf_name, preferred_value, default_value)
    RETURNS TEXT
    LANGUAGE plpgsql
    AS
$$
DECLARE
    final_value TEXT;
BEGIN
    SELECT * INTO database_initial FROM 'configuration' WHERE opt = conf_name;

    SELECT CASE WHEN 

    SELECT COALESCE(database_initial.val, preferred_value, default_value, '') INTO first_not_null;
END;
$$