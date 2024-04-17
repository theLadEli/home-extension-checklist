var userDetails = {
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
    userName = $("input[name='name'").val();
    localStorage.setItem('userName', userName);
    location.href = "/project-details.html";
}

function saveProjectDetails(event){
    event.preventDefault();

    // Set each objects value to form selection
    for (var property in userDetails) {
        userDetails[property] = $(`input[name='${property}']:checked`).val();
    }

    // List of Professional Help
    var checkedProfessionalHelp = document.querySelectorAll("input[name='professional_help']:checked");

    var checkedValues = [];

    checkedProfessionalHelp.forEach(function(checkbox) {
        checkedValues.push(checkbox.value);
    });

    userDetails.professional_help = checkedValues

    // Log entire object and save it to Local Storage
    console.log(userDetails)
    localStorage.setItem('userDetails', JSON.stringify(userDetails));

    // Redirect user to the Checklist
    location.href = "/checklist.html";
}

$("#local_storage_loaded").append(`
<h1>Hi ${localStorage.getItem("userName")}</h><br>
<p>${localStorage.getItem("userDetails")}</p>
`)
