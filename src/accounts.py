import requests
import json

from src.td_config import TdConfig

class Account():
    def __init__(self, data = None, tdcred = None):
        self.tdcred = tdcred

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

        if data is not None:
            self.importData(data)

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
        

        self.accountId = get('accountId')
        self.accountType = get('type')
        self.accountType = get('type')
        self.roundTrips = get('roundTrips')
        self.isDayTrader = get('isDayTrader')
        self.isClosingOnlyRestricted = get('isClosingOnlyRestricted')

        self.positions = get('positions')

        self.orderStrategies = get('orderStrategies')

        self.initialBalances = get('initialBalances')
        self.currentBalances = get('currentBalances')
        self.projectedBalances = get('projectedBalances')
    
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
        uri = f'https://api.tdameritrade.com/v1/accounts/{self.accountId}'
        req = requests.get(
            uri,
            params = {'fields': 'positions,orders'},
            headers = {'Authorization': self.tdcred.getAccessToken()}
        )

        print(req.json())

        self.importData(req.json())

class Accounts():
    def __init__(self, tdconfig):
        self.tdcred = tdconfig
        self.accounts = None
    
    def getAccounts(self, cached = False, raw = False):
        if not cached or self.accounts is None:
            print('sending request')
            req = requests.get(
                'https://api.tdameritrade.com/v1/accounts',
                params = {'fields': 'positions,orders'},
                headers = {
                    'Authorization': self.tdcred.getAccessToken()
                }
            )

            self.accountsRaw = req.json()
            self.accounts = [
                Account(
                    tdcred = self.tdcred,
                    data = acct['securitiesAccount']
                ) for acct in self.accountsRaw
            ]

            if raw:
                return self.accountsRaw
            
        return self.accounts

if __name__ == '__main__':
    cfg = TdConfig()
    cfg.renewAccessToken()
    a = Accounts(cfg)
    with open('accounts.json', 'w') as f:
        json.dump(a.getAccounts(raw = True, cached = False), f, indent = 4)