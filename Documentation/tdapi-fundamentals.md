# Fundamentals API - TD Ameritrade

```
[

 //Bond:
{
  "bondPrice": 0,
  "cusip": "string",
  "symbol": "string",
  "description": "string",
  "exchange": "string",
  "assetType": "'BOND'"
}
 //FundamentalData:
{
  "symbol": "string",
  "high52": 0,
  "low52": 0,
  "dividendAmount": 0,
  "dividendYield": 0,
  "dividendDate": "string",
  "peRatio": 0,
  "pegRatio": 0,
  "pbRatio": 0,
  "prRatio": 0,
  "pcfRatio": 0,
  "grossMarginTTM": 0,
  "grossMarginMRQ": 0,
  "netProfitMarginTTM": 0,
  "netProfitMarginMRQ": 0,
  "operatingMarginTTM": 0,
  "operatingMarginMRQ": 0,
  "returnOnEquity": 0,
  "returnOnAssets": 0,
  "returnOnInvestment": 0,
  "quickRatio": 0,
  "currentRatio": 0,
  "interestCoverage": 0,
  "totalDebtToCapital": 0,
  "ltDebtToEquity": 0,
  "totalDebtToEquity": 0,
  "epsTTM": 0,
  "epsChangePercentTTM": 0,
  "epsChangeYear": 0,
  "epsChange": 0,
  "revChangeYear": 0,
  "revChangeTTM": 0,
  "revChangeIn": 0,
  "sharesOutstanding": 0,
  "marketCapFloat": 0,
  "marketCap": 0,
  "bookValuePerShare": 0,
  "shortIntToFloat": 0,
  "shortIntDayToCover": 0,
  "divGrowthRate3Year": 0,
  "dividendPayAmount": 0,
  "dividendPayDate": "string",
  "beta": 0,
  "vol1DayAvg": 0,
  "vol10DayAvg": 0,
  "vol3MonthAvg": 0
}
 //Fundamental:
{
  "cusip": "string",
  "symbol": "string",
  "description": "string",
  "exchange": "string",
  "assetType": "'EQUITY' or 'ETF' or 'MUTUAL_FUND' or 'UNKNOWN'",
  "fundamental": {
    "symbol": "string",
    "high52": 0,
    "low52": 0,
    "dividendAmount": 0,
    "dividendYield": 0,
    "dividendDate": "string",
    "peRatio": 0,
    "pegRatio": 0,
    "pbRatio": 0,
    "prRatio": 0,
    "pcfRatio": 0,
    "grossMarginTTM": 0,
    "grossMarginMRQ": 0,
    "netProfitMarginTTM": 0,
    "netProfitMarginMRQ": 0,
    "operatingMarginTTM": 0,
    "operatingMarginMRQ": 0,
    "returnOnEquity": 0,
    "returnOnAssets": 0,
    "returnOnInvestment": 0,
    "quickRatio": 0,
    "currentRatio": 0,
    "interestCoverage": 0,
    "totalDebtToCapital": 0,
    "ltDebtToEquity": 0,
    "totalDebtToEquity": 0,
    "epsTTM": 0,
    "epsChangePercentTTM": 0,
    "epsChangeYear": 0,
    "epsChange": 0,
    "revChangeYear": 0,
    "revChangeTTM": 0,
    "revChangeIn": 0,
    "sharesOutstanding": 0,
    "marketCapFloat": 0,
    "marketCap": 0,
    "bookValuePerShare": 0,
    "shortIntToFloat": 0,
    "shortIntDayToCover": 0,
    "divGrowthRate3Year": 0,
    "dividendPayAmount": 0,
    "dividendPayDate": "string",
    "beta": 0,
    "vol1DayAvg": 0,
    "vol10DayAvg": 0,
    "vol3MonthAvg": 0
  }
}
 //Instrument:
{
  "cusip": "string",
  "symbol": "string",
  "description": "string",
  "exchange": "string",
  "assetType": "'EQUITY' or 'ETF' or 'FOREX' or 'FUTURE' or 'FUTURE_OPTION' or 'INDEX' or 'INDICATOR' or 'MUTUAL_FUND' or 'OPTION' or 'UNKNOWN'"
}
]
```