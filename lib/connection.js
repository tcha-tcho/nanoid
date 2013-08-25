var nano = require('nano'),
    db;

module.exports.create_connection = function (options) {
  if (typeof(options) === 'string') {
    // db = new (cradle.Connection)().database(options);

    // db = new (cradle.Connection)().database(options);
    db = require("nano")(options);

    return db;
  }

  var _options = {},
      db_name = options.db,
      url = options.url,
      port = options.port;

  _options.secure = options.secure || false;
  _options.auth   = options.auth;
  _options.cache  = options.cache  || false;

  // db = new (cradle.Connection)(url,port, _options).database(db_name);
  db = require("nano")(url+port+db_name+_options);

  return db;
};


module.exports.connection = function () {
  return db;
};


