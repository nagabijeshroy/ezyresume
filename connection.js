var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
mongoose.connect('mongodb://heroku_0w598xd0:sil6e0a6il25h9fn6qjd7bm7gd@ds133348.mlab.com:33348/heroku_0w598xd0');
//mongoose.connect('mongodb://localhost/portfolioApp');

var db = mongoose.connection;

autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'Connection Error : '));
db.once('open', function(){
  console.log('Connection ok!');
});

module.exports = mongoose;
