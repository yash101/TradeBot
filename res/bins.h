
#ifndef _BINS_H
#define _BINS_H

#include <string>
#include <unordered_map>

namespace tb
{

    const char*
    get_res(
        std::string path
    );


    std::unordered_map<
        std::string,
        const char*
    >&
    get_res_map();

}

#endif
