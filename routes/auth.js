const express = require('express');
const axios = require('axios');
const cfg = require('../config');
const fs = require('fs');
const qs = require('qs');

let app = require('../app');

let router = express.Router();
let tdCred = null;

fs.readFile('credentials/tdameritrade.json', (err, data) => {
    tdCred = JSON.parse(data);
});

let writeTdCredentials = function() {
    fs.writeFileSync('credentials/tdameritrade.json', JSON.stringify(tdCred));
};

/**
 * \brief Begins login with TD Ameritrade
 */
router.get('/', async (req, res, next) => {
    // no code was provided
    if (!req.query.code) {
        // redirect to td ameritrade signin page
        let params = {
            'response_type': 'code',
            'redirect_uri': cfg['domain'] + '/auth',
            'client_id': tdCred.consumer_key + '@AMER.OAUTHAP'
        };

        let baseApiUrl = 'https://auth.tdameritrade.com/auth';
        let redirectUrl = new URL(baseApiUrl);
        redirectUrl.search = new URLSearchParams(params);

        res.redirect(302, redirectUrl.toString());

    } else { // code was provided
        let code = req.query.code;

        // get the access and refresh token
        let params = {
            'grant_type': 'authorization_code',
            'access_type': 'offline',
            'code': code,
            'client_id': `${tdCred.consumer_key}@AMER.OAUTHAP`,
            'redirect_uri': cfg['domain'] + '/auth'
        };

        try {
            const resp = await axios({
                method: 'post',
                url: 'https://api.tdameritrade.com/v1/oauth2/token',
                data: qs.stringify(params),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });

            app.accessToken = resp.data.access_token;
            tdCred.refreshToken = resp.data.refresh_token;

            writeTdCredentials();

            res.send(`access token: ${accessToken}\nrefresh token: ${tdCred.refreshToken}`);

        } catch(err) {
            res.status(401);
            res.json(err);
        }
    }
});

/**
 * \brief refresh the access (bearer) token
 */
router.get('/refresh_access_token', async (req, res, next) => {
    let params = {
        'grant_type': 'refresh_token',
        'refresh_token': tdCred.refreshToken,
        'client_id': `${tdCred.consumer_key}@AMER.OAUTHAP`
    }

    try {
        const resp = await axios({
            method: 'post',
            url: 'https://api.tdameritrade.com/v1/oauth2/token',
            data: qs.stringify(params),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });

        app.accessToken = resp.data.access_token;

        res.json(resp.data);
    } catch(err) {
        res.status(401);
        res.json(err);
    }
});

/**
 * \brief refresh the refresh token
 */
router.get('/refresh_refresh_token', async (req, res, next) => {
    let params = {
        'grant_type': 'refresh_token',
        'refresh_token': tdCred.refreshToken,
        'access_type': 'offline',
        'client_id': `${tdCred.consumer_key}@AMER.OAUTHAP`
    }

    try {
        const resp = await axios({
            method: 'post',
            url: 'https://api.tdameritrade.com/v1/oauth2/token',
            data: qs.stringify(params),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });

        app.accessToken = resp.data.access_token;
        tdCred.refreshToken = resp.data.refresh_token;

        res.json(resp.data);
    } catch(err) {
        res.status(401);
        res.json(err);
    }
});

module.exports = router;