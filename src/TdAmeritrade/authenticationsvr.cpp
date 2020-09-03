#include "authenticationsvr.h"
#include "../web_essentials.h"

#include <nlohmann/json.hpp>
#include <iostream>

using json = nlohmann::json;


// this code can be built as an executable
#ifdef BUILD_TD_AUTHSERVER_SEPARATE

int main(int argc, char** argv)
{
    tb::tdameritrade::TdOauthAgent agent;
    auto ret = agent.authenticateOAuth("127.0.0.1", 9000, "http://127.0.0.1:9000/redirect_uri", "1N44XCM6JQUVMPJ0QNH1SVJ0T0OAHLQQ@AMER.OAUTHAP");
    std::cout << "Code: " << std::get<1>(ret) << std::endl;
}

#endif

tb::tdameritrade::TdOauthAgent::TdOauthAgent()
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

tb::tdameritrade::TdOauthAgent::~TdOauthAgent()
{
}

std::tuple<bool, std::string>
tb::tdameritrade::TdOauthAgent::authenticateOAuth(
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

    httplib::Client tdclient("https://example.com");
    std::string uri = "/v1/oauth2/token?" + tb::tools::generate_query(params);
    std::cout << "Uri: [" << uri << "]" << std::endl;
    auto res = tdclient.Get(uri.c_str());

    if (res.error() != httplib::Success)
    {
        std::cout << "Error: request to TD Ameritrade API failed: " << res.error() << std::endl;
    }

    std::cout << res.value().status << std::endl;
    std::cout << "Data received: " << res.value().body << std::endl;

    return std::make_tuple(true, authorization_code);
}