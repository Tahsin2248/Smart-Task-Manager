// ==========================
// Select Elements
// ==========================

const searchEmptyMessage =
document.querySelector(
    ".search-empty-message"
);
const taskTitle = document.getElementById("taskTitle");
const themeBtn = document.getElementById("themeBtn");
const appLogo = document.getElementById("appLogo");
const importInput = document.getElementById("importInput");
const exportBtn = document.getElementById("exportBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const toast = document.getElementById("toast");
const sortSelect = document.getElementById("sortSelect");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
const searchInput = document.getElementById("searchInput");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// ==========================
// Global Array
// ==========================

let tasks = [];
let editTaskId = null;
const editModal =
document.getElementById("editModal");

const editTitle =
document.getElementById("editTitle");

const editDescription =
document.getElementById("editDescription");

const editPriority =
document.getElementById("editPriority");

const editDueDate =
document.getElementById("editDueDate");

const updateTaskBtn =
document.getElementById("updateTaskBtn");

const closeEditModal =
document.getElementById("closeEditModal");

const deleteModal =
document.getElementById(
    "deleteModal"
);

const deleteModalText =
document.getElementById(
    "deleteModalText"
);

const confirmDeleteBtn =
document.getElementById(
    "confirmDeleteBtn"
);

const cancelDeleteBtn =
document.getElementById(
    "cancelDeleteBtn"
);
const clearAllModal =
document.getElementById(
    "clearAllModal"
);

const clearAllModalText =
document.getElementById(
    "clearAllModalText"
);

const confirmClearBtn =
document.getElementById(
    "confirmClearBtn"
);

const cancelClearBtn =
document.getElementById(
    "cancelClearBtn"
);
let deleteTaskId = null;

// ==========================
// Load Tasks
// ==========================
function showToast(
    message,
    type = "success"
){

    const toastContainer =
        document.getElementById(
            "toastContainer"
        );

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    let icon = "";

    switch(type){

    case "success":
        icon =
        `<i class="fa-solid fa-circle-check"></i>`;
        break;

    case "error":
        icon =
        `<i class="fa-solid fa-circle-xmark"></i>`;
        break;

    case "warning":
        icon =
        `<i class="fa-solid fa-triangle-exclamation"></i>`;
        break;

    case "info":
        icon =
        `<i class="fa-solid fa-rotate-left"></i>`;
        break;

    case "pin":
    icon =
    `<i class="fa-solid fa-thumbtack"></i>`;
    break;

    case "unpin":
    icon =
    `<i class="fa-solid fa-thumbtack-slash"></i>`;
    break;
    
    case "reorder":
icon =
`<i class="fa-solid fa-arrows-up-down-left-right"></i>`;
break;
    default:
        icon =
        `<i class="fa-solid fa-bell"></i>`;
}
toast.innerHTML = `
    <div class="toast-icon">${icon}</div>

    <div class="toast-message">
        ${message}
    </div>

    <div class="toast-progress"></div>
`;

    toastContainer.appendChild(
        toast
    );
toast.classList.add(
    "toast",
    type
);
    setTimeout(()=>{
        toast.classList.add(
            "show"
        );
    },50);

    setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

        setTimeout(()=>{
            toast.remove();
        },400);

    },3500);

}

window.addEventListener("DOMContentLoaded", () => {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

        tasks.forEach(task=>{

    if(task.pinned === undefined){

        task.pinned = false;

    }

});
tasks.forEach(task=>{

    if(task.order === undefined){

        task.order = task.id;

    }

});

        renderTasks();

    }

});

// ==========================
// Add Button
// ==========================

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        // Mobile & PC এ Enter = New Line

        return;

    }

});
taskTitle.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        e.preventDefault();

        taskInput.focus();

    }

});


function addTask() {

    const taskTitleText = taskTitle.value.trim();

const taskText = taskInput.value.trim();

if (taskTitleText === "" && taskText === "") {

    showToast(
    "Please enter a title or note!",
    "warning"
);

    return;

}
    // ==========================
    // Add New Task
    // ==========================

    else {

        const task = {

    id: Date.now(),

    title: taskTitleText,

    text: taskText,

    priority: prioritySelect.value,

    dueDate: dueDateInput.value,

    completed: false,

    pinned: false,

    order: Date.now()

};

        tasks.push(task);

        showToast(
    "Task added successfully!",
    "success"
);

    }

    saveTasks();

    renderTasks();
    taskTitle.value = "";

taskInput.value = "";

taskInput.style.height = "90px";

    prioritySelect.value = "Medium";

    dueDateInput.value = "";

    taskInput.focus();

}

// ==========================
// Save Local Storage
// ==========================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// ==========================
// Render
// ==========================

function renderTasks() {

    taskList.innerHTML = "";
    searchEmptyMessage.style.display =
    "none";

    const searchText = searchInput.value.toLowerCase();

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <li class="empty-message">
                No tasks available.
            </li>
        `;

        updateStats();
        return;
    }
let sortedTasks = [...tasks];

switch(sortSelect.value){

    case "oldest":

        sortedTasks.sort((a,b)=>a.id-b.id);

        break;

    case "priority":

        const priorityOrder = {
            High:1,
            Medium:2,
            Low:3
        };

        sortedTasks.sort(
            (a,b)=>
            priorityOrder[a.priority]-priorityOrder[b.priority]
        );

        break;

    case "date":

        sortedTasks.sort((a,b)=>{

            if(!a.dueDate) return 1;

            if(!b.dueDate) return -1;

            return new Date(a.dueDate)-new Date(b.dueDate);

        });

        break;

    default:

        sortedTasks.sort((a,b)=>b.id-a.id);

}
sortedTasks.sort((a,b)=>{

    if(
        a.pinned &&
        !b.pinned
    ){
        return -1;
    }

    if(
        !a.pinned &&
        b.pinned
    ){
        return 1;
    }

    return (
        a.order -
        b.order
    );

});
    let visibleTasks = 0;
sortedTasks
.filter(task => {

    const matchesSearch =
    (task.title || "").toLowerCase().includes(searchText) ||
    (task.text || "")
    .toLowerCase()
    .includes(searchText);

const matchesFilter =

        currentFilter === "all"

        ||

        (currentFilter === "completed" && task.completed)

        ||

        (currentFilter === "pending" && !task.completed);

    const visible =
matchesSearch &&
matchesFilter;

if(visible){
    visibleTasks++;
}

return visible;

})

.forEach((task) => {
        const taskItem =
document.createElement("li");

taskItem.dataset.id =
    task.id;

taskItem.classList.add(
    "task-item"
);
        taskItem.classList.add("task-item");
        


        if(task.completed){
    taskItem.classList.add("completed-task");
}
        
    if(task.priority){
    taskItem.classList.add(
        task.priority.toLowerCase()
    );
}

let dueStatus = "";

const today = new Date();
today.setHours(0,0,0,0);

if (task.dueDate && !task.completed && window.innerWidth > 768) {

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0,0,0,0);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {

        dueStatus = `
        <span class="due-status overdue">
            <i class="ti ti-alert-triangle"></i>
            ${Math.abs(diffDays)} day overdue
        </span>
        `;

    }

    else if (diffDays === 0) {

        dueStatus = `
        <span class="due-status today">
            <i class="ti ti-bolt"></i>
            Today
        </span>
        `;

    }

    else if (diffDays === 1) {

        dueStatus = `
        <span class="due-status tomorrow">
            <i class="ti ti-sun-high"></i>
            Tomorrow
        </span>
        `;

    }

    else {

        dueStatus = `
        <span class="due-status upcoming">
            <i class="ti ti-clock-hour-4"></i>
            ${diffDays} days left
        </span>
        `;

    }

}
        taskItem.innerHTML = `
<div class="task-content
${task.completed ? "completed-card" : ""}">

${task.completed ? `
<div class="
completed-stamp
${task.justCompleted ? "animate" : ""}
">
    COMPLETED
</div>
` : ""}

    <div class="task-card-top">

        <div class="task-card-left">

    <span class="priority-dot ${task.priority.toLowerCase()}"></span>

    <div class="task-info">

        <h3 class="task-title ${task.completed ? "completed" : ""}">
            ${task.title || "Untitled Task"}
        </h3>

        <p class="task-text ${task.completed ? "completed" : ""}">
            ${
                task.text
                ? task.text.replace(/\n/g,"<br>")
                : "<span class='empty-note'>No description added.</span>"
            }
        </p>

    </div>

</div>

        <div class="task-actions">

        <button class="
pin-btn
${task.pinned ? "active" : ""}
"
${task.completed ? "disabled" : ""}
>

    <i class="ti ${
    task.pinned
    ? "ti-pinned"
    : "ti-pin"
}"></i>

</button>

            <button class="complete-btn">
    <i class="ti ${
        task.completed
        ? "ti ti-arrow-back-up"
        : "ti-check"
    }"></i>
</button>

            <button class="edit-btn">
                <i class="ti ti-pencil"></i>
            </button>

            <button class="delete-btn">
                <i class="ti ti-trash"></i>
            </button>

        </div>

    </div>

    <div class="task-card-footer">

    <span class="priority-badge ${task.priority.toLowerCase()}">
        ${task.priority} Priority
    </span>

    <div class="task-date-section">

        <div class="task-date-info">

    <span class="due-date">
        <i class="fa-regular fa-calendar"></i>

        ${
            task.dueDate
            ? task.dueDate
            : "No Deadline"
        }

    </span>

    ${
        window.innerWidth > 768
        ? dueStatus
        : ""
    }

</div>

    </div>

</div>

</div>
`;
const pinBtn =
taskItem.querySelector(
    ".pin-btn"
);
pinBtn.addEventListener(
    "click",
    ()=>{

        task.pinned =
            !task.pinned;

        saveTasks();

        renderTasks();

        showToast(

    task.pinned
    ? "Task pinned to top!"
    : "Task removed from pinned section.",

    task.pinned
    ? "pin"
    : "unpin"

);

    }
);
        // Complete Button
        const completeBtn = taskItem.querySelector(".complete-btn");

        completeBtn.addEventListener("click", () => {

    

    // Complete Animation
    if(!task.completed){

        taskItem.classList.add(
            "task-finishing"
        );

        setTimeout(()=>{

            taskItem.classList.add(
                "task-finishing-stage2"
            );
            const card =
taskItem.querySelector(
    ".task-content"
);

card.classList.add(
    "animate-stamp"
);
const stamp =
card.querySelector(
    ".completed-stamp"
);

if(stamp){

    stamp.classList.add(
        "animate"
    );

}

        },320);

        setTimeout(()=>{

    task.completed = true;

    task.justCompleted = true;

    saveTasks();

    renderTasks();

    showToast(
        "Task marked as completed!"
    );

    setTimeout(()=>{

        task.justCompleted = false;

        saveTasks();

    },1000);

},750);

    }

    // Undo Animation
    else{

        taskItem.classList.add(
            "task-restoring-live"
        );

        setTimeout(()=>{

            task.completed = false;

            task.justCompleted = false;

            saveTasks();

            renderTasks();

            showToast(
                "Task restored successfully!",
                "info"
            );

        },600);

    }

});

        // Delete Button
        const deleteBtn =
taskItem.querySelector(
    ".delete-btn"
);

deleteBtn.addEventListener(
    "click",
    ()=>{

        deleteTaskId =
        task.id;

        deleteModalText.innerHTML =
        `Are you sure you want to delete
        <strong>
        "${task.title || "Untitled Task"}"
        </strong>?`;

        deleteModal.classList.add(
            "show"
        );

    }
);

        // Edit Button
        const editBtn = taskItem.querySelector(".edit-btn");

        editBtn.addEventListener("click",()=>{

    editTaskId = task.id;

    editTitle.value =
    task.title || "";

    editDescription.value =
    task.text || "";

    editPriority.value =
    task.priority;

    editDueDate.value =
    task.dueDate;

    editModal.classList.add(
        "active"
    );

});

taskList.appendChild(
    taskItem
);

 });
    
if(
    visibleTasks === 0 &&
    tasks.length > 0
){

    taskList.appendChild(
        searchEmptyMessage
    );

    searchEmptyMessage.style.display =
    "flex";

    const icon =
    searchEmptyMessage.querySelector("i");

    const title =
    searchEmptyMessage.querySelector("p");

    const subtitle =
    searchEmptyMessage.querySelector("span");

    if(currentFilter === "completed"){

        icon.className =
        "ti ti-circle-check";

        title.textContent =
        "No completed tasks yet";

        subtitle.textContent =
        "Complete a task to see it here.";

    }

    else if(
        currentFilter === "pending"
    ){

        icon.className =
        "ti ti-sparkles";

        title.textContent =
        "You're all caught up";

        subtitle.textContent =
        "No pending tasks remaining.";

    }

    else{

        icon.className =
        "ti ti-search-off";

        title.textContent =
        "No matching tasks found";

        subtitle.textContent =
        "Try changing your search keyword or filters.";

    }

}
    updateStats();
    const completed =
    tasks.filter(
        task => task.completed
    ).length;

const total =
    tasks.length;

const percentage =
    total === 0
    ? 0
    : Math.round(
        (completed / total) * 100
    );

animateProgress(
    percentage
);

}
let dragScrollInterval = null;

function stopDragScroll(){

    if(dragScrollInterval){

        clearInterval(
            dragScrollInterval
        );

        dragScrollInterval = null;

    }

}
new Sortable(
    taskList,
    {

        animation:120,

        scroll:true,

        bubbleScroll:true,

        emptyInsertThreshold:5,

        fallbackTolerance:3,

        delay:180,

delayOnTouchOnly:true,

touchStartThreshold:5,

        ghostClass:"drag-ghost",

        chosenClass:"drag-chosen",

        dragClass:"drag-active",

        filter:".pin-btn.active",

        preventOnFilter:false,

        onStart:function(){

    if(
        taskList.children.length <= 1
    ){
        return false;
    }

},

        onMove:function(
    evt,
    originalEvent
){

    stopDragScroll();

    const mouseY =
        originalEvent.clientY;

    const topZone = 120;

    const bottomZone = 120;

    // Scroll Up
    if(
        mouseY <
        topZone
    ){

        dragScrollInterval =
            setInterval(()=>{

                window.scrollBy(
                    0,
                    -8
                );

            },16);

    }

    // Scroll Down
    else if(
        mouseY >
        window.innerHeight -
        bottomZone
    ){

        dragScrollInterval =
            setInterval(()=>{

                window.scrollBy(
                    0,
                    8
                );

            },16);

    }

    return true;

},

        onEnd:function(evt){
            stopDragScroll();
            if(
                evt.oldIndex ===
                evt.newIndex
            ){
                return;
            }

            const taskCards =
                [...taskList.children];

            taskCards.forEach(
                (
                    card,
                    index
                )=>{

                    const taskId =
                        Number(
                            card.dataset.id
                        );

                    const found =
                        tasks.find(
                            t =>
                            t.id === taskId
                        );

                    if(
                        found
                    ){

                        found.order =
                            index;

                    }

                }
            );

            saveTasks();

            renderTasks();

            showToast(
                "Tasks reordered successfully!",
                "reorder"
            );

        }

    }
);

function updateStats() {

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

}
function animateProgress(
    target
){

    const start =
        parseInt(
            progressText.textContent
        ) || 0;

    const duration = 600;

    const startTime =
        performance.now();

    function update(
        currentTime
    ){

        const progress =
            Math.min(
                (
                    currentTime -
                    startTime
                ) / duration,
                1
            );

        const value =
            Math.round(
                start +
                (
                    target -
                    start
                ) *
                progress
            );

        progressFill.style.width =
            value + "%";

        progressText.textContent =
            value + "%";

        if(
            progress < 1
        ){

            requestAnimationFrame(
                update
            );

        }

    }

    requestAnimationFrame(
        update
    );

}
searchInput.addEventListener("input", renderTasks);
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});
sortSelect.addEventListener("change",renderTasks);
clearAllBtn.addEventListener(
    "click",
    ()=>{

        if(tasks.length === 0){

            showToast(
                "There are no tasks to clear!",
                "warning"
            );

            return;
        }

        clearAllModalText.innerHTML = `
        Are you sure you want to permanently clear
        <strong>${tasks.length}</strong>
        tasks from your workspace.
        `;

        clearAllModal.classList.add(
            "show"
        );

    }
);
exportBtn.addEventListener("click", () => {

    if (tasks.length === 0) {

        showToast(
    "There are no tasks to export!",
    "warning"
);

        return;

    }

    const data = JSON.stringify(tasks, null, 2);

    const blob = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "tasks.json";

    link.click();

    URL.revokeObjectURL(url);

    showToast("Tasks exported successfully!");

});
importInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const importedTasks = JSON.parse(e.target.result);

            if (!Array.isArray(importedTasks)) {

                throw new Error();

            }

            tasks = importedTasks;

            saveTasks();

            renderTasks();

            showToast("Tasks imported successfully!");

        } catch {

            showToast(
    "Invalid JSON file!",
    "error"
);

        }

    };

    reader.readAsText(file);

});
const savedTheme = localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

    themeBtn.textContent="☀️ Light Mode";
themeBtn.style.background="#f3f4f6";
themeBtn.style.color="#111827";
    

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");
    

    if(document.body.classList.contains("dark")){

    localStorage.setItem("theme","dark");

    themeBtn.textContent="☀️ Light Mode";
    themeBtn.style.background="#f3f4f6";
themeBtn.style.color="#111827";



}else{

    localStorage.setItem("theme","light");

    themeBtn.textContent="🌙 Dark Mode";
themeBtn.style.background="#111827";
themeBtn.style.color="#ffffff";
    

}

});
// ==========================
// Auto Expand Textarea
// ==========================

taskInput.addEventListener("input", function () {

    this.style.height = "auto";

    this.style.height = this.scrollHeight + "px";

});  
flatpickr("#dueDate",{
    dateFormat:"d M, Y",
    minDate:"today",
    disableMobile:true,
    animate:true
});
closeEditModal.addEventListener(
"click",
()=>{
    editModal.classList.remove(
        "active"
    );
});

updateTaskBtn.addEventListener(
"click",
()=>{

    const task =
    tasks.find(
        t=>t.id===editTaskId
    );

    if(!task) return;

    task.title =
    editTitle.value.trim();

    task.text =
    editDescription.value.trim();

    task.priority =
    editPriority.value;

    task.dueDate =
    editDueDate.value;

    saveTasks();

    renderTasks();

    editModal.classList.remove(
        "active"
    );

    showToast(
        "Task updated successfully!"
    );

});
flatpickr("#editDueDate",{

    dateFormat:"d M, Y",

    minDate:"today",

    disableMobile:true,

    animate:true

});
confirmDeleteBtn.addEventListener(
    "click",
    ()=>{

        tasks =
        tasks.filter(
            t =>
            t.id !== deleteTaskId
        );

        saveTasks();

        renderTasks();

        deleteModal.classList.remove(
            "show"
        );

        showToast(
            "Task deleted successfully!",
            "error"
        );

    }
);

cancelDeleteBtn.addEventListener(
    "click",
    ()=>{

        deleteModal.classList.remove(
            "show"
        );

    }
);
confirmClearBtn.addEventListener(
    "click",
    ()=>{

        tasks = [];

        saveTasks();

        renderTasks();

        clearAllModal.classList.remove(
            "show"
        );

        showToast(
            "All tasks deleted successfully!",
            "error"
        );

    }
);
cancelClearBtn.addEventListener(
    "click",
    ()=>{

        clearAllModal.classList.remove(
            "show"
        );

    }
);
document.addEventListener(
    "keydown",
    (e)=>{

        if(e.key === "Escape"){

            // Close Edit Modal
            if(
                editModal.classList.contains(
                    "active"
                )
            ){

                editModal.classList.remove(
                    "active"
                );

            }

            // Close Delete Modal
            if(
                deleteModal.classList.contains(
                    "show"
                )
            ){

                deleteModal.classList.remove(
                    "show"
                );

            }

            // Close Clear All Modal
            if(
                clearAllModal.classList.contains(
                    "show"
                )
            ){

                clearAllModal.classList.remove(
                    "show"
                );

            }

        }

    }
);

