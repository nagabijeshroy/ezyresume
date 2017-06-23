var express = require('express')
var router = express.Router()
var projectsService = require('../services/projects.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route
router.get('/:userId', function(req, res) {
    //projectsService.createProjectsData(755614);
    var userId = req.params.userId;
    if(!userId){
      res.status(500).send(JSON.stringify("error"));
    }
    projectsService.getProjectsById(userId)
        .then(function(projects) {
            res.send(JSON.stringify(projects))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.put('/', function(req, res) {
    var projectsListItem = req.body.projectsListItem.projectsList;
    var userId = req.body.userId;
    projectsService.updateProjectsData(userId, projectsListItem)
        .then(function(projectsListItem) {
            res.send(JSON.stringify(projectsListItem))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var projectsListItem = req.body.projectsListItem.projectsList;
    var userId = req.body.userId;
    projectsService.addProjectsData(userId, projectsListItem)
        .then(function(projectsListItem) {
            res.send(JSON.stringify(projectsListItem))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.delete('/', function(req, res) {
    var projectsListItem = req.body.projectsListItem.projectsList;
    var userId = req.body.userId;
    projectsService.deleteProjectsData(userId, projectsListItem)
        .then(function(projectsListItem) {
            res.send(JSON.stringify(projectsListItem))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var userId = req.body.userId;
    projectsService.createProjectsData(userId)
        .then(function(projects) {
            res.send(JSON.stringify(projects))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

module.exports = router;
