var fs = require('fs')
  , assert = require('assert')
  , connect = require('connect')
  , AzureStore = require('./')(connect);

var path = process.env.HOME || (process.env.HOMEDRIVE + process.env.HOMEPATH);
var testCredentials = JSON.parse(fs.readFileSync(path + '/.azurejs/test.json','ascii'));
var account = testCredentials.account;
var key = testCredentials.key;
var table1 = 'connect';
var table2 = 'connect2';

var store = new AzureStore({account: account, key: key, table: table1});
var store_alt = new AzureStore({account: account, key: key, table: table2});

  // #set()
  store.set('123', { cookie: { maxAge: 2000 }, name: 'paul' }, function(err, ok){
    assert.ok(!err, '#set() got an error: ' + err);
    assert.ok(ok, '#set() is not ok');
    
    // #get()
    store.get('123', function(err, data){
      assert.ok(!err, '#get() got an error: ' + err);
      assert.deepEqual({ cookie: { maxAge: 2000 }, name: 'paul' }, data);
  
      // #length()
      store.length(function(err, len){
        assert.ok(!err, '#length() got an error');
        assert.equal(1, len, '#length() with keys');

        // #db option
        store_alt.length(function (err, len) {
          assert.ok(!err, '#alt db got an error');
          assert.equal(0, len, '#alt db with keys'); 

          // #clear()
          store.clear(function(err, ok){
            assert.ok(!err, '#clear()');
            assert.ok(ok, '#clear()');

            // #length()
            store.length(function(err, len){
              assert.ok(!err, '#length()');
              assert.equal(0, len, '#length() without keys');

              // #set null
              store.set('123', { cookie: { maxAge: 2000 }, name: 'paul' }, function(){
                store.destroy('123', function(){
                  store.length(function(err, len){
                   assert.equal(0, len, '#set() null');
                   console.log('done');
                  });
                });
              });
            });
          });
        });
      });
    })
  });
