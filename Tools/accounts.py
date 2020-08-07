from Authentication.tdconfig import Config
from Tools.trading import Position
import requests
import json

class Account():
    def __init__(self, data = None):
        self.accountId = None
        self.accountType = None

        self.positions = None

        self.roundTrips = None
        self.isDayTrader = None
        self.isClosingOnlyRestricted = None

        self.orderStrategies = None

        self.initialBalances = None
        self.currentBalances = None
        self.projectedBalances = None

    def importData(self, data):
        def get(k):
            if k in data:
                return data[k]
            else:
                return None

        self.accountId = get('accountId')
        self.accountType = get('type')
        self.roundTrips = get('roundTrips')
        self.isDayTrader = get('isDayTrader')
        

        self.accountId = data['accountId']
        self.accountType = data['type']
        self.roundTrips = data['roundTrips']
        self.isDayTrader = data['isDayTrader']
        self.isClosingOnlyRestricted = data['isClosingOnlyRestricted']

        self.positions = data['positions']

        self.orderStrategies = data['orderStrategies']

        self.initialBalances = data['initial']
    
    def getOrders(
        self,
        fetch = True,
        search_from = '',
        search_to = '',
        max_results = 10000
    ):
        return self.orderStrategies
    
    def cancelOrder(self, orderId):
        pass

    def placeOrder(self, order):
        pass

    def replaceOrder(self, replaceOrderId, order):
        pass

    def updateAccount(self):
        pass


class Accounts():
    def __init__(self):
        # API endpoint: https://api.tdameritrade.com/v1/accounts
        self.config = Config()
    
    def getAccounts(self):
        req = requests.get(
            'https://api.tdameritrade.com/v1/accounts',
            params = {'fields': 'positions,orders'},
            headers = {
                'Authorization': self.config.getAccessToken()
            }
        )

        blob = req.json()

        return blob

if __name__ == '__main__':
    a = Accounts()
    a.config.renewAccessToken() # make sure access token is valid
    with open('accounts.json', 'w') as f:
        json.dump(a.getAccounts(), f, indent = 4)