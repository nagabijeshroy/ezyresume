var Q = require("q");
var skills = require('../models/skills');

var getSkillsById = function(userId) {
    var deferred = Q.defer();
    skills.findOne({
        userId: userId
    }, function(error, skills) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(skills);
        }
    });

    return deferred.promise;
}

var updateSkillsData = function(skillsData) {
    var deferred = Q.defer();
    skills.findOne({
        userId: skillsData.userId
    }, function(error, skills) {
        if (error) {

        } else {
            skills.skillsList = skillsData.skillsList;
            skills.tags = skillsData.tags;
            skills.save(function(err, updatedSkillsData) {
                if (err) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(updatedSkillsData);
                }
            });
        }
    });
    return deferred.promise;
}

var createSkillsData = function(userId){
  var deferred = Q.defer();
  var skillsData = new skills({
      userId: userId,
      skillsList: ['Skill Description'],
      tags: [{
          id: 1,
          word: 'Keyword',
          size: '10'
      }],
  });
  skillsData.save(function(err, skills) {
      if (err) {
          console.log('Error creating skills');
          deferred.reject(new Error(err));
      } else if (skills) {
          deferred.resolve(skills);
      }
  });

  return deferred.promise;
}

var skillsService = {
    getSkillsById: getSkillsById,
    updateSkillsData: updateSkillsData,
    createSkillsData: createSkillsData
}

module.exports = skillsService
