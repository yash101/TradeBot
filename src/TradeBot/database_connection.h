#ifndef _DATABASE_H
#define _DATABASE_H

namespace tb
{
	namespace db
	{
		class PostgresConnection;
		class PostgresConnectionPool;
		class PostgresConnectionGuard;
		class PostgresTransactionManager;
	}
}

#include <libpq-fe.h>
#include <list>
#include <mutex>

namespace tb
{
	namespace db
	{
		/** \brief this class maintains a connection to a postgres database
		* 
		* The connection is opened in the constructor and closed in the destructor.
		* 
		* Access the connection using the evaluate operator: obj()
		*/
		class PostgresConnection
		{
		private:

			std::string host;		//< hostname for the postgres database server
			std::string port;		//< port for the postgres database server
			std::string options;	//< any options for the connection
			std::string tty;		//< this is deprecated and removed, so this option is ignored
			std::string dbname;		//< name of the database
			std::string login;		//< username to access the database
			std::string password;	//< password to log into the database

		protected:

			PGconn* connection;		//< libpq connection handle

		public:

			/** \brief constructs the connection object and initializes the connnection with the inputted parameters
			* \param host is the hostname for the postgres server
			* \param port is the port for the postgres server
			* \param options represents options for the connection to the postgres server
			* \param tty is ignored, but supplied to the driver. this option is deprecated in libpq and is ignored
			* \param dbname is the name of the database we are connecting to
			* \param login is the username for the user used to access the database
			* \param password is the password for the user
			* 
			* Note: throws std::bad_alloc() if the connection failed
			*/
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


			/** \brief returns the handle to the connection used by libpq
			* \return PGconn pointer that is used by libpq to communicate with the database
			*/
			PGconn* operator()();


			/** \brief resets the connection to the postgres server; this is used to recycle the connection in the pool
			*/
			void reset();
		};


		/** \brief connection pool for the Postgres database
		* 
		* This connection is implemented with thread safety in mind.
		* 
		* Retrieve a connection to use with the .get() function. Release a connection using the .recycle() function
		* 
		* \todo implement a function to wait until a connection is available if .connections is empty and allowExtraAllocation is false
		*/
		class PostgresConnectionPool
		{
		protected:

			std::string host;							//< hostname for the postgres database server
			std::string port;							//< port for the postgres database server
			std::string options;						//< any options for the connection
			std::string tty;							//< this is deprecated and removed, so this option is ignored
			std::string dbname;							//< name of the database
			std::string login;							//< username to access the database
			std::string password;						//< password to log into the database

			std::list<PostgresConnection*> connections;	//< a list of pointers to available connection objects
			mutable std::mutex queue_mtx;				//< the mutex used to synchronize .connections and remove race conditions

			unsigned int pool_size;						//< the number of connections we want to keep alive at all times
			unsigned int allocated_connections;			//< the number of connections alive right now
			bool allowExtraAllocation;					//< whether to allocate another connection if a connection is required and none are available


			/** \brief resizes the connection pool based on the rules set by .pool_size and .allowExtraAllocation
			*/
			void resize();

		public:

			PostgresConnectionPool();


			/** \brief constructs the connection pool and supplies the information required to establish connections to the server
			* \param host is the hostname for the postgres server
			* \param port is the port for the postgres server
			* \param options represents options for the connection to the postgres server
			* \param tty is ignored, but supplied to the driver. this option is deprecated in libpq and is ignored
			* \param dbname is the name of the database we are connecting to
			* \param login is the username for the user used to access the database
			* \param password is the password for the user
			*
			* Note: throws std::bad_alloc() if the connection failed
			*/
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

			
			/** \brief sets the max number of open connections and closes connections if necessary
			* \param size is the number of max connections we can have open
			* 
			* Note: if allowExtraAllocation is true, we may have more open connections than the pool size
			*/
			void
			setPoolSize(
				unsigned int size
			);


			/** \brief whether to allow more connections to be open than the pool size
			* \param yes is true if we can allocate more connections than pool_size if a connection is necessary
			*/
			void
			allowExtraAllocations(
				bool yes
			);
 

			/** \brief returns the target size of the pool
			*/
			unsigned int
			getPoolSize();


			/** \brief returns the number of connections currently open
			*/
			unsigned int
			currentlyAllocated();


			/** \brief gets a connection
			* \return PostgresConnection object pointer to manage the lifecycle of the connection
			* 
			* This function returns a pointer to a connection object. Once done with this connection object, return it using the .recycle() function
			*/
			tb::db::PostgresConnection*
			get();


			/** \brief adds a connection object back to the queue of available connections
			* \param connection a PostgresConnection object pointer that should be returned to the queue of available connectiosn or discarded
			*/
			void
			recycle(
				tb::db::PostgresConnection* connection
			);


			/** \brief sets the instance used by ::instance()
			* \param pool is the connection pool we are using
			* 
			* This allows us to use a different configuration than what was compiled in
			*/
			void
			configure(
				std::string host,
				std::string port,
				std::string options,
				std::string tty,
				std::string dbname,
				std::string login,
				std::string password
			);


			/** \brief returns a connection pool to the database that was configured as default
			*
			* Gets the default (global) connection pool
			*
			* \return reference to the default pool
			*/
			static PostgresConnectionPool&
			instance();			
		};

		/** \brief helper class that applies RAII to a connection in a connection pool
		*/
		class PostgresConnectionGuard
		{
		private:

			PostgresConnectionPool* pool;	//< the connection pool being used
			PostgresConnection* connection;	//< the connection being guarded

		public:

			/** \brief constructor which inputs a connection pool and guards a connection against it
			* 
			* \param pool is the pool we should return the connection to
			* \param connection is the connection object we are guarding
			*/
			PostgresConnectionGuard(
				PostgresConnectionPool& pool,
				PostgresConnection* conn
			);


			/** \brief constructor which inputs just a connection pool
			 * \param pool is a connection pool
			 */
			PostgresConnectionGuard(
				PostgresConnectionPool& pool
			);


			/** \brief constructor which uses the default connection pool and automatically acquires and releases the connection object
			*/
			PostgresConnectionGuard();

			
			virtual ~PostgresConnectionGuard();


			/** \brief returns the PGconn pointer used by libpq functions
			* \return handle for libpq functions
			*/
			PGconn*
			operator()();


			/** \brief returns the connection object being used
			* \return connection object which holds the information ahout our active connection
			*/
			PostgresConnection*
			get_connection();
		};


		/** \brief Uses RAII to manage an SQL transaction
		 */
		class PostgresTransactionManager
		{
		private:

			PostgresConnection* connection;
			bool debug;

			void initialize_transaction();
			void complete_transaction();
			void set_debug_mode(bool enable);

		public:

			PostgresTransactionManager(PostgresConnectionGuard& conn);
			PostgresTransactionManager(PostgresConnection& conn);

			virtual ~PostgresTransactionManager();

		};

	}
}

#endif
