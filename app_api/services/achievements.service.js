var Q = require("q");
var achievements = require('../models/achievements');

var getAchievementsById = function(userId) {
    var deferred = Q.defer();
    achievements.findOne({
        userId: userId
    }, function(error, achievements) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(achievements);
        }
    });
    return deferred.promise;
}

var updateAchievementsData = function(achievementsData) {
    var deferred = Q.defer();
    achievements.findOne({
        userId: achievementsData.userId
    }, function(error, achievements) {
        if (error) {

        } else {
            achievements.achievementsList = achievementsData.achievementsList;
            achievements.save(function(err, updatedAchievementsData) {
                if (err) {
                    deferred.reject(new Error(err));
                } else {
                    deferred.resolve(updatedAchievementsData);
                }
            });
        }
    });
    return deferred.promise;
}


var createAchievementsData = function(userId) {
    var deferred = Q.defer();
    var achievementsData = new achievements({
        userId: userId,
        achievementsList: ['Achievements']
    });
    achievementsData.save(function(err, achievements) {
        if (err) {
            console.log('Error creating achievements');
            deferred.reject(new Error(err));
        } else if (achievements) {
            deferred.resolve(achievements);
        }
    });

    return deferred.promise;
}

var achievementsService = {
    getAchievementsById: getAchievementsById,
    updateAchievementsData: updateAchievementsData,
    createAchievementsData: createAchievementsData
}

module.exports = achievementsService
