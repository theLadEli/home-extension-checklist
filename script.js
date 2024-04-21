var taskList;
var userTaskList = [];
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

function convertCSVtoArray() {
    return new Promise((resolve, reject) => {
        Papa.parse('./task_list.csv', {
            header: true,
            download: true,
            dynamicTyping: true,
            complete: function(results) {
                console.log("CSV parsed successfully.");
                taskList = results.data;
                resolve(); // Resolve the promise once parsing is complete
            },
            error: function(error) {
                reject(error); // Reject the promise if there's an error
            }
        });
    });
}

function pushTaskToArray(...task_ids) {
    // Populate the taskList array
    convertCSVtoArray().then(() => {

        task_ids.forEach(task_id => {
                // Find the relevant object in the array
                var relevantObject = taskList.find(obj => obj.ID === task_id);
                if (relevantObject) {
                    userTaskList.push(relevantObject);
                    localStorage.setItem('userTaskList', JSON.stringify(userTaskList));
                } else {
                    console.error("Task not found with ID:", task_id);
                }
        })

    }).catch(error => {
        console.error("Error parsing CSV:", error);
    });

}

function getRelevantUserTasks() {
    // Update userDetails object with values from form using local storage
    userDetails = JSON.parse(localStorage.getItem("userDetails"))
    console.log(userDetails)

    // Planning Status
    switch(userDetails.planning_status) {
        case "no":
            pushTaskToArray(1,13,16,17,21,18);
            break;
        default:
            console.log(`Planning Status is not "no"`);
    }

    // Design
    switch(userDetails.project_design) {
        case "no":
            pushTaskToArray(2,7);
            break;
        default:
            console.log(`Project Design is not "no"`);
    }

    // Interior & Finishes
    switch(userDetails.interior_and_finishes) {
        case "yes":
            pushTaskToArray(8,9,10,37,38,39,40);
            break;
        default:
            console.log(`Interior and Finishes is not "yes"`);
    }

    // External Works
    switch(userDetails.external_works){
        case "yes":
            pushTaskToArray(42,43,44,45);
            break;
        default:
            console.log(`External Works is not "yes"`);
    }

    // Construction and Management
    switch(userDetails.construction_and_management){
        case "no ":
        case "unsure":
            pushTaskToArray(15);
            break;
        default:
            console.log(`Construction and Management is not "no" or "unsure"`)
    }

    // Professional Help
    switch(userDetails.professional_help){
        case "architect":
        case "builder":
        case "structural-engineer":
        case "interior-designer":
            pushTaskToArray(24,26,27,28,29,35,48);
        case "architect":
            pushTaskToArray(3.1);
            break;
        case "structural-engineer":
            pushTaskToArray(3.2);
            break;
        default:
            console.log(`Professional Help is "none"`)
    }

    // Budget
    switch(userDetails.budget){
        case "yes-flexible":
            pushTaskToArray(22);
            break;
        case "no":
            pushTaskToArray(3,22)
            break;
        default:
            console.log(`Budget is "yes fixed"`)
    }

    // Timeline
    switch(userDetails.timeline){
        case "no":
            pushTaskToArray(1.5)
            break;
        default:
            console.log(`Timeline is set to "Yes"`)
    }

}

// Load relevant tasks
$(document).ready(function loadChecklistPageContents() {

    // Check if the current page path matches the specific page path
    if (window.location.pathname === "/checklist.html") {
        // Code to execute when the specific page path loads
        getRelevantUserTasks()
        $("#local_storage_loaded").append(`
            <h1>Hi ${localStorage.getItem("userName")}</h><br>
            <p>${localStorage.getItem("userDetails")}</p>
            <h1>User Task List:</h1>
            <p>${localStorage.getItem("userTaskList")}
        `)
        console.log(`Checklist page loaded.`)
    }

});

// ---------------------

// Next task: set all the csv parsing and saving user tasks to local storage to happen on holding screen, and then have the checklist screen load a task item for each userTaskList item