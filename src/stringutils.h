#ifndef _STRINGUTILS_H
#define _STRINGUTILS_H

#include <string>
#include <vector>

namespace tb
{
    namespace tools
    {
        /** \brief splits a string with a splitting string
        * \param str is the string to be split
        * \param split is the string that concatenates each split section
        * \return a vector of strings that were concatenated by split
        * \todo implement this function
        * \todo implement the test for this function > \file test_stringutils.cpp
        */
        std::vector<
            std::string
        >
        split_string(
            std::string& str,
            std::string split
        );


        /** \brief joins strings with a concatenating string
        * \param strings is a vector of strings to be concatenated together
        * \param concatenator is a string that is concatenated between each string in strings
        * \return concatenated string
        * \todo implement this function
        * \todo implement the test for this function > \file test_stringutils.cpp
        */
        std::string
        string_join(
            std::vector<
                std::string
            >& strings,
            std::string concatenator
        );

        /** \brief converts a hex letter to an integer (lower nibble of the return char)
        * \param hex is the hex letter to be converted to an integer
        * \return 8-bit integer between 0 and 15 with the hex value (lower nibble)
        * 
        * This function converts unknown characters to 0x0
        */
        char read_hex(char hex);


        /** \brief converts a number (lower nibble) to a hex character
        * \param num is the number we are converting
        * \param capitalize is set to true if we want capital hex letters, false if we want lowercase
        * \return the hex letter
        * 
        * Thus function truncates the upper nibble if \param num > 15
        */
        char to_hex(char num, bool capitalize);
    }
}

#endif
