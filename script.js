let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart;
let currentFilter = "all";

// ✅ SAVE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ ADD TASK
function addTask() {
  let title = document.getElementById("title").value.trim();
  let date = document.getElementById("date").value;

  if (title === "" || date === "") {
    alert("Fill all fields!");
    return;
  }

  tasks.push({ title, date, completed: false });

  saveTasks();
  showTasks();

  // 🔔 Reminder
  let today = new Date().toISOString().split("T")[0];
  if (date === today) {
    alert("⚠ Assignment due TODAY!");
  }

  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
}

// ✅ FILTER
function filterTasks(type) {
  currentFilter = type;
  showTasks();
}

// ✅ SHOW TASKS
function showTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  let today = new Date().toISOString().split("T")[0];

  // 🔥 SORT BY DATE
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (tasks.length === 0) {
    list.innerHTML = "<p style='text-align:center'>No assignments yet 📭</p>";
    updateProgress();
    drawChart();
    return;
  }

  tasks.forEach((task, index) => {

    // 🔍 FILTER
    if (currentFilter === "completed" && !task.completed) return;
    if (currentFilter === "pending" && task.completed) return;

    let li = document.createElement("li");

    li.innerHTML = `
      <div class="task-top">
        <span class="task-title ${task.completed ? 'completed' : ''}">
          ${task.title}
        </span>
        <span class="task-date">📅 ${task.date}</span>
      </div>

      <div class="task-buttons">
        <button class="complete-btn" onclick="toggleTask(${index})">✔ Done</button>
        <button onclick="editTask(${index})">✏ Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">🗑 Delete</button>
      </div>
    `;

    // 🔴 Late
    if (task.date < today && !task.completed) {
      li.style.background = "#ffcccc";
    }

    // 🟧 Today/Tomorrow
    let dueDate = new Date(task.date);
    let now = new Date();
    let diff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (diff <= 1 && diff >= 0 && !task.completed) {
      li.style.border = "2px solid orange";
    }

    list.appendChild(li);
  });

  updateProgress();
  drawChart();
}

// ✅ EDIT TASK
function editTask(index) {
  let newTitle = prompt("Edit assignment:", tasks[index].title);
  let newDate = prompt("Edit date (YYYY-MM-DD):", tasks[index].date);

  if (newTitle && newDate) {
    tasks[index].title = newTitle.trim();
    tasks[index].date = newDate;

    saveTasks();
    showTasks();
  }
}

// ✅ TOGGLE
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;

  // 🎉 Animation feel
  if (tasks[index].completed) {
    alert("🎉 Task Completed!");
  }

  saveTasks();
  showTasks();
}

// ✅ DELETE
function deleteTask(index) {
  if (confirm("Delete this assignment?")) {
    tasks.splice(index, 1);
    saveTasks();
    showTasks();
  }
}

// ✅ CLEAR ALL
function clearAll() {
  if (confirm("Delete all assignments?")) {
    tasks = [];
    saveTasks();
    showTasks();
  }
}

// ✅ PROGRESS
function updateProgress() {
  let completed = tasks.filter(t => t.completed).length;
  let total = tasks.length;

  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progress").innerText = "Progress: " + percent + "%";
  document.getElementById("progress-fill").style.width = percent + "%";
}

// ✅ DARK MODE (SAVE)
function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Load dark mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// ✅ GREETING
function setGreeting() {
  let hour = new Date().getHours();
  let text = "Hello 👋";

  if (hour < 12) text = "Good Morning ☀";
  else if (hour < 18) text = "Good Afternoon 🌤";
  else text = "Good Evening 🌙";

  document.getElementById("greeting").innerText = text;
}

setGreeting();

// ✅ GRAPH
function drawChart() {
  if (chart) chart.destroy();

  let completed = tasks.filter(t => t.completed).length;
  let pending = tasks.length - completed;

  let ctx = document.getElementById('myChart').getContext('2d');

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ['#4CAF50', '#f44336']
      }]
    }
  });
}

// 🔍 SEARCH
function searchTask() {
  let input = document.getElementById("search").value.toLowerCase();
  let listItems = document.querySelectorAll("li");

  listItems.forEach(li => {
    let text = li.innerText.toLowerCase();
    li.style.display = text.includes(input) ? "flex" : "none";
  });
}

// ✅ LOAD
showTasks();