document.addEventListener("DOMContentLoaded", () => {

  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const darkToggle = document.getElementById("darkToggle");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";
  let searchQuery = "";

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function saveAndRender() {
    saveTasks();
    render();
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
      id: Date.now(),
      text,
      completed: false
    });

    taskInput.value = "";
    saveAndRender();
  }

  addBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter.active")?.classList.remove("active");
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  function toggleSearchVisibility() {
    if (tasks.length > 10) {
      searchInput.classList.remove("search-hidden");
      searchInput.classList.add("search-visible");
    } else {
      searchInput.classList.remove("search-visible");
      searchInput.classList.add("search-hidden");
      searchInput.value = "";
      searchQuery = "";
    }
  }

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
        saveAndRender();
      };

      const span = document.createElement("span");
      span.textContent = task.text;

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash");

      deleteIcon.onclick = (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);
        saveAndRender();
      };

      li.appendChild(span);
      li.appendChild(deleteIcon);
      taskList.appendChild(li);
    });

    updateCounter();
    updateProgress();
    toggleSearchVisibility();
  }

  function updateCounter() {
    const remaining = tasks.filter(t => !t.completed).length;
    taskCounter.textContent =
      `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;
  }

  function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";
    progressText.textContent = percent + "% Completed";

    if (percent === 100 && total > 0) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  /* Background Slideshow */
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function changeSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  setInterval(changeSlide, 5000);

  render();
});