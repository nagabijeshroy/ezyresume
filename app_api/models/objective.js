var mongoose = require('mongoose');
var ObjectiveSchema = new mongoose.Schema({
    userId: Number,
    fullName: String,
    statement: String,
    quotes: [{
        description: String,
        author: String
    }]
});

var ObjectiveModel = mongoose.model("objective", ObjectiveSchema);

module.exports = ObjectiveModel;
