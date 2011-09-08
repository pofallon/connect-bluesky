/*!
 * connect-azure
 * Copyright(c) 2011 Paul O'Fallon<paul@ofallonfamily.com>
 * MIT Licensed
 */

var storage = require('azure').storage;

var partitionKey = "caz";

module.exports = function(connect) {

  var Store = connect.session.Store;

  function AzureStore(options) {
    options = options || {};
    Store.call(this, options);
    this.table = new storage.table(options.account, options.key, options.table);
  };

  AzureStore.prototype.__proto__ = Store.prototype;

  AzureStore.prototype.get = function(sid, callback) {
    this.table.query({'PartitionKey':partitionKey, 'RowKey':sid}).all(function(err,rows) {
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
      this.table.insert(partitionKey, sid, {'data':data}, function(err) {
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
    this.table.del(partitionKey, sid, callback);
  };

  AzureStore.prototype.length = function(callback) {
    this.table.query({'PartitionKey':partitionKey}).forEach(null,callback);
  };

  AzureStore.prototype.clear = function(callback) {
    var theTable = this.table;
    theTable.query({'PartitionKey':partitionKey}).forEach(function(err, row) {
      theTable.del(partitionKey, row.RowKey);
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
