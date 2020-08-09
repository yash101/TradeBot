class Authentication():
    def __init__(self):
        self.credsLocation = None
    
    def loadCredentials(self, credsLocation = None):
        pass

    def writeCredentials(self, credsLocation = None):
        pass

    def requiresAuthentication(self):
        return True