var express = require('express')
var router = express.Router()
var currentStatusService = require('../services/currentStatus.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route
router.get('/:userId', function(req, res) {
    //currentstatusService.createCurrentstatusData(755614);
    var userId = req.params.userId;
    if(!userId){
      res.status(500).send(JSON.stringify("error"));
    }
    currentStatusService.getCurrentStatusById(userId)
        .then(function(currentStatus) {
            res.send(JSON.stringify(currentStatus))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
});

router.put('/', function(req, res) {
    var currentStatusData = req.body.currentStatusData;
    currentStatusService.updateCurrentStatusData(currentStatusData)
        .then(function(currentStatus) {
            res.send(JSON.stringify(currentStatus))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var userId = req.body.userId;
    currentStatusService.createCurrentStatusData(userId)
        .then(function(currentStatus) {
            res.send(JSON.stringify(currentStatus))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

module.exports = router;
