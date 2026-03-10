document.addEventListener("DOMContentLoaded", () => {

  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  const completeSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";
  let searchQuery = "";

  /* ================= ADD TASK ================= */

  addBtn.addEventListener("click", addTask);

  // ⌨ Add with Enter key
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveAndRender();
  }

  /* ================= SEARCH ================= */

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });

  /* ================= FILTERS ================= */

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter.active").classList.remove("active");
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  /* ================= RENDER ================= */

  function render() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(searchQuery);

      if (currentFilter === "active") return !task.completed && matchesSearch;
      if (currentFilter === "completed") return task.completed && matchesSearch;
      return matchesSearch;
    });

    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      li.onclick = () => {
        task.completed = !task.completed;

        if (task.completed) {
          completeSound.currentTime = 0;
          completeSound.play();
        }

        saveAndRender();
      };

      const span = document.createElement("span");
      span.textContent = task.text;

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash");

      deleteIcon.onclick = (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t !== task);
        saveAndRender();
      };

      li.appendChild(span);
      li.appendChild(deleteIcon);
      taskList.appendChild(li);
    });

    updateCounter();
    updateProgress();
  }

  /* ================= COUNTER ================= */

  function updateCounter() {
    const remaining = tasks.filter(t => !t.completed).length;
    taskCounter.textContent =
      `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;

    // 🔍 Show search only when tasks > 10
    if (tasks.length > 10) {
      searchInput.style.display = "block";
    } else {
      searchInput.style.display = "none";
      searchInput.value = "";
      searchQuery = "";
    }
  }

  /* ================= PROGRESS ================= */

  function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";
    progressText.textContent = percent + "% Completed";

    if (percent === 100 && total > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
  }

  render();


  /* ================= BACKGROUND SLIDESHOW ================= */

  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function changeSlide() {
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  setInterval(changeSlide, 5000);

});