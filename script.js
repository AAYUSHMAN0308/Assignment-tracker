let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  let title = document.getElementById("title").value;
  let date = document.getElementById("date").value;

  if (title === "" || date === "") {
    alert("Fill all fields!");
    return;
  }

  tasks.push({ title, date, completed: false });
  saveTasks();
  showTasks();

  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
}

function showTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        ${task.title} (Due: ${task.date})
      </span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  showTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  showTasks();
}

// Initial Load
function showTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  let today = new Date().toISOString().split("T")[0];

  tasks.forEach((task, index) => {
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
        <button class="delete-btn" onclick="deleteTask(${index})">🗑 Delete</button>
      </div>
    `;

    // Deadline alert
    if (task.date < today && !task.completed) {
      li.style.background = "#ffcccc";
    }

    list.appendChild(li);
  });
drawChart();

  updateProgress();
}
updateProgress();
function updateProgress() {
  let completed = tasks.filter(t => t.completed).length;
  let total = tasks.length;

  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progress").innerText = "Progress: " + percent + "%";
}
function toggleDark() {
  document.body.classList.toggle("dark");
}
function drawChart() {
  let completed = tasks.filter(t => t.completed).length;
  let pending = tasks.length - completed;

  let ctx = document.getElementById('myChart').getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ['green', 'red']
      }]
    }
  });
}