var express = require('express')
var router = express.Router()
var employmentService = require('../services/employment.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route
router.get('/:userId', function(req, res) {
    //employmentService.createEmploymentData(755614);
    var userId = req.params.userId;
    if(!userId){
      res.status(500).send(JSON.stringify("error"));
    }
    employmentService.getEmploymentById(userId)
        .then(function(employment) {
            res.send(JSON.stringify(employment))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.put('/', function(req, res) {
    var employmentListItem = req.body.employmentListItem.employmentList;
    var userId = req.body.userId;
    employmentService.updateEmploymentData(userId, employmentListItem)
        .then(function(employmentListItem) {
            res.send(JSON.stringify(employmentListItem))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var employmentListItem = req.body.employmentListItem.employmentList;
    var userId = req.body.userId;
    employmentService.addEmploymentData(userId, employmentListItem)
        .then(function(employmentListItem) {
            res.send(JSON.stringify(employmentListItem))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.delete('/', function(req, res) {
    var employmentListItem = req.body.employmentListItem.employmentList;
    var userId = req.body.userId;
    employmentService.deleteEmploymentData(userId, employmentListItem)
        .then(function(employmentListItem) {
            res.send(JSON.stringify(employmentListItem))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var userId = req.body.userId;
    employmentService.createEmploymentData(userId)
        .then(function(employment) {
            res.send(JSON.stringify(employment))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

module.exports = router;
