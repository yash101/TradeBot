#include "authentication_server.h"
#include "../utilities/web_essentials.h"
#include "../TradeBot/database.h"

#include <nlohmann/json.hpp>
#include <iostream>


using json = nlohmann::json;


tb::tdameritrade::OneTimeOauthAgent::OneTimeOauthAgent()
{
    web_server.Get("/", [&](const httplib::Request& req, httplib::Response& res) {
        std::unordered_map<std::string, std::string> params;
        params["response_type"] = "code";
        params["redirect_uri"] = redirect_uri;
        params["client_id"] = consumer_key;

        std::string auth_ep_red =
            "https://auth.tdameritrade.com/auth?" +
            tb::tools::generate_query(params);

        res.set_content("You should have been redirected to " + auth_ep_red, "text/plain");
        res.set_redirect(auth_ep_red);
    });

    web_server.Get("/redirect_uri", [&](const httplib::Request& req, httplib::Response& res) {
        if (!req.has_param("code"))
        {
            res.status = 400;
            res.set_content("Error: parameter \"code\" was not provided in the request.", "text/plain");
        }

        authorization_code = req.get_param_value("code");

        res.status = 200;
        res.set_content(
            "Authentication successful!\nCode: " + authorization_code,
            "text/plain"
        );

        // should stop this server now though
        web_server.stop();
    });
}

tb::tdameritrade::OneTimeOauthAgent::~OneTimeOauthAgent()
{
}

std::tuple<
    bool,           // success
    std::string,    // authorization_code
    std::string,    // refresh_token
    std::string     // access_token
>
tb::tdameritrade::OneTimeOauthAgent::authenticateOAuth(
    std::string listen_ip,
    short listen_port,
    std::string redirect_uri,
    std::string consumer_key
)
{
    this->listen_ip = listen_ip;
    this->listen_port = listen_port;
    this->redirect_uri = redirect_uri;
    this->consumer_key = consumer_key;

    // listen until we get a code
    web_server.listen(this->listen_ip.c_str(), listen_port);

    std::cout << "Finished listening!" << std::endl;

    // request the authorization token and refresh token
    std::unordered_map<std::string, std::string> params;
    params["grant_type"] = "authorization_code";
    params["access_type"] = "offline";
    params["refresh_token"] = "";
    params["code"] = authorization_code;
    params["client_id"] = consumer_key;
    params["redirect_uri"] = redirect_uri;

    httplib::Client tdclient("https://api.tdameritrade.com");
    std::string uri = "/v1/oauth2/token";

    auto res = tdclient.Post(uri.c_str(), tb::tools::generate_query(params), "application/x-www-form-urlencoded");

    if (res.error() != httplib::Success)
    {
        std::cout << "Error: request to TD Ameritrade API failed: " << res.error() << std::endl;
    }

    auto parsed = json::parse(res.value().body);
    std::cout << "Refresh token: " << parsed["refresh_token"] << std::endl << "Access token" << parsed["access_token"] << std::endl;

    return std::make_tuple(
        true,
        authorization_code,
        parsed["refresh_token"],
        parsed["access_token"]
    );
}


