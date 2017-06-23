var mongoose = require('mongoose');
var EmploymentSchema = new mongoose.Schema({
    userId: Number,
    employmentList: [{
        id: mongoose.Schema.Types.ObjectId,
        company: {
            name: String,
            city: String,
            state: String
        },
        job: {
            jobName: String,
            responsibilities: [String]
        },
        duration: {
            from: {
                month: String,
                year: String
            },
            to: {
                month: String,
                year: String
            }
        },
        isCollapsed: Boolean,
    }]
});

var EmploymentModel = mongoose.model("employment", EmploymentSchema);

module.exports = EmploymentModel;
