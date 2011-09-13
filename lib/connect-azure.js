/*!
 * connect-azure
 * Copyright(c) 2011 Paul O'Fallon<paul@ofallonfamily.com>
 * MIT Licensed
 */

var azure = require('azure');

module.exports = function(connect) {

  var Store = connect.session.Store;

  function AzureStore(options) {
    options = options || {};
    Store.call(this, options);
    this.table = new azure.storage({account: options.account, key: options.key}).table(options.table);
  };

  AzureStore.prototype.__proto__ = Store.prototype;

  AzureStore.prototype.get = function(sid, callback) {
    this.table.query({'PartitionKey':sid, 'RowKey':sid}).all(function(err,rows) {
      try {
        if (rows.length === 0) return callback();
        callback(null, JSON.parse(rows[0].data));
      } catch (err) {
        callback(err);
      }
    });
  };

  AzureStore.prototype.set = function(sid, sess, callback) {
    try {
      var data = JSON.stringify(sess);
      this.table.insert(sid, sid, {'data':data}, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null,true);
        }
      });
    } catch (err) {
      callback(err);
    }
  };
 
  AzureStore.prototype.destroy = function(sid, callback) {
    this.table.del(sid, sid, callback);
  };

  // This works, in theory, but is not very performant
  AzureStore.prototype.length = function(callback) {
    this.table.query().forEach(null,callback);
  };

  AzureStore.prototype.clear = function(callback) {
    var theTable = this.table;
    theTable.query().forEach(function(err, row) {
      theTable.del(row.PartitionKey, row.RowKey);
    }, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null,true);
      }
    });
  };

  return AzureStore;
};
