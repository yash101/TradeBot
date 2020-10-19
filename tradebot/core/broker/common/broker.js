
const BrokerAPI = function() {
  this.initialize = () => null;
  this.getAccoubts = () => null;
};

const Account = function() {
  this.initialize = () => null;
  this.getAccountInfo = async () => null;
  this.getActiveOrders = async () => null;
  this.cancelOrder = async (orderId) => null;
  this.replaceOrder = async (orderId, order) => null;
};

module.exports = { BrokerAPI, Account };
