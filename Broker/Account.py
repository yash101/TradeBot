from enum import Enum

class AccountType(Enum):
    UNDEFINED = 0
    CASH = 1
    MARGIN = 2

class Account():
    def __init__(
        self,
        broker,
        accountIdentifier = None,
        nonMarginBuyingPower = 0,
        totalBuyingPower = 0,
        accountValue = 0,
        dayTradingAllowed = False,
        dayTradesAvailable = 0,
        positions = [],
        accountType = AccountType.UNDEFINED
    ):
        self.brokerage = broker
        self.accountId = accountIdentifier
        self.nonMarginBuyingPower = nonMarginBuyingPower
        self.totalBuyingPower = totalBuyingPower
        self.accountValue = accountValue
        self.dayTradingAllowed = dayTradingAllowed
        self.dayTradesAvailable = dayTradesAvailable
        self.accountType = accountType

        self.positions = []
    
    def fetch(self):
        pass