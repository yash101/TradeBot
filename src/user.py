from Authentication.tdconfig import Config
from Tools.accounts import Accounts
import requests

class User():
    def __init__(self):
        self.config = Config()
        self.accounts = Accounts()
        self.preferences = None
    
    def fetchUserPrincipals(self):
        req = requests.get(
            'https://api.tdameritrade.com/v1/userprincipals',
            params = {'fields': 'streamerSubscriptionKeys,streamerConnectionInfo,preferences,surrogateIds'},
            headers = {'Authorization': self.config.getAccessToken()}
        )

        blob = req.json()

        self.principals = blob