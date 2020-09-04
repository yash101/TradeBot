#include "Configuration.h"
#include "database.h"
#include <sstream>
#include <exception>
#include <iostream>

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

	// connection failed
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
	std::ostringstream strm;
	strm << port;
	this->port = port;
}

tb::db::PostgresConnectionPool::~PostgresConnectionPool()
{
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

static tb::db::PostgresConnectionPool default_pool(
	DB_HOST,
	DB_PORT,
	DB_OPTIONS,
	DB_TTY,
	DB_NAME,
	DB_LOGIN,
	DB_PASSWORD
);

tb::db::PostgresConnectionPool&
tb::db::PostgresConnectionPool::getDefaultPool()
{
	return default_pool;
}