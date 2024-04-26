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
var activeQuestion = 1;
var progressBarWidth = $(".progress-bar").width();
var originalProgress = progressBarWidth / 10;
var progress = originalProgress;
var projectType;

function startForm(event) {
    event.preventDefault();
    userName = $("input[name='name'").val();
    localStorage.setItem('userName', userName);
    location.href = "https://theladeli.github.io/home-extension-checklist/project-details.html";
}

function saveProjectDetails(event) {
    event.preventDefault();

    // Set each objects value to form selection
    for (var property in userDetails) {
        userDetails[property] = $(`input[name='${property}']:checked`).val();
    }

    // List of Professional Help
    var checkedProfessionalHelp = document.querySelectorAll("input[name='professional_help']:checked");

    var checkedValues = [];

    checkedProfessionalHelp.forEach(function (checkbox) {
        checkedValues.push(checkbox.value);
    });

    userDetails.professional_help = checkedValues

    // Log entire object and save it to Local Storage
    console.log(userDetails)
    localStorage.setItem('userDetails', JSON.stringify(userDetails));

    // Redirect user to the Checklist
    location.href = "https://theladeli.github.io/home-extension-checklist/generating-checklist.html";
}

function convertCSVtoArray() {
    return new Promise((resolve, reject) => {
        Papa.parse('./task_list.csv', {
            header: true,
            download: true,
            dynamicTyping: true,
            complete: function (results) {
                console.log("CSV parsed successfully.");
                taskList = results.data;
                resolve(); // Resolve the promise once parsing is complete
            },
            error: function (error) {
                reject(error); // Reject the promise if there's an error
            }
        });
    });
}

function pushTaskToArray(...task_ids) {
    // Populate the taskList array
    convertCSVtoArray().then(() => {
        task_ids.forEach(task_id => {
            // Check if the task_id already exists in userTaskList
            if (userTaskList.some(task => task.ID === task_id)) {
                console.log("Task with ID", task_id, "already exists in userTaskList.");
            } else {
                // Find the relevant object in the array
                var relevantObject = taskList.find(obj => obj.ID === task_id);
                if (relevantObject) {
                    userTaskList.push(relevantObject);
                    localStorage.setItem('userTaskList', JSON.stringify(userTaskList));
                } else {
                    console.error("Task not found with ID:", task_id);
                }
            }
        });
    }).catch(error => {
        console.error("Error parsing CSV:", error);
    });
}

function getRelevantUserTasks() {


    // Update userDetails object with values from form using local storage
    userDetails = JSON.parse(localStorage.getItem("userDetails"))
    console.log(userDetails)

    // Push default tasks
    pushTaskToArray(4, 6, 19, 20, 23, 25, 31, 32, 33, 34, 36, 41, 30, 46, 47, 49, 50, 51, 52)

    // Planning Status
    switch (userDetails.planning_status) {
        case "no":
            pushTaskToArray(1, 13, 16, 17, 21, 18);
            break;
        default:
            console.log(`Planning Status is not "no"`);
    }

    // Design
    switch (userDetails.project_design) {
        case "no":
            pushTaskToArray(2, 7);
            break;
        default:
            console.log(`Project Design is not "no"`);
    }

    // Interior & Finishes
    switch (userDetails.interior_and_finishes) {
        case "yes":
            pushTaskToArray(8, 9, 10, 37, 38, 39, 40);
            break;
        default:
            console.log(`Interior and Finishes is not "yes"`);
    }

    // External Works
    switch (userDetails.external_works) {
        case "yes":
            pushTaskToArray(42, 43, 44, 45);
            break;
        default:
            console.log(`External Works is not "yes"`);
    }

    // Construction and Management
    switch (userDetails.construction_and_management) {
        case "no ":
        case "unsure":
            pushTaskToArray(15);
            break;
        default:
            console.log(`Construction and Management is not "no" or "unsure"`)
    }

    // Professional Help
    switch (userDetails.professional_help) {
        case "architect":
        case "builder":
        case "structural-engineer":
        case "interior-designer":
            pushTaskToArray(24, 26, 27, 28, 29, 35, 48);
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
    switch (userDetails.budget) {
        case "yes-flexible":
            pushTaskToArray(22);
            break;
        case "no":
            pushTaskToArray(3, 22)
            break;
        default:
            console.log(`Budget is "yes fixed"`)
    }

    // Timeline
    switch (userDetails.timeline) {
        case "no":
            pushTaskToArray(5)
            break;
        default:
            console.log(`Timeline is set to "Yes"`)
    }

}

// Animate index page out and start flow
function animateAndStartFlow() {
    $("#welcome-content").animate({
        height: 'toggle',
        opacity: 'toggle'
    }, 'fast');

    setTimeout(() => {
        window.location.href = "https://theladeli.github.io/home-extension-checklist/about-you.html"
    }, 300)
}

function saveProjectType() {
    projectType = $(`input[name='project_type']:checked`).val()
    // Format value (apply capitalisation and replace "-" with " ")

    if (projectType) {
        var projectType = projectType.replace(/-/g, ' ').replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
        });
        $("#personlised-step-3").html(`Do you have an idea of what your <span style="color: #3399fd;">${projectType}</span> project should look like?`)
    } else {
        console.log("No project type selected.")
    }

}

// Multi page form logic
function nextQuestion() {
    $(`#step-${activeQuestion}`).removeClass("active");
    activeQuestion++;
    $(`#step-${activeQuestion}`).addClass("active");
    progress = progress + originalProgress
    $(`.pb_progress`).width(progress)
}

function previousQuestion() {
    $(`#step-${activeQuestion}`).removeClass("active");
    activeQuestion--;
    $(`#step-${activeQuestion}`).addClass("active");
    progress = progress - originalProgress
    $(`.pb_progress`).width(progress)
}

// Sidebar Stats
function sidebarStats() {

    // Count the number of tasks completed
    var completedTasksCount = userTaskList.reduce((count, task) => {
        // If the task is completed, increment the count
        if (task.completed) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);

    // Count the number of tasks with completed = false
    var incompleteTasksCount = userTaskList.reduce((count, task) => {
        // If the task is incomplete (completed = false), increment the count
        if (!task.completed) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);


    // Apply Stats
    $("#os_total-tasks").text(userTaskList.length)
    $("#os_tasks-completed").text(completedTasksCount)
    $("#os_tasks-to-do").text(incompleteTasksCount)

}


// Load relevant tasks
$(document).ready(function () {

    // Check if the current page path matches the specific page path
    if (window.location.pathname === "/") {
        // Set 'enter' keypress listener to start form
        $(document).on('keypress', function (e) {
            if (e.which == 13) {

                animateAndStartFlow();

            }
        });

    } else if (window.location.pathname === "/project-details.html") {
        // Custom name introduction
        console.log("Project details page loaded")
        $("#project-details-custom-name-intro").text(`👋 Hi ${localStorage.getItem("userName")}! What type of project do you have in mind?`)

        // Event listener to add a blue border when a radio is :checked
        $('input[type="radio"]').change(function () {
            $('label').removeClass('blue-border');
            $(this).closest('label').addClass('blue-border');
        });

        // Add blue border when checkbox is :checked and add logic for 'None' option
        $('input[type="checkbox"]').change(function () {
            // Check if the checkbox with value "none" is checked
            if ($(this).val() === 'none' && $(this).is(':checked')) {
                // Uncheck all other checkboxes and remove blue-border class from their labels
                $('input[type="checkbox"]').not(this).prop('checked', false);
                $('label').removeClass('blue-border');
                $(this).closest('label').addClass('blue-border');
            } else {
                // Check if the checkbox is checked
                if ($(this).is(':checked')) {
                    // Uncheck the "None" checkbox if anything other than "None" is checked
                    $('input[value="none"]').prop('checked', false);
                    $('label[for="none"]').removeClass('blue-border');
                    $(this).closest('label').addClass('blue-border');
                } else {
                    // Remove blue-border class from the closest label
                    $(this).closest('label').removeClass('blue-border');
                }
            }
        });


    } else if (window.location.pathname === "/generating-checklist.html") {
        getRelevantUserTasks()
        // Animate content out and redirect to Checklist after small delay
        setTimeout(() => {
            $("#body-center").animate({
                height: 'toggle',
                opacity: 'toggle'
            }, 'fast');
            setTimeout(() => {
                window.location.href = "https://theladeli.github.io/home-extension-checklist/checklist.html"
            }), 1000
        }, 3000)
    } else if (window.location.pathname === "/checklist.html") {

        $("#user-greeting").html(`Hello <span style="color: #3399fd">${localStorage.getItem("userName")}</span>!`)

        // Retrieve userTaskList from localStorage
        userTaskList = JSON.parse(localStorage.getItem("userTaskList"));


        // Append userTaskList to #local_storage_loaded
        userTaskList.forEach(task => {
            var isCheckedClass = task.completed ? ' checked' : ''; // Add space before 'checked' class if task.completed is true

            $(`#cc_${task.category_id}`).append(`
                <div class="accordion-item">
                    <div class="accordion-header" data-expanded="false">
                        <div class="group">
                            <div class="custom-checkbox${isCheckedClass}" data-task_id="${task.ID}"></div>
                            ${task.Name}
                        </div>
                        <img src="assets/chevron_down.svg">
                    </div>
                    <div class="accordion-content">
                        ${task.Description}
                    </div>
                </div>
            `);
        });

        // Event listener for checkbox clicks
        $('.custom-checkbox').click(function () {
            // Get the task ID from the data-task_id attribute
            var taskId = $(this).data('task_id');
            console.log('Task ID:', taskId);
            // Find the relevant task in userTaskList
            var relevantTask = userTaskList.find(task => task.ID === taskId);
            console.log('Relevant Task:', relevantTask);
            if (relevantTask) {
                // Update the 'completed' property of the task based on checkbox state
                relevantTask.completed = !relevantTask.completed; // Toggle the completed state
                console.log('Updated Task:', relevantTask);
                // Save the updated userTaskList to localStorage
                localStorage.setItem('userTaskList', JSON.stringify(userTaskList));
                console.log('userTaskList updated:', userTaskList);
                sidebarStats();
            } else {
                console.error('Task not found with ID:', taskId);
                sidebarStats();
            }
        });

        // Accordion Functionality
        // Initially hide all accordion content except the one with data-expanded="true"
        $('.accordion-content').hide();
        $('.accordion-header[data-expanded="true"]').next('.accordion-content').show();

        // Toggle accordion content when header is clicked
        $('.accordion-header').click(function () {
            var $accordionContent = $(this).next('.accordion-content');
            var $chevronIcon = $(this).find('img');

            $accordionContent.slideToggle();

            // Toggle the data-expanded attribute based on visibility
            var expanded = $accordionContent.is(':visible') ? 'true' : 'false';
            $(this).attr('data-expanded', expanded);

            // Toggle the class to flip the chevron icon
            $chevronIcon.toggleClass('flipped');
        });

        // Prevent accordion toggle when clicking on custom-checkbox
        $('.custom-checkbox').click(function (event) {
            event.stopPropagation(); // Stop event propagation to parent elements
        });

        // Checkbox div design functionality
        $('.custom-checkbox').click(function () {
            $(this).toggleClass('checked');
        });


        if ($("#cc_5").find(".accordion-item").length > 0) {
            
            console.log("Exterior does contain tasks.")

        } else {
            
            console.log("Exterior does not contain tasks.")
            $("#cc_5").hide();
            $("a.ct_item[href='#cc_5']").hide();

        }


        // Load sidebar stats
        sidebarStats()

    }

});

// ---------------------

// Next task: set all the csv parsing and saving user tasks to local storage to happen on holding screen, and then have the checklist screen load a task item for each userTaskList item