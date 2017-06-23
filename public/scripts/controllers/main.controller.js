angular
    .module("app.myPortfolio")
    .controller("MainController", MainController);
MainController.$inject = ['$scope', '$state', '$q', 'DataService', 'SummaryService', 'AchievementsService', 'CurrentStatusService', 'EducationService',
    'EmploymentService', 'ObjectiveService', 'ProjectsService', 'SkillsService', 'authentication'
];

function MainController($scope, $state, $q, DataService, SummaryService, AchievementsService, CurrentStatusService,
    EducationService, EmploymentService, ObjectiveService, ProjectsService, SkillsService, authentication) {
    //console.log($state);
    vm = this;
    var dataService = DataService;
    var logout = function() {
        authentication.logout();
        $state.go('home');
    }

    var stateIncludes = function(stateName) {
        return $state.includes(stateName);
    }

    var userDataForExport = {
        achievementsData: null,
        currentStatusData: null,
        educationData: null,
        employmentData: null,
        objectiveData: null,
        summaryData: null,
        skillsData: null,
        projectsData: null
    }

    var exportPDF = function() {

        var achievementsPromise = AchievementsService.getAchievementsData(dataService.userId);
        var currentStatusPromise = CurrentStatusService.getCurrentstatusData(dataService.userId);
        var educationPromise = EducationService.getEducationData(dataService.userId);
        var employmentPromise = EmploymentService.getEmploymentData(dataService.userId);
        var objectivePromise = ObjectiveService.getObjectiveData(dataService.userId);
        var summaryPromise = SummaryService.getSummaryData(dataService.userId);
        var projectsPromise = ProjectsService.getProjectsData(dataService.userId);
        var skillsPromise = SkillsService.getSkillsData(dataService.userId);
        var getTags = function() {
            var str = "";
            angular.forEach(userDataForExport.skillsData.tags, function(value, key) {
                str += value.word + ", ";
            });
            str = str.slice(0, -2);
            return str;
        };

        $q.all([
                achievementsPromise, currentStatusPromise, educationPromise, employmentPromise,
                objectivePromise, summaryPromise, skillsPromise, projectsPromise
            ])
            .then(function(data) {
                userDataForExport = {
                    achievementsData: data[0],
                    currentStatusData: data[1],
                    educationData: data[2],
                    employmentData: data[3],
                    objectiveData: data[4],
                    summaryData: data[5],
                    skillsData: data[6],
                    projectsData: data[7]
                }
                vm.userDataForExport = userDataForExport;
                var docDefinition = {
                    // a string or { width: number, height: number }
                    pageSize: 'A4',
                    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                    pageMargins: [40, 60, 40, 60],
                    footer: function(currentPage, pageCount) {
                        return {
                            text: currentPage.toString() + ' of ' + pageCount,
                            color: 'gray',
                            fontSize: 8,
                            margin: [20, 20, 20, 20],
                            alignment: 'center'
                        };
                    },
                    header: function(currentPage, pageCount) {
                        // you can apply any logic and return any valid pdfmake element
                        return {
                            text: "Profile",
                            color: 'gray',
                            fontSize: 8,
                            margin: [20, 20, 20, 20],
                            alignment: 'left'
                        };
                    },
                    content: [{
                        text: userDataForExport.objectiveData.fullName,
                        style: 'headerStyle'
                    }, {
                        text: [userDataForExport.objectiveData.statement],
                        color: 'gray',
                        style: 'subHeadingH3'
                    }, {
                        columns: [{
                            width: "auto",
                            text: userDataForExport.currentStatusData.jobName + ", ",
                            style: {
                                fontSize: 10,
                                bold: true,
                                margin: [0, 0, 0, 10]
                            }
                        }, {
                            width: "auto",
                            text: [" " + userDataForExport.currentStatusData.client.name + ", " + userDataForExport.currentStatusData.client.city + ", " + userDataForExport.currentStatusData.client.state],
                            color: 'gray',
                            fontSize: 10,
                            bold: false,
                            margin: [3, 0, 0, 10]

                        }]
                    }, {
                        text: 'Summary',
                        style: 'headerStyle'
                    }, {
                        ul: [{
                            ul: userDataForExport.summaryData.descriptionList,
                            style: 'subHeadingH3'
                        }]
                    }, {
                        text: 'Skills',
                        style: 'headerStyle'
                    }, {
                        ul: [{
                            ul: userDataForExport.skillsData.skillsList,
                            style: 'subHeadingH3'
                        }]
                    }, {
                        columns: [{
                            width: "auto",
                            text: "Keywords: ",
                            style: {
                                fontSize: 10,
                                bold: true,
                                margin: [0, 0, 0, 10]
                            }
                        }, {
                            width: "auto",
                            text: getTags(),
                            color: 'gray',
                            fontSize: 10,
                            bold: false,
                            margin: [3, 0, 0, 10]

                        }]
                    }, {
                        text: 'Education',
                        style: 'headerStyle'
                    }],
                    styles: {
                        headerStyle: {
                            fontSize: 14,
                            bold: true,
                            margin: [0, 0, 0, 10]
                        },
                        subHeading: {
                            fontSize: 10,
                            bold: false,
                            margin: [0, 0, 0, 10]
                        },
                        subHeadingH3: {
                            fontSize: 9,
                            bold: false,
                            margin: [0, 0, 0, 5]
                        }
                    }
                };
                angular.forEach(userDataForExport.educationData.educationList, function(value, key) {
                    var str1 = {
                        columns: [{
                            width: "70%",
                            text: value.course.degreeName,
                            style: {
                                fontSize: 11,
                                bold: true,
                                margin: [0, 0, 0, 10]
                            }
                        }, {
                            width: "30%",
                            alignment: "right",
                            text: value.duration.from.month + ", " + value.duration.from.year + " - " + value.duration.to.month + ", " + value.duration.to.year,
                            fontSize: 11,
                            bold: false,
                            margin: [0, 0, 0, 10]
                        }],
                    }
                    docDefinition.content.push(str1);
                    var str2 = {
                        columns: [{
                            width: "70%",
                            text: value.institution.name + " - " + value.institution.city + ", " + value.institution.state,
                            style: {
                                fontSize: 10,
                                bold: true,
                                margin: [0, 0, 0, 10]
                            }
                        }, {
                            width: "30%",
                            alignment: "right",
                            text: "GPA: " + value.course.gpa,
                            fontSize: 10,
                            bold: false,
                            margin: [0, 0, 0, 10]
                        }],
                    }
                    docDefinition.content.push(str2);
                    var str3 = {
                        columns: [{
                            width: "auto",
                            text: "Courses: ",
                            style: {
                                fontSize: 10,
                                bold: true,
                                margin: [0, 0, 0, 10]
                            }
                        }, {
                            width: "auto",
                            text: value.course.courseList.join(),
                            color: 'gray',
                            fontSize: 10,
                            bold: false,
                            margin: [3, 0, 0, 10]
                        }]
                    }
                    docDefinition.content.push(str3);
                });
                docDefinition.content.push({
                    text: 'Employment',
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                });
                angular.forEach(userDataForExport.employmentData.employmentList, function(value, key) {
                    var str1 = {
                        columns: [{
                            width: "70%",
                            text: value.job.jobName,
                            style: {
                                fontSize: 11,
                                bold: true,
                                margin: [0, 0, 0, 10]
                            }
                        }, {
                            width: "30%",
                            alignment: "right",
                            text: value.duration.from.month + ", " + value.duration.from.year + " - " + value.duration.to.month + ", " + value.duration.to.year,
                            fontSize: 11,
                            bold: false,
                            margin: [0, 0, 0, 10]
                        }],
                    }
                    docDefinition.content.push(str1);
                    var str2 = {
                        columns: [{
                            width: "70%",
                            text: value.company.name + " - " + value.company.city + ", " + value.company.state,
                            fontSize: 10,
                            bold: true,
                            margin: [0, 0, 0, 5]
                        }],
                    }
                    docDefinition.content.push(str2);
                    var str3 = {
                        ul: [{
                            ul: value.job.responsibilities,
                            style: 'subHeadingH3'
                        }]
                    }
                    docDefinition.content.push(str3);
                });
                docDefinition.content.push({
                    text: 'Achievements',
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                });
                docDefinition.content.push({
                    ul: [{
                        ul: userDataForExport.achievementsData.achievementsList,
                        style: 'subHeadingH3'
                    }]
                });
                docDefinition.content.push({
                    text: 'Projects',
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                });
                angular.forEach(userDataForExport.projectsData.projectsList, function(value, key) {
                    var str1 = {
                        columns: [{
                            width: "70%",
                            text: value.project.projectName,
                            fontSize: 11,
                            bold: true,
                            margin: [0, 0, 0, 10]
                        }, {
                            width: "30%",
                            alignment: "right",
                            text: value.duration.from.month + ", " + value.duration.from.year + " - " + value.duration.to.month + ", " + value.duration.to.year,
                            fontSize: 11,
                            bold: false,
                            margin: [0, 0, 0, 10]
                        }],
                    }
                    docDefinition.content.push(str1);
                    var str2 = {
                        columns: [{
                            width: "70%",
                            text: value.institution.name + " - " + value.institution.city + ", " + value.institution.state,
                            fontSize: 10,
                            bold: true,
                            margin: [0, 0, 0, 5]
                        }],
                    }
                    docDefinition.content.push(str2);
                    var str3 = {
                        ul: [{
                            ul: value.project.responsibilities,
                            style: 'subHeadingH3'
                        }]
                    }
                    docDefinition.content.push(str3);
                });
                pdfMake.createPdf(docDefinition).download('profile.pdf');
            });
    }

    vm.dataService = dataService;
    vm.logout = logout;
    vm.stateIncludes = stateIncludes;
    vm.userDataForExport = userDataForExport;
    vm.exportPDF = exportPDF;
}
