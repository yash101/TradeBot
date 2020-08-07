from flask import Flask, redirect, url_for, request
import requests
import urllib
import json
import pprint

from Authentication.tdconfig import Config

if __name__ == "__main__":
    server = Flask(__name__)

    cfg = Config()

    # redirect to td ameritrade signin page
    @server.route('/')
    def redirectAuth():
        params = {
            'response_type': 'code',
            'redirect_uri': cfg.getRedirectUri(),
            'client_id': cfg.getConsumerKey()
        }

        query = urllib.parse.urlencode(params)

        return redirect(f'https://auth.tdameritrade.com/auth?{query}')

    # acquire the refresh token and access token
    @server.route('/token')
    def getTokens():
        code = request.args.get('code')
        print(code)

        params = {
            'grant_type': 'authorization_code',
            'access_type': 'offline',
            'refresh_token': '',
            'code': code,
            'client_id': cfg.getConsumerKey(),
            'redirect_uri': cfg.getRedirectUri()
        }

        req = requests.post(
            'https://api.tdameritrade.com/v1/oauth2/token',
            data = params
        )

        blob = req.json()

        access_token, refresh_token = blob['access_token'], blob['refresh_token']

        cfg.setAccessToken(access_token)
        cfg.setRefreshToken(refresh_token)

        return {'success': True}

    server.run('127.0.0.1', 9000, True)