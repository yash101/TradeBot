from Config import TradeBotConfig

class TradeBot():
    def __init__(self):
        self.broker = TradeBotConfig.broker(TradeBotConfig.brokerCredsFile)
    
    def initializeBroker(self):
        self.broker.authenticator.loadCredentials()

        # authenticates
        if self.broker.authenticator.requiresAuthentication():
            self.broker.authenticator.performAuthentication()
        else:
            return False
        
        