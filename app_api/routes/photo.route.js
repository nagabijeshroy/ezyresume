var express = require('express')
var router = express.Router();
var path = require('path');
var fs = require('fs');
var uuid = require('uuid');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next()
})

router.post('/', function(req, res) {
    var file = req.files.file; // multiparty is what allows the file to to be accessed in the req
    var stream = fs.createReadStream(file.path);
    var extension = file.path.substring(file.path.lastIndexOf('.'));
    var destPath = path.join(__dirname, '../../uploads/profile/',  req.body.userId + extension);
    //var destPath = __dirname + '/uploads/profile/' + req.body.userId + extension;
    console.log(destPath);
    fs.readFile(file.path, function read(error, data) {
        if (error) {
            throw error;
        } else {
            fs.writeFile(destPath, data, function(error) {
                if (error) {
                    res.send(error);
                } else {
                    res.send(destPath);
                }
            });
        }
    });
});


module.exports = router;
