
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , BlueskyStore = require('connect-bluesky')(express);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser()); 
  app.use(express.session({
    secret: 'your secret here', 
    store: new BlueskyStore({
      account: 'youraccount', // replace with your Azure storage account
      key: 'yourkey',         // replace with your Azure storage key
      table: 'sessions'       // be sure 'sessions' table already exists
    })
  }));  
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/items', routes.listItems);
app.post('/items', routes.addItem);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
