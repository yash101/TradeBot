#include "brokerage.h"

tb::Brokerage::Brokerage()
{
}

tb::Brokerage::~Brokerage()
{
}

std::tuple<bool>
tb::Brokerage::fetch()
{
}

std::vector<tb::Account>&
tb::Brokerage::getAccounts()
{
    return accounts;
}
