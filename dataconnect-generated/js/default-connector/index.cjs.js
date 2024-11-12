const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Sport',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

