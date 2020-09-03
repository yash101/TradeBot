#include "web_essentials.h"
#include "stringutils.h"

#include <vector>
#include <sstream>
#include <string>

#include <cstring>

#include <iostream>

std::unordered_map<std::string, std::string>
tb::tools::parse_params(
    std::string params
)
{
    std::unordered_map<std::string, std::string> parameters;
    std::istringstream stream(params);

    // split by '&' - which separates the different parameters
    std::string item;

    while (std::getline(stream, item, '&'))
    {
        // igore this trash
        if (item.size() == 0 || item.front() == '=')
            continue;

        std::string key, value = "";

        // get the position of the assignment
        auto eq = item.find('=');

        // no equals means the entire string is the key
        // if front() is '=', key is '' -> discard
        key = (eq == std::string::npos) ?
            item :
            item.substr(0, eq);

        if (item.back() != '=' && eq != std::string::npos)
            value = item.substr(eq + 1);

        parameters[urldecode(key)] = urldecode(value);
    }

    return parameters;
}

std::string
tb::tools::generate_query(
    std::unordered_map<std::string, std::string> params
)
{
    std::ostringstream stream;
    for (auto it = params.begin(); it != params.end(); ++it)
    {
        std::string key = it->first;
        std::string val = it->second;

        stream << tb::tools::urlencode(key) << '=' << tb::tools::urlencode(val) << '&';
    }

    std::string ret = stream.str();

    // check if we added an ampersand at the end
    if (ret.size() != 0 && ret.back() == '&')
        ret.pop_back();

    return ret;
}

std::string
tb::tools::urldecode(
    std::string in
)
{
    std::ostringstream strm;
    for (auto it = in.begin(); it != in.end(); ++it)
    {
        if (*it == '%')
        {
            auto first = it + 1;
            auto second = it + 2;

            if (first + 1 == in.end() || second + 1 == in.end())
            {
                strm << *it;
            }
            else
            {
                strm << tb::tools::read_hex(*first) * 16 + tb::tools::read_hex(*second);
                it += 2;
            }
        }
        else
        {
            strm << *it;
        }
    }
    return strm.str();
}

static bool escape_lut[256];
static const char* escape_strings[256];
static bool escape_lut_built = false;

static void build_urlencode_lut()
{
    // only run once; these 3 lines should prob be inlined
    if (escape_lut_built)
        return;
    escape_lut_built = true;

    const char* unescaped = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~";
    const char* ptr = unescaped;

    for (size_t i = 0; i < 255; i++)
        escape_lut[i] = true;
    while (*ptr != '\0')
        escape_lut[*ptr++] = false;

    for (size_t i = 0; i < sizeof(escape_lut) / sizeof(escape_lut[0]); i++)
    {
        if (escape_lut[i])
        {
            char* escape_str = new char[4];
            char ch = static_cast<char>(i);
            escape_str[0] = '%';
            escape_str[1] = tb::tools::to_hex((ch & 0xF0) >> 4, true);
            escape_str[2] = tb::tools::to_hex(ch & 0x0F, true);
            escape_str[3] = '\0';

            escape_strings[i] = const_cast<const char*>(escape_str);
        }
    }
}

std::string
tb::tools::urlencode(
    std::string in
)
{
    build_urlencode_lut();
    
    // todo: count the number of escapes first and pre-allocate
    std::ostringstream strm;

    for (auto it = in.begin(); it != in.end(); ++it)
    {
        if (escape_lut[*it])
            strm << escape_strings[*it];
        else
            strm << *it;
    }

    return strm.str();
}
