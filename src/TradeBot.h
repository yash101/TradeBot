#ifndef _TRADEBOT_H
#define _TRADEBOT_H

#include <unordered_map>

namespace tb
{
    /** \brief The main class for TradeBot where the magic lives. This class contains references to all important parts of TradeBot and it's functionality drives the software
    */
    class TradeBot
    {
    private:

        std::unordered_map<std::string, std::string> cmdline_args;

        void
        print_help();

        void
        process_args(
            int argc,
            char** argv
        );

        void
        startup_db();

    public:

        /** \brief Constructor
        */
        TradeBot(int argc, char** argv);


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
    };
}

#endif