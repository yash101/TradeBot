from TradeBot.Broker.Broker import Broker as BaseBroker
from TradeBot.Broker.TdAmeritrade.Authentication import Authentication as TdAuthentication
from TradeBot.Broker.TdAmeritrade.Configuration import Config as TdConfig

class Broker(BaseBroker):
    def __init__(self, credsLocation):
        self.authenticator = TdAuthentication()
        self.configuration = TdConfig()

        self.authenticator.credsLocation = credsLocation