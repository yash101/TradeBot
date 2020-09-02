#ifndef _WEB_ESSENTIALS_H
#define _WEB_ESSENTIALS_H

#include <unordered_map>
#include <string>

namespace tb
{
    namespace tools
    {
        std::unordered_map<std::string, std::string>
        parse_params(
            std::string params
        );

        std::string
        generate_query (
            std::unordered_map<std::string, std::string> params
        );
    }
}

#endif
