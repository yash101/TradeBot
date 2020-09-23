#ifndef _TRADEBOT_H
#define _TRADEBOT_H

namespace tb
{
    class TradeBot;
}

#include <unordered_map>
#include <libpq-fe.h>

#include "database_connection.h"
#include "webapi.h"

namespace tb
{
    /** \brief The main class for TradeBot where the magic lives. This class contains references to all important parts of TradeBot and it's functionality drives the software
    */
    class TradeBot
    {
    private:

        std::unordered_map<std::string, std::string> cmdline_args;
        tb::db::PostgresConnectionPool db_connection_pool;
        tb::WebAPI api;
        bool debug;

        bool
        print_help();


        /** \brief processes the arguments and makes it easy to check for variables
         * \param argc is the number of arguments provided
         * \param argv is the array of strings
         */
        void
        process_args(
            int argc,
            char** argv
        );


        /** \brief initializes the database types and tables
         */
        bool
        startup_db();


        /** \brief initialize web API
         */
        bool
        startup_webapi();

    public:

        /** \brief Constructor
        */
        TradeBot();


        /** \brief Initialize TradeBot
         * \param argc the number of arguments provided
         * \param argv array of strings with the arguments
        */
        int initialize(
            int argc,
            char** argv
        );


        /** \brief Destructor
        */
        virtual ~TradeBot();


        /** \brief returns a command line argument used to launch TradeBot
        * \param key is the value for the command line argument we are searching for
        * \return the argument value
        */
        std::string
        get_cmdline_arg(
            std::string key
        );


        /** \brief checks if a command line argument was given
        * \param key to look up
        * \return true if the command line arg was given
        */
        bool
        check_cmdline_arg(
            std::string key
        );


        /** \brief get a reference to the database pool
         */
        tb::db::PostgresConnectionPool&
        get_db_pool();


        /** \brief true if verbose output
         */
        bool
        get_debug_mode();


        /** \brief sets whether to enable debug mode
         * \param debug is true if verbose output is preferred; false if verbose output should be supressed.
         */
        void set_debug_mode(
            bool debug
        );
    };
}

#endif
