// Mock login function
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === "user" && password === "123") {
    window.location.href = "main.html"; // Redirect to user page
  } else if (username === "admin" && password === "123") {
    window.location.href = "admin/admin.html"; // Redirect to admin page
  } else {
    alert("Invalid username or password!");
  }
}

// Allow Enter key to trigger login
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission if inside a form
    login();
  }
});

// Profile dropdown menu
const userMenuButton = document.getElementById('userMenuButton');
const userDropdown = document.getElementById('userDropdown');

// Toggle dropdown on click
if (userMenuButton && userDropdown) {
  userMenuButton.addEventListener('click', () => {
    userDropdown.classList.toggle('hidden');
  });

  // Close dropdown if clicked outside
  document.addEventListener('click', (e) => {
    if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.add('hidden');
    }
  });
}
