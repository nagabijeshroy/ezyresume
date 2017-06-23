var express = require('express')
var router = express.Router()
var userService = require('../services/user.service');
var achievementsService = require('../services/achievements.service');
var currentStatusService = require('../services/currentStatus.service');
var educationService = require('../services/education.service');
var employmentService = require('../services/employment.service');
var objectiveService = require('../services/objective.service');
var skillsService = require('../services/skills.service');
var summaryService = require('../services/summary.service');
var projectsService = require('../services/projects.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route
router.get('/:userId', function(req, res) {
    //userService.createUserData(755614);
    var userId = req.params.userId;
    if (!userId) {
        res.status(500).send(JSON.stringify("error"));
    }
    userService.getUserById(userId)
        .then(function(user) {
            res.send(JSON.stringify(user))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(err));
        });
});

router.put('/', function(req, res) {
    var userData = req.body.userData;
    userService.updateUserData(userData)
        .then(function(user) {
            res.send(JSON.stringify(user))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(err));
        });
})

router.post('/', function(req, res) {
    var userData = req.body.userData;
    userService.createUserData(userData)
        .then(function(user) {
            return achievementsService.createAchievementsData(user.userId)
                .then(function() {
                    return currentStatusService.createCurrentStatusData(user.userId)
                        .then(function() {
                            return educationService.createEducationData(user.userId)
                                .then(function() {
                                    return employmentService.createEmploymentData(user.userId)
                                        .then(function() {
                                            return skillsService.createSkillsData(user.userId)
                                                .then(function() {
                                                    return summaryService.createSummaryData(user.userId)
                                                        .then(function() {
                                                            return objectiveService.createObjectiveData(user.userId)
                                                                .then(function() {
                                                                    return projectsService.createProjectsData(user.userId)
                                                                        .then(function() {
                                                                            res.send(JSON.stringify(user));
                                                                        })
                                                                })
                                                        })
                                                })
                                        })
                                })
                        })
                })

        })
        .catch(function(error) {
            console.log(error);
            res.status(500).send(JSON.stringify(err));
        });
});

module.exports = router;
