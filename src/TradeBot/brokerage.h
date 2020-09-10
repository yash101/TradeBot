#ifndef _BROKERAGE_H
#define _BROKERAGE_H

#include <tuple>
#include <vector>

#include "account.h"

namespace tb
{
    /**
     * \brief An abstraction to access a brokerage account
     */
    class Brokerage
    {
    private:
        /**
         * \brief a list of accounts
         */
        std::vector<tb::Account> accounts;
    public:
        Brokerage();
        virtual ~Brokerage();

        /**
         * \brief fetch and update the brokerage
         */
        std::tuple<bool> fetch();

        /**
         * \brief get a list of the accounts
         */
        std::vector<tb::Account>& getAccounts();
    };
}

#endif
