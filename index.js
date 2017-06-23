var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('./connection');
var multiparty = require('connect-multiparty');

var achievements = require('./app_api/routes/achievements.route');
var currentStatus = require('./app_api/routes/currentStatus.route');
var education = require('./app_api/routes/education.route');
var employment = require('./app_api/routes/employment.route');
var objective = require('./app_api/routes/objective.route');
var skills = require('./app_api/routes/skills.route');
var summary = require('./app_api/routes/summary.route');
var user = require('./app_api/routes/user.route');
var login = require('./app_api/routes/login.route');
var projects = require('./app_api/routes/projects.route');
var photo = require('./app_api/routes/photo.route');

var multipartyMiddleware = multiparty();

app.use(multipartyMiddleware);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json({extended : true}));

app.use(passport.initialize());
require('./app_api/config/passport');


app.use('/upload-photo', photo);
app.use('/achievements', achievements);
app.use('/currentStatus', currentStatus);
app.use('/education', education);
app.use('/employment', employment);
app.use('/objective', objective);
app.use('/skills', skills);
app.use('/summary', summary);
app.use('/user', user);
app.use('/login', login);
app.use('/projects', projects);
app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
