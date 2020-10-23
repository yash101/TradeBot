const fs = require('fs');
const util = require('util');

const Configuration = function() {
  this.configFile = process.env.TRADEBOT_DATASOURCE_CONFIG || 'config.json';
  this.config = {};

  this.readConfig = function() {
    this.config = JSON.parse(fs.readFileSync(this.configFile));
  };

  this.writeConfig = function(data) {
    this.config = data;
    fs.writeFile(this.configFile, JSON.stringify(data));
  };

  this.updateConfig = function(base, cfg) {
    this.config[base] = cfg;
    this.writeConfig();
  };

  this.getConfig = function(base, cfg) {
    this.readConfig();
    return this.config[base];
  };
};

let globalCfg = Configuration();

module.exports = globalCfg;
