const axios = require('axios');
const urljoin = require('url-join');
const { BrokerAPI, Account } = require('../common/broker');

require('dotenv').config();

const tdapi_baseurl = process.env.TDAMERITRADE_API_URL || 'https://api.tdameritrade.com';
const tdurl = function(path) {
  return urljoin(tdapi_baseurl, path);
}

const Account = function(tdameritrade, accountno) {

  this.update = async () {};

  this.getActiveOrders = async () => {};
  this.createOrder = async (order) => {};
  this.cancelOrder = async (orderId) => {};
  this.replaceOrder = async (orderId, newOrder) => {};

  this.accountInfo = async () => {};
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

  this.getAccounts = async () => this.accounts;
};

const TdDataAPI = function(tdapi) {
  this.fundamentals = async (symbol) => {};
  this.priceHistory = async (symbol, period, periodType, frequencyType) => {};
};

module.exports = { TdAPI, Account, TdDataAPI };
