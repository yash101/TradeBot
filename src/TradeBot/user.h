#ifndef _TRADEBOT_USER_H
#define _TRADEBOT_USER_H

#include <cstdint>
#include <string>

namespace tb
{
    struct User
    {

        uint64_t uid;
        std::string first_name;
        std::string last_name;
        std::string email;

    };
}

#endif
