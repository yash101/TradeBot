#!/usr/bin/env python3

from flask import Flask, redirect, url_for
import flask
import requests
import urllib
import json
import pprint

import TdApi

app = Flask(__name__)
tdApiConfig = None
with open('credentials/tdameritrade.json', 'r') as f:
    tdApiConfig = json.load(f)

@app.route('/')
def main():
    return 'Nothing Here :('

@app.route('/api')
def apiMain():
    return 'Nothing here :('

@app.route('/api/login')
def apiLogin():
    tdApiAuthUrl = 'https://auth.tdameritrade.com/auth'
    v = urllib.parse.urlencode({
        'response_type': 'code',
        'redirect_uri': tdApiConfig['redirect_uri'],
        'client_id': f'{tdApiConfig["consumer_key"]}@AMER.OAUTHAP'
    })
    return redirect(f'{tdApiAuthUrl}?{v}')

@app.route('/api/login_redirect')
def apiLoginRedirect():
    code = flask.request.args.get('code')

    token = TdApi.getAccessToken(code)
    TdApi.authenticate(token)

    return 'login successful'

@app.route('/api/auth/refresh_bearer')
def apiRefreshBearer():
    pass

@app.route('/api/auth/refresh_refreshtoken')
def apiRefreshRefresh():
    pass

app.run('127.0.0.1', 5378, True)
