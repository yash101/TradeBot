const axios = require('axios').default;
const qs = require('querystring');
const express = require('express');

let erouter = express.Router();
let tdapi = function() {};

tdapi.supportedData = {
  streaming: [
    'optionChain',
    'stock',
    'etf',
  ],
  fetch: [
    'optionChain',
    'stock',
    'etf',
  ],
};

// todo: complete
tdapi.renewAccessToken = async function() {
  this.authentication = this.authentication || {};

  const req = {
    grant_type: 'authorization_code',
    refresh_token: this.internals.refreshToken,
    client_id: this.internals.consumerKey,
  };

  const res = this.axios.post(
    '/v1/oauth2/token',
    qs.stringify(req)
  ).catch(err => err);

  if (err instanceof Error) {
    console.error(err.message);
    return err;
  }

  return null;
};

// todo: complete
tdapi.renewRefreshToken = async function() {
  this.authentication = this.authentication || {};

  const req = {
    grant_type: 'refresh_token',
    access_type: 'offline',
    refresh_token: this.internals.refreshToken,
    client_id: this.internals.consumerKey,
  };

  const res = this.axios.post(
    '/v1/oauth2/token',
    qs.stringify(req)
  ).catch(err => err);

  if (err instanceof Error) {
    console.error(err.message);
    return err;
  }

  return null;
};


tdapi.initialize = async function(data, updateSaveDataCb) {
  this.internals = {
    consumerKey: data.consumerKey || process.env.DEFAULT_TDAPI_CONSUMERKEY || null,
    refreshToken: data.refreshToken || process.env.DEFAULT_TDAPI_REFRESHTOKEN || null,
    redirectUri: data.redirectUri || process.env.DEFAULT_TDAPI_REDIRECTURI || null,
    refreshTokenExpiry: data.refreshTokenExpiry || 0,
    accessTokenExpiry: data.accessTokenExpiry || 0,
    updateSaveDataCB: updateSaveDataCb || (async () => {}),
  };

  if (this.internals.consumerKey === null) {
    console.error('Consumer key was not provided');
    return null;
  }

  if (this.internals.refreshToken === null) {
    console.error('Refresh token was not provided')
    return null;
  }

  if (this.internals.redirectUri === null) {
    console.error('Redirect URI was not provided');
    return null;
  }

  this.axios = axios.create({
    baseURL: data.baseurl || process.env.DEFAULT_TDAPI_BASEURL || 'https://api.tdameritrade.com',
    timeout: data.timeout || process.env.DEFAULT_TDAPI_TIMEOUT || 3000,
  });

  // refresh the token to ensure it is valid
  await this.renewRefreshToken();
};

tdapi.fetchOnce = function(category, symbol, data) {
};

(() => {
  if (process.env.DEFAULT_TDAPI_CONSUMERKEY && process.env.DEFAULT_TDAPI_REDIRECTURI) {
    console.info('Activating td ameritrade login routes');

    // server to automatically authenticate
    erouter.get('/', (req, res) => {
      const params = {
        response_type: 'code',
        redirect_uri: process.env.DEFAULT_TDAPI_REDIRECTURI,
        client_id: process.env.DEFAULT_TDAPI_CONSUMERKEY,
      };

      const redir_data = qs.stringify(params);
      return res.redirect(`https://auth.tdameritrade.com/auth?${redir_data}`);
    });

    erouter.get('/cburl', async (req, res) => {
      const code = req.query.code;
      if (!code) {
        res.json({status: 'failure', reason: 'invalid code was provided or code was missing in the request'}, 400);
      }

      const params = {
        grant_type: 'authorization_code',
        access_type: 'offline',
        refresh_token: '',
        code: code,
        client_id: process.env.DEFAULT_TDAPI_CONSUMERKEY,
        redirect_uri: process.env.DEFAULT_TDAPI_REDIRECTURI,
      };

      const response = await axios({
        method: 'post',
        url: 'https://api.tdameritrade.com/v1/oauth2/token',
        data: qs.stringify(params),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        validateStatus: false,
      });

      let blob = response.data;

      const refTokenExp = new Date(Date.now());
      refTokenExp.setSeconds(refTokenExp.getSeconds() + (blob.refresh_token_expires_in * 0.90));
      const accTokenExp = new Date(Date.now());
      accTokenExp.setSeconds(accTokenExp.getSeconds() + (blob.expires_in * 0.90))

      if (response.status === 200) {
        res.send({
          tdameritrade_configuration: {
            consumerKey: process.env.DEFAULT_TDAPI_CONSUMERKEY,
            refreshToken: blob.refresh_token,
            accessToken: blob.access_token,
            redirectUri: process.env.DEFAULT_TDAPI_REDIRECTURI,
            refreshTokenExpiry: refTokenExp.getTime(),
            accessTokenExpiry: accTokenExp.getTime(),
          }
        }, 200);
      } else {
        res.send({
          status: 'failure',
          reason: 'failed to request authentication tokens',
          errorCode: response.status,
          receivedData: blob,
          receivedHeaders: response.headers
        }, 406);

        console.log('TD Ameritrade Configuration:', {
          consumerKey: process.env.DEFAULT_TDAPI_CONSUMERKEY,
          refreshToken: blob.refresh_token,
          accessToken: blob.access_token,
          redirectUri: process.env.DEFAULT_TDAPI_REDIRECTURI,
          refreshTokenExpiry: refTokenExp.getTime(),
          accessTokenExpiry: accTokenExp.getTime(),
        });
      }
    });
  } else {
    console.info('Not activating td ameritrade login routes. Please define \"DEFAULT_TDAPI_CONSUMERKEY\" and \"DEFAULT_TDAPI_REDIRECTURI\" to activate these routes');
  }
})();

module.exports = { API: tdapi, Router: erouter };
