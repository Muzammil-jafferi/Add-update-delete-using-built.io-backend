var util = require('util');
var fs = require("fs");
var request = require('request');
//var session = require('express-session');
/*var config = require('D:/json add-update-delete/dummy.json')
 */

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('signup.html', { title: "welcome to my App" });
    });

    app.post('/signin', function(req, res) {
        var options = {
            "method": "POST",
            "url": "https://api.built.io/v1/application/users",
            "headers": {
                "application_api_key": "blt8fad8daae1ae5711"
            },
            "json": {
                "application_user": {
                    "email": req.body.email,
                    "first_name": req.body.fname,
                    "last_name": req.body.lname,
                    "password": req.body.pass,
                    "password_confirmation": req.body.cpass
                }
            }
        }
        request(options, function(error, response, body) {
            if (req.body.pass === req.body.cpass) {
                return res.redirect('/login');
            } else {
                return res.render('signup.html', { error: 'data is invalid' });
            }

        })
    });

    app.get('/login', function(req, res) {
        res.render('login.html', { title: "welcome to my App" });
    });

    app.post('/login', function(req, res) {
        var options = {
            "method": "POST",
            "url": "https://api.built.io/v1/application/users/login",
            "headers": {
                "application_api_key": "blt8fad8daae1ae5711"
            },
            "json": {
                "application_user": {
                    "email": req.body.email,
                    "password": req.body.pass
                }
            }
        }
        request(options, function(error, response, body) {
            if (error) {
                return res.render('login.html',{error : "username or password is incorrect"});
                console.log(error)
            } else if (body.errors){
                return res.render('login.html',{error : body.errors.auth[0]});
            }else{
                console.log(response.statusCode)
                console.log(body)
                req.session.authtoken=body.application_user.authtoken
                return res.redirect('/index');
            }
        })

    });

    app.get('/index', function(req, res) {
        res.render('index.html', { title: "welcome to my App" });
    });

    app.post('/index', function(req, res) {
        var options = {
            "method": "POST",
            "url": "https://api.built.io/v1/classes/employees/objects",
            "headers": {
                "application_api_key": "blt8fad8daae1ae5711",
                "authtoken": req.session.authtoken
            },
            "json": {
                "object": {
                    "firstname": req.body.fn,
                    "lastname": req.body.ln,
                    "email": req.body.un
                }
            }
        }
        request(options, function(error, response, body) {
            console.log(error)
            if (error) {
                console.log(error)
            } else {
                console.log(body)
                return res.redirect('/list');
            }
        })
    });

    app.get('/list', function(req, res) {
        console.log("req.session",req.session)
        var options = {
            "method": "GET",
            "url": "https://api.built.io/v1/classes/employees/objects",
            "headers": {
                "application_api_key": "blt8fad8daae1ae5711",
                "authtoken":req.session.authtoken
            }
        }
        request(options, function(error, response, body) {
            if (error) {
                console.log(error)
            } else {
                if (typeof body == "string") {
                    body = JSON.parse(body)
                }
                res.render('welcome.html', { title: "welcome to my App", data: body.objects });
            }
        })
    })

    app.put('/update-data/:id', function(req, res) {
        var text = req.params.id;
        console.log("uid " + text);
        var options = {
            "method": "PUT",
            "url": "https://api.built.io/v1/classes/employees/objects/" + text,
            "headers": {
                "application_api_key": "blt8fad8daae1ae5711",
               "authtoken": req.session.authtoken
            },
            "json": {
                "object": {
                    "firstname": req.body.firstname,
                    "lastname": req.body.lastname,
                    "email": req.body.username
                }
            }
        }
        request(options, function(error, response, body) {
            console.log(error)
            if (error) {
                console.log(error)
            } else {
                console.log(body)
                return res.send('updated')
            }
        })
    });

    app.delete('/delete-data/:text', function(req, res) {
        var text = req.params.text;
        console.log("uid " + text);
        var options = {
            "method": "DELETE",
            "url": "https://api.built.io/v1/classes/employees/objects/" + text,
            "headers": {
                "application_api_key": "blt8fad8daae1ae5711",
               "authtoken": req.session.authtoken
            }
        }
        request(options, function(error, response, body) {
            if (error) {
                console.log(error)
            } else {
                console.log(body)
                return res.send('deleted')
            }
        })
    });

    app.get('/logout', function(req, res) {
        delete req.session.authtoken;
        res.redirect('/login');
    });
}
