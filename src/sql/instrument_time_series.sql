CREATE TABLE IF NOT EXISTS instrument_time_series (
	instrument_id SERIAL NOT NULL,
	open FLOAT(4) NOT NULL,
	close FLOAT(4) NOT NULL,
	high FLOAT(4) NOT NULL,
	low FLOAT(4) NOT NULL
);

--- this table holds historic data for instruments
--- stocks: symbol = symbol of company / base symbol; type = what instrument type is it
--- instrument: instrument description - symbol | symbol:[C|P]:[strike]:[exp]