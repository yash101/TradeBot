import argparse

from src.td_config import TdConfig
from src.tradebot_config import TradeBotConfig

class TradeBot():
    def __init__(self):
        self.tdConfig = TdConfig()
        self.config = TradeBotConfig()

if __name__ == "__main__":
    pass