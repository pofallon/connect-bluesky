/*!
 * connect-bluesky
 * Copyright(c) 2012 Paul O'Fallon<paul@ofallonfamily.com>
 * MIT Licensed
 */

var bluesky = require('bluesky');

var cleanString = function(sid) {
  return(sid.replace(/[^0-9A-Za-z]/g,''));
}

module.exports = function(connect) {

  var Store = connect.session.Store;

  function BlueskyStore(options) {
    options = options || {};
    Store.call(this, options);
    this.storage = bluesky.storage({account: options.account, key: options.key});
    this.table = this.storage.table(options.table);

    // Just in case it doesn't already exist
    this.storage.createTable(options.table);
  };

  BlueskyStore.prototype.__proto__ = Store.prototype;

  BlueskyStore.prototype.get = function(sid, callback) {
    
    var cleanSid = cleanString(sid);

    var params = [];
    params['PartitionKey'] = cleanSid;
    params['RowKey'] = cleanSid;
    
    this.table.whereKeys(cleanSid, cleanSid).rows(function(err, rows) {

      if(err && err.code != "ResourceNotFound") {
          console.log(err);
          callback(err);
      } else {
          if(rows) {
              callback(null, JSON.parse(rows[0].data));
          } else {
              callback(null);
          }
      }

    });
  };

  BlueskyStore.prototype.set = function(sid, sess, callback) {

    var cleanSid = cleanString(sid);
    
    try {
      var data = JSON.stringify(sess);
      this.table.update(cleanSid, cleanSid, {'data':data}, {'upsert': true}, function(err) {
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
    sid = cleanString(sid);
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
