#include "TradeBot.h"
#include "Configuration.h"
#include "database.h"

#include <sstream>
#include <iostream>


tb::TradeBot::TradeBot(int argc, char** argv)
{
    process_args(argc, argv);
    print_help();
    startup_db();
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


void
tb::TradeBot::startup_db()
{
    std::string host, port, options, dbname, login, password;

#define setif(var, cmdline, cfg) var = (check_cmdline_arg(cmdline)) ? get_cmdline_arg(cmdline) : std::string(cfg)

    setif(host, "postgres.host", DB_HOST);
    setif(port, "postgres.port", std::to_string(DB_PORT));
    setif(options, "postgres.options", DB_OPTIONS);
    setif(dbname, "postgres.dbname", DB_NAME);
    setif(login, "postgres.login", DB_LOGIN);
    setif(password, "postgres.password", DB_PASSWORD);

    tb::db::pool_instance().configure(
        host,
        port,
        options,
        "",
        dbname,
        options,
        password
    );

#undef setif
}


void
tb::TradeBot::print_help()
{
    if (!(check_cmdline_arg("--help") || check_cmdline_arg("-h") || check_cmdline_arg("help")))
        return; // no help needed

#define hlp(opt, msg) std::cout << "\t" << opt << "\t" << msg << std::endl
#define sect(name) std::cout << std::endl << name << " Configuration:" << std::endl << std::endl

    std::cout << "Usage: TradeBot [arg1]=[value] [arg2]=[value]" << std::endl;

    sect("Database");
    hlp("postgres.host", "hostname or domain name for the postgres database server");
    hlp("postgres.port", "port at which to connect to the database server");
    hlp("postgres.options", "options for the connection to the database server");
    hlp("postgres.dbname", "name of the database");
    hlp("postgres.login", "username to login with");
    hlp("postgres.password", "password to login with");

#undef sect
#undef hlp
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


/** \brief Entry point for TradeBot
*/
int main(int argc, char** argv)
{
    tb::TradeBot trbt(argc, argv);

    return 0;
}
