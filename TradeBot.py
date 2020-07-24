#!/usr/bin/env python3

from flask import Flask
import requests

app = Flask(__name__)

@app.route('/')
def main():
    return 'Nothing Here :('

@app.route('/api')
def apiMain():
    return 'Nothing here :('

@app.route('/api/initialize')
def apiInitialize():
    tdApiAuthUrl = 'https://auth.tdameritrade.com/auth'
    r = requests.get(tdApiAuthUrl, {
        
    })
    return 'API Initialized'

app.run('127.0.0.1', 5378, True)
