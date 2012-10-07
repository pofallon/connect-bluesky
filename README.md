# connect-bluesky #

connect-bluesky is a node.js connect/express session store backed by the [bluesky](https://github.com/pofallon/node-bluesky) API for Windows Azure.

## Installation ##
```
$ npm install connect-bluesky
```

## Usage ##
```javascript
var express = require('express'),
    BlueskyStore = require('connect-bluesky')(express);

app.configure(function() { 
  // ...
  app.use(express.cookieParser()); 
  app.use(express.session({
    secret: 'your secret here', 
    store: new BlueskyStore({
      account: 'yourAzureAccount',
      key: 'yourAzureAccountKey',
      table: 'tableName'
    })
  }));  
  // ...
});

```

## Options ##

* __account:__ The name of the Windows Azure storage account to use
* __key:__ The access key used to authenticate into this storage account
* __table:__ The name of the table to use (will be created if it does not already exist)

## Example ##
There is an example application in the `example` directory.

connect-bluesky was inspired by, and patterned after, [connect-redis](https://github.com/visionmedia/connect-redis/)
