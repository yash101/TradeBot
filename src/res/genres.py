import os
import random

scriptpath = os.path.dirname(os.path.abspath(__file__))
outpath_cc = os.path.join(scriptpath, "bins.cpp")
outpath_h = os.path.join(scriptpath, "bins.h")

print("Searching for files in " + scriptpath)

add = []

for root, dirs, files in os.walk(scriptpath, topdown = True, followlinks = False):
    paths = [os.path.relpath(os.path.join(root, fil), scriptpath) for fil in files if fil not in ['genres.py', 'bins.h', 'bins.cpp']]

    for path in paths:
        opath = os.path.join(scriptpath, path)
        print(opath)

        with open(opath, 'rb') as f:
            add.append({'p': path, 'f': f.read()})

h_file = '''
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
'''

names = {}
embed0 = ""
embed1 = ""

for fil in add:
    r = None
    while r is None:
        r = random.randint(100, 100000)
        if r in names:
            r = None
            continue
        names[r] = True
    
    filename, data = fil['p'].replace('\\', '/'), fil['f']

    dstr = ""
    for byte in data:
        dstr += '\\x%02x' % byte

    f = f"static const char* _embd_fil_{r} = \"{dstr}\";\n\n"

    embed0 += f
    embed1 += f'    files[\"{filename}\"] = _embd_fil_{r};\n'

cc_file = '''
#include "bins.h"

#include <unordered_map>

{embed0}

static std::unordered_map<std::string, const char*> files;
static bool initialized = false;
static void initialize()
{
    if (initialized)
        return;
    initialized = true;

{embed1}    
}


const char*
tb::get_res(
    std::string path
)
{
    initialize();
    return files[path];
}


std::unordered_map<
    std::string,
    const char*
>&
get_res_map()
{
    initialize();
    return files;
}
'''.replace('{embed1}', embed1).replace('{embed0}', embed0)

with open(outpath_cc, 'w') as f:
    f.write(cc_file)

with open(outpath_h, 'w') as f:
    f.write(h_file)

