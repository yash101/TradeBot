#include "web_essentials.h"

#include <vector>
#include <sstream>
#include <string>

#include <cstring>

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
        std::istringstream itemstream(item);
        std::string key, value = "";

        if (std::getline(itemstream, key, '='))
        {
            value = itemstream.str();
        }

        parameters[urldecode(key)] = urldecode(value);
    }
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
    std::string& in
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

            char first = std::tolower(*first) - 'a',
                second = std::tolower(*second) - 'a';

            static lut = 
        }
        else
        {
            strm << *it;
        }
    }
}

std::string
tb::tools::urlencode(
    std::string& in
)
{
}