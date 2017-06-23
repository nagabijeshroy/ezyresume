var Q = require("q");
var mongoose = require("mongoose");
var projects = require('../models/projects');

var getProjectsById = function(userId) {

    var deferred = Q.defer();
    projects.findOne({
        userId: userId
    }, function(error, projects) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(projects);
        }
    });

    return deferred.promise;
}


var updateProjectsData = function(userId, projectsListItem) {
    var deferred = Q.defer();
    projects.findOneAndUpdate({
            userId: userId,
            "projectsList._id": mongoose.Types.ObjectId(projectsListItem._id)
        }, {
            $set: {
                "projectsList.$.institution": projectsListItem.institution,
                "projectsList.$.project": projectsListItem.project,
                "projectsList.$.duration": projectsListItem.duration
            }
        },
        function(err, updatedProjectsListItem) {
            if (err) {
                deferred.reject(new Error(err));
            } else if (updatedProjectsListItem) {
                deferred.resolve(updatedProjectsListItem);
            }
        }
    );
    return deferred.promise;
}

var addProjectsData = function(userId, projectsListItem) {
    var deferred = Q.defer();
    projects.findOneAndUpdate({
            userId: userId
        }, {
            $push: {
                "projectsList": {
                    "institution": projectsListItem.institution,
                    "project": projectsListItem.project,
                    "duration": projectsListItem.duration,
                    "isCollapsed": projectsListItem.isCollapsed
                }
            }
        },
        function(err, updatedProjectsListItem) {
            if (err) {
                console.log(err);
                deferred.reject(new Error(err));
            } else if (updatedProjectsListItem) {
                deferred.resolve(updatedProjectsListItem);
            }
        }
    );
    return deferred.promise;
}

var deleteProjectsData = function(userId, projectsListItem) {
    var deferred = Q.defer();
    projects.findOneAndUpdate({
            userId: userId,
            "projectsList._id": mongoose.Types.ObjectId(projectsListItem._id)
        }, {
            $pull: {
                projectsList: {
                    _id: mongoose.Types.ObjectId(projectsListItem._id)
                }
            }
        }, {
            new: true
        },
        function(err, updatedProjectsListItem) {
            if (err) {
                console.log(err);
                deferred.reject(new Error(err));
            } else if (updatedProjectsListItem) {
                deferred.resolve(updatedProjectsListItem);
            }
        }
    );
    return deferred.promise;
}

var createProjectsData = function(userId) {
    var deferred = Q.defer();
    var projectsData = new projects({
        userId: userId,
        projectsList: [{
            institution: {
                name: 'Insitution Name',
                city: 'City',
                state: 'State'
            },
            project: {
                projectName: 'Project Name',
                responsibilities: ['Responsibility']
            },
            duration: {
                from: {
                    month: 'MMM',
                    year: 'YY'
                },
                to: {
                    month: 'MMM',
                    year: 'YY'
                }
            },
            isCollapsed: true,
        }]
    });
    projectsData.save(function(err, projects) {
        if (err) {
            console.log('Error creating projects');
            deferred.reject(new Error(err));
        } else if (projects) {
            deferred.resolve(projects);
        }
    });

    return deferred.promise;
}
var projectsService = {
    getProjectsById: getProjectsById,
    addProjectsData: addProjectsData,
    updateProjectsData: updateProjectsData,
    deleteProjectsData: deleteProjectsData,
    createProjectsData: createProjectsData
}

module.exports = projectsService
