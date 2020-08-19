from Broker import TdAmeritrade

class TradeBotConfig():
    version = '0.0.0'
    
    brokerCredsFile = 'Credentials/tdameritrade.json'
    broker = TdAmeritrade.Broker

    repositoryLocation = '_Database'