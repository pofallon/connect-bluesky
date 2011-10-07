# Connect Azure

connect-azure is an Azure session store backed by [node-azure](https://github.com/pofallon/node-azure).  Requires node-azure > 0.2.1 for 'upsert' functionality.

## Installation

  npm install connect-azure

## Options

  - `account` Azure storage account
  - `key` Key to access storage account
  - `table` Table name (must already exist)

## Usage

````Javascript
var connect = require('connect')
      , AzureStore = require('connect-azure')(connect);

connect.createServer(
  connect.cookieParser(),
  connect.session({ store: new AzureStore({account: 'account', key: 'key', table: 'connect'}, secret: 'keyboard cat' }) })
);
````
Express users may do the following:
````Javascript
var AzureStore = require('connect-azure')(express);
````
## Thanks to...

@tjholowaychuk for [connect-redis](https://github.com/visionmedia/connect-redis), on which this module is based. 
