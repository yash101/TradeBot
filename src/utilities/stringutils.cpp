#include "stringutils.h"

std::vector<
    std::string
>
tb::tools::split_string(
    std::string& str,
    std::string split
)
{
    std::vector<std::string> strings;

    std::string::iterator str_beg;
    std::string::iterator str_end;
}

std::string
tb::tools::string_join(
    std::vector<
        std::string
    >& strings,
    std::string contatenator
)
{
}

char
tb::tools::read_hex(char hex)
{
    if (hex >= '0' && hex <= '9')
        return hex - '0';
    else if (hex >= 'a' && hex <= 'f')
        return hex - 'a' + 10;
    else if (hex >= 'A' && hex <= 'F')
        return hex - 'A' + 10;
    else
        return 0; // failsafe; could be an exception instead
}

char
tb::tools::to_hex(char num, bool capitalize)
{
    static const char* lutUc = "0123456789abcdef";
    static const char* lutC = "0123456789ABCDEF";

    num &= 0xF; // zero the upper nibble

    if (capitalize)
        return lutC[num];

    return lutUc[num];
}