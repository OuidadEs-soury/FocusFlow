const API = "http://localhost:5000/tasks";
let timer;
let timeLeft = 1500;

async function loadTasks() {
    const res = await fetch(API);
    const tasks = await res.json();
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let completedCount = 0;

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title;

        if (task.completed) {
            li.classList.add("completed");
            completedCount++;
        }

        li.onclick = () => toggleTask(task._id);
        li.ondblclick = () => deleteTask(task._id);

        list.appendChild(li);
    });

    document.getElementById("statsText").textContent =
        `${completedCount} tasks completed`;
}

async function addTask() {
    const input = document.getElementById("taskInput");
    if (!input.value) return;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input.value })
    });

    input.value = "";
    loadTasks();
}

async function toggleTask(id) {
    await fetch(`${API}/${id}`, { method: "PUT" });
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadTasks();
}

function startTimer() {
    let timer;
let timeLeft = 1500;

function startTimer() {
    if (timer) return;

    timer = setInterval(() => {
        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        document.getElementById("timerDisplay").textContent =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;

            document.getElementById("alarmSound").play();
            document.querySelector(".container").style.boxShadow =
                "0 0 40px #4e73df";
        }
    }, 1000);
}
    if (timer) return;

    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timerDisplay").textContent =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeLeft <= 0) clearInterval(timer);
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 1500;
    document.getElementById("timerDisplay").textContent = "25:00";
}

loadTasks();
// Theme Toggle
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }
});