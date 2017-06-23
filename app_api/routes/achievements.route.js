var express = require('express')
var router = express.Router()
var achievementsService = require('../services/achievements.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route
router.get('/:userId', function(req, res) {
    //achievementsService.createAchievementsData(755614);
    var userId = req.params.userId;
    if(!userId){
      res.status(500).send(JSON.stringify("error"));
    }
    achievementsService.getAchievementsById(userId)
        .then(function(achievements) {
            res.send(JSON.stringify(achievements))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });



    /*var achievements = new AchievementsModel();
    achievements.userId = 755614;
    achievements.achievementsList = [
        'Solved the problem to export reports generated from MicroStrategy server, embedded in the portal by creating a customized API and hence projected a lot in terms of cost savings to the client',
        'Was awarded 5 times as best performer for my contribution towards the successful delivery of the project'
    ];
    achievements.saveAsync()
        .spread(function(savedAchievements) {
            console.log(JSON.stringify(savedAchievements));
            res.send(JSON.stringify(savedAchievements))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });*/
})

router.put('/', function(req, res) {
    var achievementsData = req.body.achievementsData;
    achievementsService.updateAchievementsData(achievementsData)
        .then(function(achievements) {
            res.send(JSON.stringify(achievements))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var userId = req.body.userId;
    achievementsService.createAchievementsData(userId)
        .then(function(achievements) {
            res.send(JSON.stringify(achievements))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

module.exports = router;
