from TradeBot.BuildingBlocks.Securities import Security, SecurityType, Position
from enum import Enum

class OptionDirection(Enum):
    LONG_CALL = 0
    LONG_PUT = 1
    SHORT_CALL = 2
    SHORT_PUT = 3

class Option(Security):
    def __init__(self):
        self.securityType(SecurityType.OPTION)
        self.option_type = None
        self.strike_price = 0
        self.underlying_symbol = None
        self._premium = 0
    
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
    
    def premium(self, newPremium = None):
        if newPremium is not None:
            self._premium = newPremium
        
        return self._premium

class OptionStrategy():
    def __init__(self):
        self.options = []

    def single(self, strike, symbol, tp, premium = 0):
        self.options = [Option()]
        self.options[0].strike(strike)
        self.options[0].symbol(symbol)
        self.options[0].underlyingSymbol(symbol)
        self.options[0].optionType(tp)
        self.options[0].premium(premium)


        if tp == OptionDirection.LONG_CALL:
            return {
                'max_loss': premium,
                'max_gain': 10000000,
                'breakeven': strike + premium
            }
        elif tp == OptionDirection.LONG_PUT:
            return {
                'max_loss': premium,
                'max_gain': 10000000,
                'breakeven': strike - premium
            }
        elif tp == OptionDirection.SHORT_CALL:
            return {
                'max_loss': 10000000,
                'max_gain': premium,
                'breakeven': strike + premium
            }
        elif tp == OptionDirection.SHORT_PUT:
            return {
                'max_loss': 10000000,
                'max_gain': premium,
                'breakeven': strike - premium
            }

    
    def bullCallSpread(self, shortStrike, longStrike, shortPremium, longPremium, symbol):
        self.options = [Option()] * 2

        self.options[0].strike(shortStrike)
        self.options[0].optionType(OptionDirection.SHORT_CALL)
        self.options[0].symbol(symbol)
        self.options[0].underlyingSymbol(symbol)
        self.options[0].premium(shortPremium)

        self.options[1].strike(longStrike)
        self.options[1].optionType(OptionDirection.LONG_CALL)
        self.options[1].symbol(symbol)
        self.options[1].underlyingSymbol(symbol)
        self.options[1].premium(longPremium)

        return {
            'max_loss': shortPremium + longPremium,
            'max_profit': shortStrike - longStrike - (shortPremium + longPremium),
            'breakeven': longStrike + shortPremium + longPremium
        }