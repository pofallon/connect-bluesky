/*!
 * connect-bluesky
 * Copyright(c) 2012 Paul O'Fallon<paul@ofallonfamily.com>
 * MIT Licensed
 */

var bluesky = require('bluesky');

module.exports = function(connect) {

  var Store = connect.session.Store;

  function BlueskyStore(options) {
    options = options || {};
    Store.call(this, options);
    this.table = new bluesky.storage({account: options.account, key: options.key}).table(options.table);
  };

  BlueskyStore.prototype.__proto__ = Store.prototype;

  BlueskyStore.prototype.get = function(sid, callback) {
    
    var params = [];
    params['PartitionKey'] = sid;
    params['RowKey'] = sid;
    
    this.table.filter(params).rows(function(err,rows) {
      try {
        if (err) {
          callback(err);
        }
        if (rows.length === 0) return callback();
        callback(null, JSON.parse(rows[0].data));
      } catch (err) {
        callback(err);
      }
    });
  };

  BlueskyStore.prototype.set = function(sid, sess, callback) {
    try {
      var data = JSON.stringify(sess);
      this.table.update(sid, sid, {'data':data}, {'upsert': true}, function(err) {
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
 
  BlueskyStore.prototype.destroy = function(sid, callback) {
    this.table.del(sid, sid, callback);
  };

  BlueskyStore.prototype.length = function(callback) {
    this.table.select(['PartitionKey']).rows().on('end', function(count) {
      callback(null,count);
    });
  };

  BlueskyStore.prototype.clear = function(callback) {
    var theTable = this.table;
    theTable.select(['PartitionKey','RowKey']).rows().on('data', function(row) {
      theTable.del(row.PartitionKey, row.RowKey);
    }, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null,true);
      }
    });
  };

  return BlueskyStore;
};