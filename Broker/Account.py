from enum import Enum

class AccountType(Enum):
    UNDEFINED = 0
    CASH = 1
    MARGIN = 2

class Account():
    def __init__(
        self,
        accountIdentifier = None,
        nonMarginBuyingPower = 0,
        totalBuyingPower = 0,
        accountValue = 0,
        dayTradingAllowed = False,
        dayTradesAvailable = 0,
        positions = [],
        accountType = AccountType.CASH
    ):
        self.account_identifier = accountIdentifier

        self.non_margin_buying_power = nonMarginBuyingPower
        self.total_buying_power = totalBuyingPower
        self.account_value = accountValue
        
        self.day_trading_allowed = dayTradingAllowed
        self.day_trades_available = dayTradesAvailable

        self.account_type = accountType

        self._positions = []
    
    def fetchUpdates(self):
        pass

    def accountIdentifier(self, newId = None):
        if newId is not None:
            self.account_identifier = newId
        
        return self.account_identifier
    
    def nonMarginBuyingPower(self, bp = None):
        if bp is not None:
            self.non_margin_buying_power = bp
        
        return self.non_margin_buying_power
    
    def totalBuyingPower(self, bp = None):
        if bp is not None:
            self.total_buying_power = bp
        
        return self.total_buying_power
    
    def accountValue(self, val = None):
        if val is not None:
            self.account_value = val
        
        return self.account_value
    
    def dayTradingAllowed(self, allowed = None):
        if allowed is not None:
            self.day_trading_allowed = allowed
        
        return self.day_trading_allowed
    
    def dayTradesAvailable(self, avail = None):
        if avail is not None:
            self.day_trades_available = avail

        return self.day_trades_available
    
    def accountType(self, tp = None):
        if tp is not None:
            self.account_type = tp
        
        return self.account_type
    
    def positions(self):
        return self.positions
    