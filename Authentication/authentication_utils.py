import json
import requests

class Config():
    def __init__(self):
        self.config = {
            'consumer_key': '',
            'redirect_url': '',
            'access_token': '',
            'refresh_token': ''
        }

    def getConfigUri(self):
        return '../Credentials/tdameritrade.json'

    def readConfig(self):
        with open(self.getConfigUri(), 'r') as f:
            self.config = json.load(f)
    
    def writeConfig(self):
        with open(self.getConfigUri(), 'w') as f:
            json.dump(self.config, f)

    def getConsumerKey(self):
        self.readConfig()
        return self.config['consumer_key']
    
    def setConsumerKey(self, k):
        self.readConfig()
        self.config['consumer_key'] = k
        self.writeConfig()
    
    def getRedirectUri(self):
        self.readConfig()
        return self.config['redirect_url'] + '@AMER.OAUTHAP'
    
    def setRedirectUri(self, u):
        self.readConfig()
        self.config['redirect_url'] = u
        self.writeConfig()
    
    def getAccessToken(self):
        self.readConfig()
        return self.config['access_token']
    
    def setAccessToken(self, t):
        self.readConfig()
        self.config['access_token'] = t
        self.writeConfig()
    
    def getRefreshToken(self):
        self.readConfig()
        return self.config['refresh_token']

    def setRefreshToken(self, t):
        self.readConfig()
        self.config['refresh_token'] = t
        self.writeConfig()
    
    def renewAccessToken(self):
        params = {
            'grant_type': 'authorization_code',
            'refresh_token': self.getRefreshToken(),
            'client_id': self.getConsumerKey()
        }

        req = requests.post(
            'https://api.tdameritrade.com/v1/oauth2/token',
            data = params
        )

        blob = req.json()

        self.setAccessToken(blob['access_token'])

    def renewRefreshToken(self):
        params = {
            'grant_type': 'refresh_token',
            'refresh_token': self.getRefreshToken(),
            'access_type': 'offline',
            'client_id': self.getConsumerKey()
        }

        req = requests.post(
            'https://api.tdameritrade.com/v1/oauth2/token',
            data = params
        )

        blob = req.json()

        self.setAccessToken(blob['access_token'])
        self.setRefreshToken(blob['refresh_token'])