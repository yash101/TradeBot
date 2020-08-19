from TradeBot.Config import TradeBotConfig as Config

from os import path

class Storage():
    def __init__(self):
        self.data_path = Config.repositoryLocation
    
    def getStock(
        self
    ):
        pass