#ifndef _TRADEBOT_WEBAPI_H
#define _TRADEBOT_WEBAPI_H

#include <httplib.h>

namespace tb
{
    class WebAPI
    {
    private:

        std::string listen_addr;
        uint16_t listen_port;
        httplib::Server http_server;

    public:

        httplib::Server&
        get_server();

        void
        set_listen_addr(
            std::string addr,
            uint16_t port
        );

        bool
        start();

        bool
        stop();

    };
}

#endif
