const axios = require('axios');
const urljoin = require('url-join');

require('dotenv').config();

const tdapi_baseurl = process.env.TDAMERITRADE_API_URL || 'https://api.tdameritrade.com';
const tdurl = function(path) {
  return urljoin(tdapi_baseurl, path);
}

const Account = function(tdameritrade, accountno) {

  this.update = async function() {};

  this.getActiveOrders = async function() {};
  this.createOrder = async function(order) {};
  this.cancelOrder = async function(orderId) {};
  this.replaceOrder = async function(orderId, newOrder) {};

  this.accountInfo = function() {};
};

const TdAPI = function(consumerKey, refreshToken, refreshTokenExpiry) {
  this.accounts = [];
  this.refreshToken = refreshToken;
  this.accessToken = null;
  this.refreshExpiry = null;
  this.accessTokenExpiry = null;

  this.renewRefreshToken = async () => {
  };

  this.renewAccessToken = async () => {
  };

  this.fetchAccounts = async () => {
  };

  this.getAccounts = async () => this.accounts;
};

const TdDataAPI = function(tdapi) {
  this.fundamentals = async (symbol) => {};
  this.priceHistory = async (symbol, period, periodType, frequencyType) => {}
};

module.exports = { TdAPI: TdAPI, Account: Account };
