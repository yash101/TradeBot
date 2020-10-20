require('dotenv').config();
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

tdapi.fetchOnce = function(type, symbol) {
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
      return redirect(`https://auth.tdameritrade.com/auth?${redir_data}`);
    });

    erouter.get('/cburl', (req, res) => {
      const code = req.params['code'];
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

      const apiResp = await axios.post(
        'https://api.tdameritrade.com/v1/oauth/token',
        qs.stringify(params)
      );

      const blob = JSON.parse(apiResp.data);

      if (apiResp.status === 200) {
        res.send({
          refreshToken: blob.refresh_token,
          accessToken: blob.access_token,
          accessTokenExpiresIn: blob.expires_in,
          refreshTokenExpiresIn: blob.refreshTokenExpiresIn,
        }, 200);
      } else {
        res.send({
          status: 'failure',
          reason: 'failed to request authentication tokens',
          errorCode: apiResp.status,
          receivedData: blob,
          receivedHeaders: apiResp.headers
        }, 406);
      }
    });
  } else {
    console.info('Not activating td ameritrade login routes. Please define \"DEFAULT_TDAPI_CONSUMERKEY\" and \"DEFAULT_TDAPI_REDIRECTURI\" to activate these routes');
  }
})();

module.exports = { tdapi, erouter };
