#include "authenticationsvr.h"

#include <nlohmann/json.hpp>
#include <iostream>

using json = nlohmann::json;


// this code can be built as an executable
#ifdef BUILD_AS_EXECUTABLE

int main(int argc, char** argv)
{
    std::cout << "Hello World!" << std::endl;
}

#endif

tb::tdameritrade::TdOauthAgent::TdOauthAgent()
{
    web_server.Get("/", [](const httplib::Request& req, httplib::Response& res) {
        res.set_redirect("/redirect_uri");
    });

    web_server.Get("/redirect_uri", [](const httplib::Request& req, httplib::Response& res) {
    });
}

tb::tdameritrade::TdOauthAgent::~TdOauthAgent()
{
}

std::tuple<bool, std::string, std::string>
authenticate(std::string redirect_uri, std::string consumer_key)
{
}