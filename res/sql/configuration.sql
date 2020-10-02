CREATE TABLE IF NOT EXISTS "configuration" (
    opt             TEXT            NOT NULL    PRIMARY KEY,
    val             TEXT,
    last_updated    TIMESTAMP       NOT NULL    default current_timestamp
);

CREATE OR REPLACE FUNCTION get_conf_or_update(conf_name, preferred_value)
    RETURNS RECORD
    LANGUAGE plpgsql
    AS
$$
DECLARE
    cfg_option TEXT;
    cfg_value  TEXT;
    cfg_update TEXT;

    ret        RECORD;
BEGIN
    INSERT INTO "configuration" (opt, val, last_updated)
        VALUES (conf_name, preferred_value, NOW())
        WHERE opt = conf_name AND val <> preferred_value
        ON CONFLICT (opt)
            DO UPDATE SET val = preferred_value, last_updated = NOW();
    
    RETURN QUERY
        SELECT cfg.opt, cfg.val, cfg.last_updated
            FROM "configuration" cfg
            WHERE cfg.opt = conf_name;
END;
$$