#ifndef _UTIL_FROMSTRING_H
#define _UTIL_FROMSTRING_H

#include <sstream>
#include <string>

namespace tb
{
    namespace tools
    {
        template <typename To_t>
        inline To_t from_string(std::string str)
        {
            To_t buf;
            std::istringstream stream(str);
            stream >> buf;
            return buf;
        }
    }
}

#endif
