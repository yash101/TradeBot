from Repository.Storage import Storage

import requests
from enum import Enum

class PeriodType(Enum):
    NONE = 0
    DAY = 1
    MONTH = 2
    YEAR = 2

class FrequencyType(Enum):
    MINUTE = 0
    

class Repository():
    def getStockHistory(
        self,
        symbol,
        timeFrom,
        periodType,
        periods
    ):
        periodLookup = {
            PeriodType.NONE: 'day',
            PeriodType.DAY: 'day',
            PeriodType.MONTH: 'month',
            PeriodType.YEAR: 'year'
        }



    def getOptionHistory(
        self,
        symbol,
        timeFrom,
        timeTo,
        strike,
        expiration
    ):
        pass