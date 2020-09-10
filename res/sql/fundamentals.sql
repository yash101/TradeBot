CREATE TABLE IF NOT EXISTS "fundamentals" (
	symbol					VARCHAR(128)	NOT NULL,
	record_date				TIMESTAMP,
	dividend_yield			FLOAT(4),		--- quarterly
	pe_ratio				FLOAT(4),		--- quarterly
	peg_ratio				FLOAT(4),		--- quarterly
	pr_ratio				FLOAT(4),		--- quarterly
	pb_ratio				FLOAT(4),		--- quarterly
	pcf_ratio				FLOAT(4),		--- quarterly
	gross_margin_ttm		FLOAT(4),		--- yearly
	gross_margin_mrq		FLOAT(4),		--- quarterly
	net_profit_margin_ttm	FLOAT(4),		--- yearly
	net_profit_margin_mrq	FLOAT(4),		--- quarterly
	operating_margin_ttm	FLOAT(4),		--- yearly
	operating_margin_mrq	FLOAT(4),		--- quarterly
	return_on_equity		FLOAT(4),		--- quarterly
	return_on_assets		FLOAT(4),		--- quarterly
	return_on_investment	FLOAT(4),		--- quarterly
	quick_ratio				FLOAT(4),		--- quarterly
	current_ratio			FLOAT(4),		--- quarterly
	interest_coverage		FLOAT(4),		--- quarterly
	total_debt_to_capital	FLOAT(4),		--- quarterly
	long_term_debt_to_equity	FLOAT(4),	--- quarterly
	total_debt_to_equity	FLOAT(4),		--- quarterly
	eps_ttm					FLOAT(4),		--- yearly
	eps_percent_change_ttm	FLOAT(4),		--- yearly
	eps_change_year			FLOAT(4),		--- yearly
	rev_change_year			FLOAT(4),		--- yearly
	rev_change_ttm			FLOAT(4),		--- yearly
	rev_change_in			FLOAT(4),		--- quarterly
	shares_outstanding		INTEGER,		--- yearly
	market_cap				FLOAT(8),		--- quarterly
	book_value_share		FLOAT(4),		--- quarterly
	short_interest			FLOAT(4),		--- quarterly
	dividend_growth_3yr		FLOAT(4),		--- yearly
	beta					FLOAT(4),		--- quarterly
	vol_avg_1day			FLOAT(4),		--- daily;   update quarterly, and store faster data elsewhere
	vol_avg_10day			FLOAT(4),		--- 10 days; update quarterly, and store faster data elsewhere
	vol_avg_30day			FLOAT(4)		--- monthly; update quarterly, and store faster data elsewhere
);
