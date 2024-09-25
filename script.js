document.addEventListener("DOMContentLoaded", function () {
    checkUserSignIn();
    loadTasks();
    checkDarkMode();
});

// Handle email/password sign-in
function signInWithEmail() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Simulate authentication by storing email/password in localStorage
    if (email && password) {
        localStorage.setItem("emailUser", email);
        document.getElementById("sign-in-form").classList.add("hidden");
        document.getElementById("todo-section").classList.remove("hidden");
    } else {
        alert("Please enter both email and password.");
    }
}

// Handle Google Sign-In
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    console.log('User Signed In:', responsePayload);

    // Show the to-do section once signed in
    document.getElementById("sign-in-form").classList.add("hidden");
    document.getElementById("todo-section").classList.remove("hidden");

    // You can store user data like name or email in localStorage if needed
    localStorage.setItem("googleUser", responsePayload.email);
}

// Utility function to parse JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Check if user is already signed in
function checkUserSignIn() {
    const emailUser = localStorage.getItem("emailUser");
    const googleUser = localStorage.getItem("googleUser");
    
    if (emailUser || googleUser) {
        document.getElementById("sign-in-form").classList.add("hidden");
        document.getElementById("todo-section").classList.remove("hidden");
    }
}

// Add a task
function addTask() {
    const taskText = document.getElementById("new-task").value;
    if (taskText) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
        document.getElementById("new-task").value = '';
    }
}

// Load tasks
function loadTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.classList.toggle("completed", task.completed);
        li.onclick = () => completeTask(index);
        taskList.appendChild(li);
    });
}

// Mark task as complete and trigger confetti
function completeTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();

    if (tasks[index].completed) {
        confettiAnimation();
    }
}

// Confetti animation function
function confettiAnimation() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Toggle dark/light mode
function toggleMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
}

// Check for previously selected dark mode
function checkDarkMode() {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "true") {
        document.body.classList.add("dark-mode");
    }
}
