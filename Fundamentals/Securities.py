from enum import Enum

class SecurityType(Enum):
    UNDEFINED = 0
    EQUITY = 1
    MUTUAL_FUND = 2
    FIXED_INCOME = 3
    CASH = 4
    OPTION = 5

class Security():
    def __init__(self):
        self.type = None
        self._symbol = None
        self._description = None

    def securityType(self, update = None):
        if update is not None:
            self.type = update
        
        return self.type
    
    def symbol(self, update = None):
        if update is not None:
            self._symbol = update
        
        return self._symbol
    
    def description(self, update = None):
        if update is not None:
            self._description = update
        
        return self._description

class Equity(Security):
    def __init__(self):
        self.securityType(SecurityType.EQUITY)

class MutualFund(Security):
    def __init__(self):
        self.securityType(SecurityType.MUTUAL_FUND)
        self.mutual_fund_type = None
    
    def mutualFundType(self, newType = None):
        if newType is not None:
            self.mutual_fund_type = newType
        
        return self.mutual_fund_type

class Cash(Security):
    def __init__(self):
        self.securityType(SecurityType.CASH)

class FixedIncome(Security):
    def __init__(self):
        self.securityType(SecurityType.FIXED_INCOME)
        self.maturity_date = None
        self.variable_rate = 0
        self._factor = 0
    
    def maturityDate(self, newDate = None):
        if newDate is not None:
            self.maturity_date = newDate
        
        return self.maturity_date
    
    def variableRate(self, newRate = None):
        if newRate is not None:
            self.variable_rate = newRate
    
    def factor(self, newFactor = None):
        if newFactor is not None:
            self._factor = newFactor

class OptionDirection(Enum):
    CALL = 0
    PUT = 1

class Option(Security):
    def __init__(self):
        self.securityType(SecurityType.OPTION)
        self.option_type = None
        self.strike_price = 0
        self.underlying_symbol = None
    
    def optionType(self, newType = None):
        if newType is not None:
            self.option_type = newType
        
        return self.option_type
    
    def strike(self, newStrike = None):
        if newStrike is not None:
            self.strike_price = newStrike
        
        return self.strike_price
    
    def underlyingSymbol(self, newSymbol = None):
        if newSymbol is not None:
            self.underlying_symbol = newSymbol
        
        return self.underlying_symbol

class Position():
    def __init__(self):
        self.shortQuantity = 0
        self.longQuantity = 0
        self.security = None
        self.currentPrice = 0
        self.averageOpenPrice = 0
        