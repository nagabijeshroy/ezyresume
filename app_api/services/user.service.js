var Q = require("q");
var mongoose = require("mongoose");
var passport = require('passport');
var User = require('../models/user');

var getUserById = function(userId) {

    var deferred = Q.defer();
    User.findOne({
        userId: userId
    }, function(error, user) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
}

var getUserByUserNameOrEmail = function(userData) {
    var deferred = Q.defer();
    User.findOne({
        $or: [{
            username: userData.username
        }, {
            email: userData.email
        }]
    }, function(error, user) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
}



var updateUserData = function(userData) {
    var deferred = Q.defer();
    User.findOneAndUpdate({
            userId: userData.userId,
        }, {
            $set: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email
            }
        },
        function(err, updatedUserData) {
            if (err) {
                deferred.reject(new Error(err));
            } else if (updatedUserData) {
                deferred.resolve(updatedUserData);
            }
        }
    );
    return deferred.promise;
}

var createUserData = function(userData) {
    var deferred = Q.defer();
    var user = new User({
        username: userData.username,
        firstName: userData.firstName,
        LastName: userData.LastName,
        email: userData.email
    });

    user.setPassword(userData.password);

    user.save(function(err, user) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (user) {
            var token;
            token = user.generateJwt();
            deferred.resolve({
                "userId": user.userId,
                "token": token
            });
        }
    });

    return deferred.promise;
}

var userService = {
    getUserById: getUserById,
    updateUserData: updateUserData,
    createUserData: createUserData,
    getUserByUserNameOrEmail: getUserByUserNameOrEmail
}

module.exports = userService
