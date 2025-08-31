//mock login function
function login() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (username === "User" && password === "123456") {
                window.location.href = "main.html"; // Redirect to user page
            } else if (username === "admin" && password === "admin123") {
                window.location.href = "admin/admin.html"; // Redirect to admin page
            } else {
                alert("Invalid username or password!");
            }
        }

// profile drop down menu
// Toggle Dropdown
   const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    // Toggle dropdown on click
    userMenuButton.addEventListener('click', () => {
      userDropdown.classList.toggle('hidden');
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (e) => {
      if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add('hidden');
      }
    });