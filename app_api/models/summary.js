var mongoose = require('mongoose');
var SummarySchema = new mongoose.Schema({
    userId: Number,
    descriptionList:[String]
});

var SummaryModel = mongoose.model("summary", SummarySchema);

module.exports = SummaryModel;
