#ifndef _AUTHENTICATIONSVR_H
#define _AUTHENTICATIONSVR_H

#include <httplib.h>

#include <tuple>

namespace tb
{
    namespace tdameritrade
    {
        class TdOauthAgent
        {
        private:
            httplib::Server web_server;
        public:
            TdOauthAgent();
            virtual ~TdOauthAgent();

            std::tuple<bool, std::string, std::string>
            authenticate(std::string redirect_uri, std::string consumer_key);
        };
    }
}

#endif