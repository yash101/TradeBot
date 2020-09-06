#ifndef _ACCOUNT_H
#define _ACCOUNT_H

#include <tuple>

namespace tb
{
    /** \brief represents a brokerage account
    */
    class Account
    {
    private:
    public:
        Account();
        virtual ~Account();

        std::tuple<bool> fetch();
        
    };
}

#endif