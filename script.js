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