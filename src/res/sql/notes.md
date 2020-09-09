# Database Table Design:

## Application Configuration

```
class ConfigurationOption
{
	string option;
	string value;
};
```

## Authentication and Accounting

### User Class:

```
class User
{
	long user_id;
	string email;
	string first_name;
	string last_name

	long tdameritrade_id;
};
```

### TD Ameritrade Root Authentication

```
class TDAmeritradeAccount
{
	long acct_id;
	long primary_acct_no;
	string refresh_token;
	string access_token;
	time refresh_token_expiry;
	time access_token_expiry;
};
```

### TD Ameritrade Trading Account

```
class TDAmeritradeTradingAccount
{
	long acct_no;
	json positions;
	long[] orders; // array of order ids
};
```

## Orders

### Order

```
class Order
{
	long order_id;
	string brokerage;
	string symbol;
	float strike;
	date opened;
	date expiry;
	int quantity;
	int filled_quantity;
	string order_type;
	string status;
	float limit_price;
	float fill_price;
	string tif;
};
```

### TD Ameritrade Order

```
class TdAmeritradeOrder
{
	long order_id;
	long td_order_id;
};
```

## Market Data

### Stocks

```
class StockTimePoint
{
	string symbol;	

	timestamp open;
	time tick_width;
	
	float open;
	float close;
	float low;
	float high;

	int volume;
};
```

### Options

```
class OptionTimePoint
{
	string symbol;

	timestamp open;
	time tick_width;

	float open;
	float close;
	float low;
	float high;

	int volume;

	date expiry;
	float strike;

	interval time_to_expiry;	// not actually necessary, but likely more efficient for searching in the database
};
```

### Fundamentals

```
class Fundamentals
{
	string symbol;
	timestamp acquisition;

	// a bunch of fundamental data...
};
```
