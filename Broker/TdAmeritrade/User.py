from TradeBot.Broker.User import User
from TradeBot.Broker.TdAmeritrade.Account import TdAccount

import requests

class TdUser(User):
    def __init__(self):
        pass

    def fetch(self):
        # get the user information
        req = requests.get(
            'https://api.tdameritrade.com/v1/userprincipals',
            params = {
                'fields': 'streamerSubscriptionKeys,streamerConnectionInfo,preferences,surrogateIds'
            },
            headers = {
                'Authorization': self.brokerage.authenticator.getAccessToken()
            }
        )

        blob = req.json()

        def get(k, b = blob):
            if k in b:
                return b[k]
            
            return None
        
        self.userId = get('userId')
        self.streamingInfo = get('streamerInfo')
        self.professional = get('professionalStatus')
        self.delayedQuotes = get('quotes')
        self.streamingKey = get('streamerSubscriptionKeys')['keys']['key']
        self.accountIds = [acct['accountId'] for acct in get('accounts')]

        self.accounts = []
        for acct in self.accountIds:
            a = TdAccount()
            a.brokerage = self.brokerage
            a.accountId = acct
            a.fetch()

            self.accounts.append(a)