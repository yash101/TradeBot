import requests
import urllib
import json
import os

tdApiConfig = None
with open('credentials/tdameritrade.json', 'r') as f:
    tdApiConfig = json.load(f)



def getAccessToken(authorizationCode):
    params = {
        'grant_type': 'authorization_code',
        'access_type': 'offline',
        'refresh_token': '',
        'code': authorizationCode,
        'client_id': f'{tdApiConfig["consumer_key"]}@AMER.OAUTHAP',
        'redirect_uri': tdApiConfig['redirect_uri']
    }
    r = requests.post('https://api.tdameritrade.com/v1/oauth2/token', data=params).json()
    return (r['access_token'], r['refresh_token'])

def renewAccessToken(authorizationCode):
    params = {
        'grant_type': 'refresh_token',
        'refresh_token': ''
    }
    pass

def authenticate(token):
    # get all accounts accessible by token
    params = {
        'fields': ''
    }

    # get user info
    r = requests.get('https://api.tdameritrade.com/v1/userprincipals', params=params, headers={
        'Authorization': f'Bearer {token[0]}'
    })
    ret = r.json()

    dbname = f'database/user.json'
    
    with open(dbname, 'w') as user:
        json.dump(ret, user)