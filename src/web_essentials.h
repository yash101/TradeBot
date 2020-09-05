#ifndef _WEB_ESSENTIALS_H
#define _WEB_ESSENTIALS_H

#include <unordered_map>
#include <string>

namespace tb
{
    namespace tools
    {
        /** \brief parse a URL query into its key-value pairs and return them in a hash map
        * \param params a string containing the query
        * 
        * Note: this function handles the data part of the query.
        * 
        * - Good: a=b&b=c&d=%20
        * - Bad: http://127.0.0.1/a?a=b&b=c&d=%20
        * - Bad: a?a=b&b=c&d=%20
        * 
        * \todo support parsing the entire URL for parameters
        * \return std::unordered_map (hash map) with a string as a key and a string as the value for each key
        * \todo switch to a hash-multimap to allow multiple same queries
        * 
        */
        std::unordered_map<std::string, std::string>
        parse_params(
            std::string params
        );


        /** \brief generate a URL query from a hash map of string parameters
        * \param params unordered map (hash map) of parameters, with a string key and a string value
        * 
        * This format is known as `x-www-urlencoded`(?)
        * 
        * This function will generate, given:
        * 
        * a = b, b = c, d = [space]
        * 
        * a=b&b=c&d=%20
        * 
        * \return string with the query url
        * 
        */
        std::string
        generate_query (
            std::unordered_map<std::string, std::string> params
        );

   
        /** \brief urldecodes a string
        * \param string to url decode
        * \return string url decoded
        */
        std::string
        urldecode(
            std::string in
        );


        /** \brief urlencodes a string
        * \param string to url encode
        * \return string, url-encoded
        */
        std::string
        urlencode(
            std::string in
        );

    }
}

#endif
