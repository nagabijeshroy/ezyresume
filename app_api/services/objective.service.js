var Q = require("q");

var objective = require('../models/objective');

var getObjectiveById = function(userId) {

    var deferred = Q.defer();
    objective.findOne({
        userId: userId
    }, function(error, objective) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(objective);
        }
    });

    return deferred.promise;
}

var updateObjectiveData = function(objectiveData) {
    var deferred = Q.defer();
    objective.findOne({
        userId: objectiveData.userId
    }, function(error, objective) {
        if (error) {

        } else {
            objective.fullName = objectiveData.fullName;
            objective.statement = objectiveData.statement;
            objective.quotes = objectiveData.quotes;
            objective.save(function(err, updatedObjectiveData) {
                if (err) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(updatedObjectiveData);
                }
            });
        }
    });
    return deferred.promise;
}


var createObjectiveData = function(userId){
  var deferred = Q.defer();
  var objectiveData = new objective({
      userId: userId,
      fullName: 'Full Name',
      statement: 'Objective Statement',
      quotes: [{
          description: 'Sample Quote',
          author: 'Author'
      }]
  });
  objectiveData.save(function(err, objective) {
      if (err) {
          console.log('Error creating objective');
          deferred.reject(new Error(err));
      } else if (objective) {
          deferred.resolve(objective);
      }
  });

  return deferred.promise;
}
var objectiveService = {
    getObjectiveById: getObjectiveById,
    updateObjectiveData: updateObjectiveData,
    createObjectiveData: createObjectiveData
}

module.exports = objectiveService
