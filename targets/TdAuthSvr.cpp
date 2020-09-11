#include "../src/tdapi/authenticationsvr.h"
#include "../src/TradeBot/database.h"

int main(int argc, char** argv)
{
    tb::tdameritrade::OneTimeOauthAgent agent;

    if (argc < 5)
    {
        printf("Usage: %s {listen ip} {listen port} {consumer key} {redirect uri}\n", argv[0]);
        return -1;
    }

    std::string
        listen_ip = argv[1],
        consumer_key = argv[3],
        redirect_uri = argv[4];

    short listen_port = std::atoi(argv[2]);

    char buffer[1024];
    snprintf(buffer, 1024, "http://%s:%d/redirect_uri", listen_ip.c_str(), listen_port);

    std::cout << "Now listening at http://" << listen_ip << ":" << listen_port << "/" << std::endl
        << "Please point your browser to the address above to authenticate" << std::endl;

    auto ret = agent.authenticateOAuth(
        listen_ip,
        listen_port,
        std::string(buffer),
        consumer_key + "@AMER.OAUTHAP"
    );

    if (!std::get<0>(ret))
    {
        std::cout << "An error occurred during authentication" << std::endl;
        return -1;
    }

    std::cout << "Authorization Code: " << std::get<1>(ret) << std::endl
        << "Refresh Token: " << std::get<2>(ret) << std::endl
        << "Access Token: " << std::get<3>(ret) << std::endl;

    tb::db::initialize_database(*tb::db::PostgresConnectionGuard().get_connection());

    return 0;
}
