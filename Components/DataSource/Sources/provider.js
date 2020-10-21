const Provider = function() {
  this.sources = [];

  this.addSource = function(source) {
    this.sources.push(source);
  };

  this.request = async function(category, symbol, data) {
    this.providers.forEach((source) => {
      if (source &&
          source.supportedData &&
          source.supportedData.fetch &&
          source.supportedData.fetch.includes(category)) {
        try {
          // request data from the provider
          const resp = source.fetch(category, symbol, data);
          if (!resp)
            continue;
          
          return resp;
        } catch(error) {
          console.error(error);
        }
      }
    });
  };

  this.subscribe = async function(category, symbol, specifics, callback) {
  };
};

module.exports = Provider;
