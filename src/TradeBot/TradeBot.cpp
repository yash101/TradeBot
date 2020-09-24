#include "TradeBot.h"
#include "../Configuration.h"
#include "database_connection.h"
#include "database.h"
#include "../utilities/fromstring.h"

#include <sstream>
#include <iostream>

#include <libpq-fe.h>


tb::TradeBot::TradeBot()
{
}


tb::TradeBot::~TradeBot()
{
}


void
tb::TradeBot::process_args(
    int argc,
    char** argv
)
{
    for (int i = 1; i < argc; i++)
    {
        std::istringstream strm(argv[i]);
        std::string k;
        std::getline(strm, k, '=');
        cmdline_args[k] = strm.str();
    }
}


int
tb::TradeBot::initialize(
    int argc,
    char** argv
)
{
    process_args(argc, argv);
    set_debug_mode(get_cmdline_arg("verbose") == "true");

    if (print_help()) return 0;
    if (startup_db()) return 1;
    if (startup_webapi()) return 1;
    return 0;
}


bool
tb::TradeBot::print_help()
{
    if (!(check_cmdline_arg("--help") || check_cmdline_arg("-h") || check_cmdline_arg("help")))
        return false; // no help needed

#define hlp(opt, msg) std::cout << "\t" << opt << "\t" << msg << std::endl
#define sect(name) std::cout << std::endl << name << " Configuration:" << std::endl << std::endl

    std::cout << "Usage: TradeBot [arg1]=[value] [arg2]=[value]" << std::endl;

    sect("TradeBot");
    hlp("verbose", "verbose=true will activate detailed outputs");

    sect("Database");
    hlp("postgres.host", "hostname or domain name for the postgres database server");
    hlp("postgres.port", "port at which to connect to the database server");
    hlp("postgres.options", "options for the connection to the database server");
    hlp("postgres.dbname", "name of the database");
    hlp("postgres.login", "username to login with");
    hlp("postgres.password", "password to login with");

    sect("Configuration");
    hlp("configure.webapi.listenaddr", "listen address for the webapi");
    hlp("configure.webapi.listenport", "port on which the webapi should listen at");
    hlp("configure.webapi.baseurl", "base url that the webapi listens at");

#undef sect
#undef hlp
}


bool
tb::TradeBot::startup_db()
{
    try
    {
    
        std::string host, port, options, dbname, login, password;

#define setif(var, cmdline, cfg) var = (check_cmdline_arg(cmdline)) ? get_cmdline_arg(cmdline) : std::string(cfg)

        setif(host, "postgres.host", DB_HOST);
        setif(port, "postgres.port", std::to_string(DB_PORT));
        setif(options, "postgres.options", DB_OPTIONS);
        setif(dbname, "postgres.dbname", DB_NAME);
        setif(login, "postgres.login", DB_LOGIN);
        setif(password, "postgres.password", DB_PASSWORD);


        db_connection_pool.configure(
            host,
            port,
            options,
            "",
            dbname,
            login,
            password
        );

#undef setif

        if (tb::TradeBot::get_cmdline_arg("verbose") == "true")
            std::cout << "Initializing database..." << std::endl;

        // initialize the database
        tb::db::initialize_db(*this);
    }
    catch(std::exception& e)
    {
        return false;
    }

    return true;
}


bool
tb::TradeBot::startup_webapi()
{
    // get webapi listen addr, port and base addr from db
    std::string webapi_ip = get_cmdline_arg("confugre.webapi.listenaddr");
    std::string webapi_port = get_cmdline_arg("configure.webapi.listenport");
    std::string webapi_baseurl = get_cmdline_arg("configure.webapi.baseurl");

    tb::db::PostgresConnectionGuard connection(get_db_pool());
    {
        tb::db::PostgresTransactionManager manager(connection);

        PGresult* result = nullptr;

        result = PQexec(conn, "SELECT ");
    }
}


std::string
tb::TradeBot::get_cmdline_arg(
    std::string key
)
{
    return cmdline_args[key];
}


bool
tb::TradeBot::check_cmdline_arg(
    std::string key
)
{
    return cmdline_args.find(key) != cmdline_args.end();
}

tb::db::PostgresConnectionPool&
tb::TradeBot::get_db_pool()
{
    return db_connection_pool;
}


bool
tb::TradeBot::get_debug_mode()
{
    return debug;
}


void
tb::TradeBot::set_debug_mode(
    bool enable
)
{
    debug = enable;
}
