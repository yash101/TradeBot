import json
import requests
import http

from TradeBot.Broker.Authentication import Authentication as BrokerAuthentication
from Configuration import Config as TdConfig

class Authentication(BrokerAuthentication):
    def __init__(self):
        self.consumer_key = None
        self.refresh_token = None
        self.access_token = None

    def loadCredentials(self, credsLocation = None):
        if credsLocation is None:
            credsLocation = self.credsLocation

        with open(credsLocation, 'r') as f:
            j = json.load(f)
            self.consumer_key = j['consumer_key']
            self.refresh_token = j['refresh_token']
            self.access_token = j['access_token']
    
    def writeCredentials(self, credsLocation = None):
        if credsLocation is None:
            credsLocation = self.credsLocation
        
        with open(credsLocation, 'w') as f:
            json.dump({
                'consumer_key': self.consumer_key,
                'refresh_token': self.refresh_token,
                'access_token': self.access_token
            }, f)
    
    def requiresAuthentication(self):
        # check with td ameritrade to see if authentication is required
        if self.consumer_key is None or self.refresh_token is None:
            return False

        return self.renewRefreshToken()
    
    # authenticate the user by logging them in
    def performAuthentication(self):
        print('Please use the TD Ameritrade authenticator to authenticate')
    
    def getConsumerKey(self, ending = True):
        if ending:
            return f'{self.access_token}@AMER.OAUTHAP'
        return self.consumer_key
    
    def getRefreshToken(self):
        return self.refresh_token
    
    def getAccessToken(self):
        return self.access_token
    
    def setConsumerKey(self, k):
        self.consumer_key = k
        self.writeCredentials()
    
    def setRefreshToken(self, k):
        self.refresh_token = k
        self.writeCredentials()
    
    def setAccessToken(self, k):
        self.access_token = k
        self.writeCredentials()

    def getBearer(self):
        return 'Bearer ' + self.access_token

    def renewAccessToken(self):
        params = {
            'grant_type': 'refresh_token',
            'refresh_token': self.refresh_token,
            'access_type': 'offline',
            'client_id': self.getConsumerKey(),
            'redirect_uri': TdConfig.redirect_uri
        }

        req = requests.post(
            'https://api.tdameritrade.com/v1/oauth2/token',
            data = params
        )

        blob = req.json()

        if 'access_token' not in blob:
            return False

        self.setAccessToken(blob['access_token'])
        return True

    def renewRefreshToken(self):
        params = {
            'grant_type': 'refresh_token',
            'refresh_token': self.getRefreshToken(),
            'access_type': 'offline',
            'client_id': self.getConsumerKey(),
            'redirect_uri': TdConfig.redirect_uri 
        }

        req = requests.post(
            'https://api.tdameritrade.com/v1/oauth2/token',
            data = params
        )

        blob = req.json()

        if 'access_token' not in blob or 'refresh_token' not in blob:
            return False

        self.setAccessToken(blob['access_token'])
        self.setRefreshToken(blob['refresh_token'])

        return True