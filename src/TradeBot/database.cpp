#include "database.h"
#include "database_connection.h"
#include "../../res/bins.h"

#include <vector>
#include "TradeBot.h"

void
tb::db::initialize_db()
{
	tb::db::PostgresConnectionGuard g;

	PGresult* result;
	ExecStatusType status;

	// names of files in /res/sql
	// run the query for each of these
	std::vector<const char*> filenames{
		"sql/configuration.sql",
		"sql/equity_time_point.sql",
		"sql/fundamentals.sql",
		"sql/option_time_point.sql",
		"sql/order.sql",
		"sql/tdameritrade_order.sql",
		"sql/tdameritrade_root_account.sql",
		"sql/tdameritrade_trading_account.sql",
		"sql/user.sql"
	};

	// run each query
	for (auto it = filenames.begin(); it != filenames.end(); ++it)
	{
		// get the string with the statement from the initial filename that was embedded
		const char* stmt = tb::get_res(*it);

		// print if we are being verbose
		if (tb::TradeBot::instance().check_cmdline_arg("verbose"))
			printf("Executing statement:\n%s\n", stmt);

		// get the result
		result = PQexec(
			g(),
			stmt
		);

		if (result == nullptr)
		{
			printf(
				"Error: failed to execute query:\nQuery: %s\nQuery File: %s\nError: %s:%d\n",
				stmt,
				*it,
				__FILE__,
				__LINE__
			);

			continue;
		}

		status = PQresultStatus(result);
		if (status != PGRES_COMMAND_OK)
		{
			printf("Failed to execute statement:\n%s\n", stmt);
			printf("File: %s\n", *it);
			printf("Error: %s:%d: \t%s\n", __FILE__, __LINE__, PQresStatus(status));
		}

		PQclear(result);
	}
}
