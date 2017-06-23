var mongoose = require('mongoose');
var ProjectsSchema = new mongoose.Schema({
    userId: Number,
    projectsList: [{
        id: mongoose.Schema.Types.ObjectId,
        institution: {
            name: String,
            city: String,
            state: String
        },
        project: {
            projectName: String,
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

var ProjectsModel = mongoose.model("projects", ProjectsSchema);

module.exports = ProjectsModel;
