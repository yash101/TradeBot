#include <sstream>
#include <exception>
#include <iostream>
#include <vector>

#include "database_connection.h"
#include "TradeBot.h"
#include "../Configuration.h"
#include "../../res/bins.h"

tb::db::PostgresConnection::PostgresConnection(
	std::string host = "",
	short port = 0,
	std::string options = "",
	std::string tty = "",
	std::string dbname = "",
	std::string login = "",
	std::string password = ""
) :
	host(host),
	options(options),
	tty(tty),
	dbname(dbname),
	login(login),
	password(password),
	connection(nullptr)
{
	std::ostringstream strm;
	strm << port;
	this->port = strm.str();

	// create the connection
	connection = PQsetdbLogin(
		this->host.c_str(),
		this->port.c_str(),
		this->options.c_str(),
		this->tty.c_str(),
		this->dbname.c_str(),
		this->login.c_str(),
		this->password.c_str()
	);


	auto connstatus = PQstatus(connection);
	if (connstatus != CONNECTION_OK)
	{
		switch (connstatus)
		{
		case CONNECTION_STARTED:
			std::cout << "Connection Started" << std::endl;
		case CONNECTION_MADE:
			std::cout << "Connection Made" << std::endl;
		case CONNECTION_AWAITING_RESPONSE:
			std::cout << "Connection Awaiting Response" << std::endl;
		case CONNECTION_AUTH_OK:
			std::cout << "Connection Auth Ok" << std::endl;
		case CONNECTION_SSL_STARTUP:
			std::cout << "Connection SSL Startup" << std::endl;
		case CONNECTION_SETENV:
			std::cout << "Connection Setenv" << std::endl;
		default:
			std::cout << "Connecting..." << std::endl;
		}

		printf("\t%s\n", PQerrorMessage(connection));
	}


	// failed to allocate connection object
	if (connection == NULL)
		throw std::bad_alloc();
}


tb::db::PostgresConnection::~PostgresConnection()
{
	if (connection != nullptr && connection != NULL)
	{
		// close the connection
		PQfinish(connection);
		connection = nullptr;
	}
}


PGconn*
tb::db::PostgresConnection::operator()()
{
	return connection;
}


void
tb::db::PostgresConnection::reset()
{
	if (connection != nullptr && connection != NULL)
		PQreset(connection);
	else
		connection = PQsetdbLogin(
			this->host.c_str(),
			this->port.c_str(),
			this->options.c_str(),
			this->tty.c_str(),
			this->dbname.c_str(),
			this->login.c_str(),
			this->password.c_str()
		);
}


tb::db::PostgresConnectionPool::PostgresConnectionPool() :
	pool_size(0),
	allowExtraAllocation(true),
	allocated_connections(0)
{
}


tb::db::PostgresConnectionPool::PostgresConnectionPool(
	std::string host,
	short port,
	std::string options,
	std::string tty,
	std::string dbname,
	std::string login,
	std::string password
) :
	host(host),
	options(options),
	tty(tty),
	dbname(dbname),
	login(login),
	password(password)
{
	this->port = std::to_string(port);
}


tb::db::PostgresConnectionPool::~PostgresConnectionPool()
{
	// gc; delete each connection
	for (auto it = connections.begin(); it != connections.end(); ++it)
	{
		// de-allocate the connection object
		delete *it;
	}
}


void
tb::db::PostgresConnectionPool::setPoolSize(
	unsigned int size
)
{
	pool_size = size;
	resize();
}


void
tb::db::PostgresConnectionPool::allowExtraAllocations(
	bool yes
)
{
	allowExtraAllocation = yes;
	resize();
}


unsigned int
tb::db::PostgresConnectionPool::getPoolSize()
{
	return pool_size;
}


void
tb::db::PostgresConnectionPool::resize()
{
	// unlimited connections
	if (pool_size == 0)
		return;

	queue_mtx.lock();
	try
	{
		// kill unused connections
		while (allocated_connections > pool_size && !connections.empty())
		{
			delete connections.front();
			connections.pop_front();
			allocated_connections--;
		}
	}
	catch (std::exception& e)
	{
		std::cerr << "Caught exception " << e.what() << std::endl;
	}
	queue_mtx.unlock();
}


tb::db::PostgresConnection*
tb::db::PostgresConnectionPool::get()
{
	queue_mtx.lock();

	tb::db::PostgresConnection* conn = nullptr;
	try
	{
		if (connections.empty() && (allowExtraAllocation || allocated_connections < pool_size))
		{
			short prt;
			std::istringstream ss(port);
			ss >> prt;

			conn = new PostgresConnection(
				host,
				prt,
				options,
				tty,
				dbname,
				login,
				password
			);

			allocated_connections++;
		}
		else
		{
			conn = connections.front();
			connections.pop_front();
		}
	}
	catch (std::exception& e)
	{
		queue_mtx.unlock();
		throw e;
	}

	queue_mtx.unlock();
	if (conn == nullptr)
		throw std::bad_alloc();

	return conn;
}


void
tb::db::PostgresConnectionPool::recycle(
	tb::db::PostgresConnection* conn
)
{
	queue_mtx.lock();

	try
	{
		connections.push_front(conn);
		if (connections.size() > pool_size)
		{
			delete connections.front();
			connections.pop_front();
			allocated_connections--;
		}
	}
	catch (std::exception& e)
	{
		queue_mtx.unlock();
		throw e;
	}

	queue_mtx.unlock();
}


unsigned int
tb::db::PostgresConnectionPool::currentlyAllocated()
{
	return allocated_connections;
}


/** \brief object for the default database pool
* 
* Internal to the database compiled object. Accessible via tb::db::PostgressConnectionPool::getDefaultPool()
*/
static tb::db::PostgresConnectionPool default_pool(
	DB_HOST,
	DB_PORT,
	DB_OPTIONS,
	DB_TTY,
	DB_NAME,
	DB_LOGIN,
	DB_PASSWORD
);
static bool initialized = false;
tb::db::PostgresConnectionPool&
tb::db::PostgresConnectionPool::instance()
{
	if (!initialized)
	{
		default_pool.setPoolSize(DEFAULT_DB_CONN_POOL_SIZE);
		default_pool.allowExtraAllocations(true);
		initialized = true;
	}
	return default_pool;
}


void
tb::db::PostgresConnectionPool::configure(
	std::string host,
	std::string port,
	std::string options,
	std::string tty,
	std::string dbname,
	std::string login,
	std::string password
)
{
	this->host = host;
	this->port = port;
	this->options = options;
	this->tty = tty;
	this->dbname = dbname;
	this->login = login;
	this->password = password;
}


tb::db::PostgresConnectionGuard::PostgresConnectionGuard(
	PostgresConnectionPool& pool,
	PostgresConnection* conn
) :
	pool(&pool),
	connection(conn)
{
}


tb::db::PostgresConnectionGuard::PostgresConnectionGuard(
	tb::db::PostgresConnectionPool& pool
) :
	pool(&pool)
{
	connection = pool.get();
}


tb::db::PostgresConnectionGuard::PostgresConnectionGuard() :
	pool(nullptr),
	connection(nullptr)
{
	pool = &tb::db::PostgresConnectionPool::instance();
	connection = pool->get();
}


tb::db::PostgresConnectionGuard::~PostgresConnectionGuard()
{
	pool->recycle(connection);
	pool = nullptr;
	connection = nullptr;
}


PGconn* tb::db::PostgresConnectionGuard::operator()()
{
	return (*connection)();
}


tb::db::PostgresConnection*
tb::db::PostgresConnectionGuard::get_connection()
{
	return connection;
}


void
tb::db::PostgresTransactionManager::initialize_transaction()
{
	connection->reset();
	auto result = PQexec((*connection)(), "BEGIN");

	if (result == nullptr)
	{
		if (tb::TradeBot::get_cmdline_arg("verbose") == "true")
		{
			fprintf(
				stderr,
				"%s:%d: failed to allocate result for Postgres\n",
				__FILE__,
				__LINE__
			);
		}

		throw std::bad_alloc();
	}

	if (PQresultStatus(result) != PGRES_COMMAND_OK)
	{
		if (tb::TradeBot::get_cmdline_arg("verbose") == "true")
		{
			fprintf(stderr,
				"%s:%d: Error beginning Postgres transaction\n\t%s\b",
				__FILE__,
				__LINE__,
				PQerrorMessage((*connection)())
			);
		}

		PQclear(result);
		connection->reset();
		throw std::exception();
	}
}


void
tb::db::PostgresTransactionManager::complete_transaction()
{
	auto result = PQexec((*connection)(), "END");

	if (result == nullptr)
	{
		if (tb::TradeBot::get_cmdline_arg("verbose") == "true")
		{
			fprintf(
				stderr,
				"%s:%d: failed to allocate result for Postgres\n",
				__FILE__,
				__LINE__
			);
		}

		throw std::bad_alloc();
	}

	if (PQresultStatus(result) != PGRES_COMMAND_OK)
	{
		if (tb::TradeBot::get_cmdline_arg("verbose") == "true")
		{
			fprintf(stderr,
				"%s:%d: Error beginning Postgres transaction\n\t%s\b",
				__FILE__,
				__LINE__,
				PQerrorMessage((*connection)())
			);
		}

		PQclear(result);
		connection->reset();
		throw std::exception();
	}
}


tb::db::PostgresTransactionManager::PostgresTransactionManager(
	tb::db::PostgresConnectionGuard& conn
) :
	connection(conn.get_connection())
{
	initialize_transaction();
}

tb::db::PostgresTransactionManager::PostgresTransactionManager(
	tb::db::PostgresConnection& conn
) :
	connection(&conn)
{
}

tb::db::PostgresTransactionManager::~PostgresTransactionManager()
{
}
