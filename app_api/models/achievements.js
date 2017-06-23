var mongoose = require('mongoose');
var AchievementsSchema = new mongoose.Schema({
    userId: Number,
    achievementsList: [String]
});

var AchievementsModel = mongoose.model("achievements", AchievementsSchema);

module.exports = AchievementsModel;
