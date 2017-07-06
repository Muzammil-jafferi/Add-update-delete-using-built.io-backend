var express = require('express');
var nunjucks = require('nunjucks');
var session = require('express-session');
var bodyParser = require('body-parser');
var util = require('util');
var router = require('router');
var port = 8080;

var app = express();
app.use(express.static('public'));

function checkAuth(req, res, next) {

    console.log('checkAuth ' + req.url);

    // don't serve /list or /index to those not logged in
    // you should add to this list, for each and every secure url
    if ((req.url === '/list' || req.url === '/index') && (!req.session || !req.session.authtoken)) {
        res.render('unauthorised.html', { status: 403 });
        return;
    }

    next();
}

nunjucks.configure('views', {
    autoescape: true,
    noCache: true,
    express: app
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser)

app.use(session({
    secret: 'login',
    resave: false,
    saveUninitialized: false,
    resave : false
    // cookie: { secure: true }
}))
app.use(checkAuth);

app.set('view engine', 'nunjucks');
app.set('view options', { layout: false });

require('./lib/routes.js')(app);

app.listen(port);
console.log('Node listening on port %s', port);
