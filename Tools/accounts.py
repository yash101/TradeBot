from Authentication.tdconfig import Config
from Tools.trading import Position
import requests
import json

class Account():
    def __init__(self):
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