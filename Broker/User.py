class User():
    def __init__(
        self,
        brokerage
    ):
        self.brokerage = brokerage
        self.userId = None
        self.accounts = []

    
    def fetch(self):
        pass