const Configuration = require('./configuration');
const provider = require('./Sources/provider');
const TdAmeritrade = require('./Sources/tdameritrade');

let Provider = provider();

TdAPI = TdAmeritrade.API();
TdAPI.initialize(
  Configuration.getConfig('tdameritrade'),
  (data) => { Configuration.setConfig('tdameritrade', data); }
);
Provider.addSource(TdAPI);

// also add the FRED data source
module.exports = Provider;
