from enum import Enum

class AccountType(Enum):
    UNDEFINED = 0
    CASH = 1
    MARGIN = 2

class Account():
    def __init__(self):
        self.nonMarginBuyingPower = 0
        self.totalBuyingPower = 0
        self.accountValue = 0
        
        self.dayTradingAllowed = False
        self.dayTradesAvailable = 0

        self.accountType = AccountType.CASH

        self.positions = []