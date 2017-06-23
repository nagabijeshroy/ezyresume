var express = require('express')
var router = express.Router()
var summaryService = require('../services/summary.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route
router.get('/:userId', function(req, res) {
    //summaryService.createSummaryData(755614);
    var userId = req.params.userId;
    if(!userId){
      res.status(500).send(JSON.stringify("error"));
    }
    summaryService.getSummaryById(userId)
        .then(function(summary) {
            res.send(JSON.stringify(summary))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
});


router.put('/', function(req, res) {
    var summaryData = req.body.summaryData;
    summaryService.updateSummaryData(summaryData)
        .then(function(summary) {
            res.send(JSON.stringify(summary))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var userId = req.body.userId;
    summaryService.createSummaryData(userId)
        .then(function(summary) {
            res.send(JSON.stringify(summary))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})
module.exports = router;
