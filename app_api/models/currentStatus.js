var mongoose = require('mongoose');
var CurrentStatusSchema = new mongoose.Schema({
    userId: Number,
    jobName: String,
    client: {
        name: String,
        city: String,
        state: String
    },
    employer: {
        name: String,
        city: String,
        state: String
    }
});

var CurrentStatusModel = mongoose.model("currentStatus", CurrentStatusSchema);

module.exports = CurrentStatusModel;
