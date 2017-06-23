var express = require('express')
var router = express.Router()
var loginService = require('../services/login.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route

router.post('/', function(req, res) {
    var loginData = req.body.loginData;
    loginService.authenticateUser(loginData, req, res)
        .then(function(user) {
            res.status(200).send(JSON.stringify({
                userId: user.userId,
                token: user.token
            }));
        })
        .catch(function(error) {
            res.status(500).send(JSON.stringify(error));
        });
});

module.exports = router;
