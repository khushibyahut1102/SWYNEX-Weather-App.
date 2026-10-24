
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function displayTasks() {
	const taskCounter = document.getElementById("taskCounter");

const completedCount = tasks.filter(function(task) {
    return task.completed;
}).length;
const pendingCount = tasks.length - completedCount;

taskCounter.textContent =
    "Total Tasks: " + tasks.length +
    " | Completed: " + completedCount +
" | Pending: " + pendingCount;
    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const completeBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        span.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        completeBtn.textContent = task.completed ? "Undo" : "Done";
        completeBtn.addEventListener("click", function() {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        });

        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", function() {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.append(span, completeBtn, deleteBtn);
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        message.textContent = "Please enter a task!";
        message.style.color = "red";
        return;
    }

    tasks.push({ text: text, completed: false });
    saveTasks();
    displayTasks();

    taskInput.value = "";
    message.textContent = "Task saved successfully!";
    message.style.color = "green";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();
