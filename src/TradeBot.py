import argparse

from src.td_config import TdConfig
from src.tradebot_config import TradeBotConfig
from src.accounts import Account, Accounts

class TradeBot():
    def __init__(self):
        self.config = TradeBotConfig()          # initialize the tradebot configuration
        self.tdConfig = TdConfig()              # initialize the td ameritrade credentials manager
        self.accounts = Accounts(self.config)   # create the master accounts object

        self.updateAccounts()                   # fetch account information

    def updateAccounts(self):
        self.accounts.getAccounts(cached = False)

if __name__ == "__main__":
    pass