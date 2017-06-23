var mongoose = require('mongoose');
var EducationSchema = new mongoose.Schema({
    userId: Number,
    educationList: [{
        id: mongoose.Schema.Types.ObjectId,
        institution: {
            name: String,
            city: String,
            state: String
        },
        course: {
            degreeName: String,
            gpa: String,
            courseList: [String]
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

var EducationModel = mongoose.model("education", EducationSchema);

module.exports = EducationModel;
