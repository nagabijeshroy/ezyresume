var mongoose = require('mongoose');
var SkillsSchema = new mongoose.Schema({
    userId: Number,
    skillsList: [String],
    tags: [{
        id: Number,
        word: String,
        size: String
    }],
});

var SkillsModel = mongoose.model("skills", SkillsSchema);

module.exports = SkillsModel;
