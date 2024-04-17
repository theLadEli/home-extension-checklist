var userDetails = {
    name: "",
    project_type: "",
    planning_status: "",
    project_design: "",
    interior_and_finishes: "",
    external_works: "",
    construction_and_management: "",
    professional_help: "",
    budget: "",
    timeline: ""
}

function startForm(event) {
    event.preventDefault();
    userDetails.name = $("input[name='name'").val();
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    location.href = "/project-details.html";
}

function saveProjectDetails(event){
    // event.preventDefault();

    for (var key in userDetails) {
        if (userDetails.hasOwnProperty(key)) {
            userDetails.key = $("input[name='key'").val();
            console.log(key + ": " + userDetails[key]);
        }
    }

    // userDetails.project_type = $("input[name='project-type'").val();
    // userDetails.project_type = $("input[name='project-type'").val();
}
saveProjectDetails()