#ifndef _DATABASE_H
#define _DATABASE_H

#include <libpq-fe.h>
#include <list>

#include <mutex>

namespace tb
{
	namespace db
	{
		class PostgresConnection
		{
		private:

			std::string host;
			std::string port;
			std::string options;
			std::string tty;
			std::string dbname;
			std::string login;
			std::string password;

		protected:

			PGconn* connection;

		public:

			PostgresConnection(
				std::string host,
				short port,
				std::string options,
				std::string tty,
				std::string dbname,
				std::string login,
				std::string password
			);

			virtual ~PostgresConnection();

			PGconn* operator()();
			void reset();
		};

		class PostgresConnectionPool
		{
		protected:

			std::string host;
			std::string port;
			std::string options;
			std::string tty;
			std::string dbname;
			std::string login;
			std::string password;

			std::list<PostgresConnection*> connections;
			std::mutex queue_mtx;

			unsigned int pool_size;
			unsigned int allocated_connections;
			bool allowExtraAllocation;

			void resize();

		public:

			PostgresConnectionPool();
			PostgresConnectionPool(
				std::string host,
				short port,
				std::string options,
				std::string tty,
				std::string dbname,
				std::string login,
				std::string password
			);

			virtual ~PostgresConnectionPool();

			void setPoolSize(unsigned int size);
			void allowExtraAllocations(bool yes);
			unsigned int getPoolSize();
			unsigned int currentlyAllocated();

			tb::db::PostgresConnection* get();
			void recycle(tb::db::PostgresConnection* connection);

			static PostgresConnectionPool& getDefaultPool();
		};

		class PostgresConnectionGuard
		{
		private:

			PostgresConnectionPool* pool;
			PostgresConnection* connection;

		public:

			PostgresConnectionGuard(
				PostgresConnectionPool* pool,
				PostgresConnection* conn
			);

			virtual ~PostgresConnectionGuard();

			PGconn* operator()();

		};

		void initialize_database(PostgresConnection& connection);
	}
}

#endif
