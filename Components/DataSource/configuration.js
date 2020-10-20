const fs = require('fs');
const util = require('util');

const Configuration = async function() {
  this.configFile = process.env.TRADEBOT_DATASOURCE_CONFIG || 'config.json';
  this.config = {};

  this.readConfig = async () => {
    const file = util.promisify(fs.readFile)(configFile);
  };
};