class Position():
    def __init__(self):
        self.quantity = 0
        self.averagePrice = 0
        self.pl = 0
        self.pl_percent = 0
        self.marketValue = 0
        self.instrument = None


# these following classes will likely be discarded

class Equity():
    def __init__(
        self,
        tp = None,
        cusip = None,
        symbol = None,
        description = None,
    ):
        self.type = tp
        self.cusip = cusip
        self.symbol = symbol
        self.description = description

class FixedIncome():
    def __init__(
        self,
        tp = None,
        cusip = None,
        symbol = None,
        description = None,
        maturityDate = None,
        variableRate = None,
        factor = None
    ):
        self.type = tp
        self.cusip = cusip
        self.symbol = symbol
        self.description = description
        self.maturityDate = maturityDate
        self.variableRate = variableRate
        self.factor = factor

class MutualFund():
    def __init__(
        self,
        tp = None,
        cusip = None,
        symbol = None,
        description = None,
        mutualFundType = None
    ):
        self.type = tp,
        self.cusip = cusip,
        self.symbol = symbol,
        self.description = description,
        self.mutualFundType = mutualFundType

class CashEquivalent():
    def __init__(
        self,
        tp = None,
        cusip = None,
        symbol = None,
        description = None,
        cashEquivalentType = None
    ):
        self.type = tp,
        self.cusip = cusip,
        self.symbol = symbol,
        self.description = description,
        self.cashEquivalentType = cashEquivalentType

class Option():
    def __init__(
        self,
        tp = None,
        cusip = None,
        symbol = None,
        description = None,
        optionType = None,
        optionDirection = None,
        underlyingSymbol = None,
        optionMultiplier = None,
        optionDeliverableSymbol = None,
        optionDeliverableUnits = None,
        optionCurrencyType = None,
        optionAssetType = None
    ):
        self.type = tp,
        self.cusip = cusip,
        self.symbol = symbol,
        self.description = description,
        self.optionType = optionType,
        self.optionDirection = optionDirection,
        self.underlyingSymbol = underlyingSymbol,
        self.optionMultiplier = optionMultiplier,
        self.optionDeliverableSymbol = optionDeliverableSymbol,
        self.optionDeliverableUnits = optionDeliverableUnits,
        self.optionCurrencyType = optionCurrencyType,
        self.optionAssetType = optionAssetType

class OrderExecution():
    def __init__(
        self,
        activity = None,
        execution = None,
        quantity = None,
        remaining = None,
        executionLegs = []