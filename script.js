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

$("#local_storage_loaded").append(`
    <h1>Hi ${localStorage.getItem("userName")}</h><br>
    <p>${localStorage.getItem("userDetails")}</p>
`)

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
                } else {
                    console.error("Task not found with ID:", task_id);
                }
        })

    }).catch(error => {
        console.error("Error parsing CSV:", error);
    });

}

pushTaskToArray(22,1,2,34,11,3)


// function getRelevantUserTasks() {
//     // Update userDetails object with values from form using local storage
//     userDetails = JSON.parse(localStorage.getItem("userDetails"))

//     // Planning Status
//     switch(userDetails.planning_status) {
//         case "no":
            
//     }
// }