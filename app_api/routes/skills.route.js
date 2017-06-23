var express = require('express')
var router = express.Router()
var skillsService = require('../services/skills.service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })
    // define the home page route
router.get('/:userId', function(req, res) {
    //skillsService.createSkillsData(755614);
    var userId = req.params.userId;
    if(!userId){
      res.status(500).send(JSON.stringify("error"));
    }
    skillsService.getSkillsById(userId)
        .then(function(skills) {
            res.send(JSON.stringify(skills))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
});

router.put('/', function(req, res) {
    var skillsData = req.body.skillsData;
    skillsService.updateSkillsData(skillsData)
        .then(function(skills) {
            res.send(JSON.stringify(skills))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

router.post('/', function(req, res) {
    var userId = req.body.userId;
    skillsService.createSkillsData(userId)
        .then(function(skills) {
            res.send(JSON.stringify(skills))
        })
        .catch(function(error) {
            console.log("There was an error");
            res.status(500).send(JSON.stringify(error));
        });
})

module.exports = router;
