#ifndef _STRINGUTILS_H
#define _STRINGUTILS_H

#include <string>
#include <vector>

namespace tb
{
    namespace tools
    {
        std::vector<
            std::string
        >
        split_string(
            std::string& str,
            std::string split
        );

        std::string
        string_join(
            std::vector<
                std::string
            >& strings,
            std::string concatenator
        );

        char read_hex(char hex);
        char to_hex(char num, bool capitalize);
    }
}

#endif
