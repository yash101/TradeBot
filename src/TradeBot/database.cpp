#include "database.h"
#include "database_connection.h"
#include "../../res/bins.h"
#include "TradeBot.h"
#include <libpq-fe.h>

#include <vector>
#include <iostream>


static bool
_handle_error(
	PGresult* result,
	ExecStatusType& status,
	const char* codefilename,
	int codelinenum,
	const char* file
)
{
	if (result == nullptr)
	{
		std::cout << "Error: PostgreSQL failed allocating result object" << std::endl;

		throw std::exception();
	}

	if (status != PGRES_COMMAND_OK)
	{
		std::cout << "Error: failed to execute query" << std::endl
			<< "File: " << file << std::endl << "Error: " << PQresStatus(status) << std::endl
			<< codefilename << ":" << codelinenum << std::endl
			<< tb::get_res(file);
		
		PQclear(result);		// gc

		throw std::exception();
	}
}

#define handle_error(filename) _handle_error(result, status, __FILE__, __LINE__, filename)

void
tb::db::initialize_db()
{
	tb::db::PostgresConnectionGuard connection;
	auto& g = connection; // delete this line after building this function. fixes build errors while building this function

	PGresult* result;
	ExecStatusType status;

	bool debug = tb::TradeBot::instance().get_cmdline_arg("verbose") == "true";

	if (debug)
		std::cout << "Creating types in postgres database if they don't exist..." << std::endl;
	
	result = PQexec(connection(), tb::get_res("sql/Types.sql"));
	status = PQresultStatus(result);
	handle_error("sql/Types.sql");
	PQclear(result);


	if (debug)
		std::cout << "Creating table configuration if it does not exist..." << std::endl;
	
	result = PQexec(connection(), tb::get_res("sql/Configuration.sql"));
	status = PQresultStatus(result);
	handle_error("sql/Configuration.sql");
	PQclear(result);


	if (debug)
		std::cout << "Creating table users if it does not exist..." << std::endl;
	
	result = PQexec(connection(), tb::get_res("sql/User.sql"));
	status = PQresultStatus(result);
	handle_error("sql/User.sql");
	PQclear(result);


	if (debug)
		std::cout << "Creating table brokerage_account if it does not exist..." << std::endl;
	
	result = PQexec(connection(), tb::get_res("sql/BrokerageAccount.sql"));
	status = PQresultStatus(result);
	handle_error("sql/BrokerageAccount.sql");
	PQclear(result);


	if (debug)
		std::cout << "Creating table tdameritrade_authentication if it does not exist..." << std::endl;
	
	result = PQexec(connection(), tb::get_res("sql/TDAmeritradeAuthentication.sql"));
	status = PQresultStatus(result);
	handle_error("sql/TDAmeritradeAuthentication.sql");
	PQclear(result);


	if (debug)
		std::cout << "Creating table positions if it does not exist..." << std::endl;
	
	result = PQexec(connection(), tb::get_res("sql/Positions.sql"));
	status = PQresultStatus(result);
	handle_error("sql/Positions.sql");
	PQclear(result);


	if (debug)
		std::cout << "Creating table orders if it does not exist..." << std::endl;
	result = PQexec(connection(), tb::get_res("sql/Orders.sql"));
	status = PQresultStatus(result);
	handle_error("sql/Orders.sql");
	PQclear(result);

	if (debug)
		std::cout << "Finished initializing the database and creating necessary tables" << std::endl;
}
