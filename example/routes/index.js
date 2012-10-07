
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.listItems = function(req, res) {

  var items = req.session.items || ['(no items, add one!)'];
  res.render('items', { title: 'Items', items: items });

};

exports.addItem = function(req, res) {

  if (!req.session.items) {
    req.session.items = [];
  }

  req.session.items.push(req.body['item']);
  res.redirect('/items');

};