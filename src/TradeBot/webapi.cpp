#include "webapi.h"

httplib::Server&
tb::WebAPI::get_server()
{
    return http_server;
}

void
tb::WebAPI::set_listen_addr(
    std::string addr,
    uint16_t port
)
{
    listen_addr = addr;
    listen_port = port;
}

bool
tb::WebAPI::start()
{
    http_server.bind_to_port(listen_addr.c_str(), listen_port, 0);
}

bool
tb::WebAPI::stop()
{
    http_server.stop();
}
