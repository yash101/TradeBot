#include "authenticationsvr.h"

#include <nlohmann/json.hpp>
#include <iostream>

using json = nlohmann::json;

#ifdef BUILD_AS_EXECUTABLE

int main(int argc, char** argv)
{
    std::cout << "Hello World!" << std::endl;
}

#endif

// note: you fucked up. this belongs in the header
namespace tb
{
    namespace broker_tdameritrade
    {
        class TdOauthAgent
        {
        private:
            httplib::Server server;
        
        public:
        };
    }
}