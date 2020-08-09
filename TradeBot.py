from Config import TradeBotConfig

class TradeBot():
    def __init__(self):
        self.broker = TradeBotConfig.broker(TradeBotConfig.brokerCredsFile)
    
    def initializeBroker(self):
        self.broker.authenticator.loadCredentials()

        if self.broker.authenticator.requiresAuthentication():
            self.broker.authenticator.performAuthentication()