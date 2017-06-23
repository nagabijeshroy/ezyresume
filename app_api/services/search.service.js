var Q = require("q");
var mongoose = require("mongoose");
var passport = require('passport');
var User = require('../models/user');

var authenticateUser = function(loginData, req, res) {
    var deferred = Q.defer();
    passport.authenticate('local', function(err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            deferred.reject(new Error(err));
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            deferred.resolve({
                "userId": user.userId,
                "token": token
            });
        } else {
            // If user is not found
            console.log(info);
            deferred.reject(new Error(info));
        }
    })(req, res);
    return deferred.promise;
}

var loginService = {
    authenticateUser: authenticateUser
}

module.exports = loginService
