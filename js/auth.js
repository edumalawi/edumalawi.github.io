document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginRoleSelect = document.getElementById('login-role');
    const tabNavigation = document.getElementById('tab-navigation');

    // Helper function to show a custom message box
    function showMessage(message, type = 'info') {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = message;
        messageBox.className = `message-box show ${type}`; // Apply classes for styling
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    }

    // Function to show login form and activate login tab
    function showLoginForm() {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginTab.classList.add('border-indigo-600', 'text-indigo-600');
        loginTab.classList.remove('border-transparent', 'text-gray-600');
        signupTab.classList.add('border-transparent', 'text-gray-600');
        signupTab.classList.remove('border-indigo-600', 'text-indigo-600');
    }

    // Function to show signup form and activate signup tab
    function showSignupForm() {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        signupTab.classList.add('border-indigo-600', 'text-indigo-600');
        signupTab.classList.remove('border-transparent', 'text-gray-600');
        loginTab.classList.add('border-transparent', 'text-gray-600');
        loginTab.classList.remove('border-indigo-600', 'text-indigo-600');
    }

    // Initialize forms: show login form by default
    showLoginForm();

    // Event Listeners for Tab Switching
    loginTab.addEventListener('click', showLoginForm);
    signupTab.addEventListener('click', showSignupForm);

    // Get users from localStorage or set default
    let users = JSON.parse(localStorage.getItem('users')) || [
        { id: 'student1', username: 'student.malawi', email: 'student@edumalawi.com', password: 'password', role: 'student' },
        { id: 'teacher1', username: 'teacher.malawi', email: 'teacher@edumalawi.com', password: 'password', role: 'teacher' },
        { id: 'parent1', username: 'parent.malawi', email: 'parent@edumalawi.com', password: 'password', role: 'parent' },
        { id: 'headmaster1', username: 'headmaster.malawi', email: 'headmaster@edumalawi.com', password: 'password', role: 'headmaster' },
        { id: 'admin1', username: 'admin.malawi', email: 'admin@edumalawi.com', password: 'password', role: 'admin' }
    ];
    localStorage.setItem('users', JSON.stringify(users)); // Ensure defaults are in localStorage

    // Login Form Submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameOrEmail = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;

        // Basic validation
        if (!usernameOrEmail || !password || !role) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        const user = users.find(u =>
            (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
            u.password === password &&
            u.role === role
        );

        if (user) {
            showMessage(`Login successful as ${user.role}! Welcome, ${user.username}.`, 'success');
            // Simulate storing login status
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));

            // Redirect based on role
            switch (user.role) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'student':
                    window.location.href = 'student-dashboard.html';
                    break;
                case 'teacher':
                    window.location.href = 'teacher-dashboard.html';
                    break;
                case 'parent':
                    window.location.href = 'parent-dashboard.html';
                    break;
                case 'headmaster':
                    window.location.href = 'headmaster-dashboard.html';
                    break;
                default:
                    window.location.href = 'index.htm'; // Fallback
            }
        } else {
            showMessage('Invalid username/email, password, or role.', 'error');
        }
    });

    // Sign Up Form Submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newUsername = document.getElementById('signup-username').value;
        const newEmail = document.getElementById('signup-email').value;
        const newPassword = document.getElementById('signup-password').value;
        const newRole = document.getElementById('signup-role').value;

        if (!newUsername || !newEmail || !newPassword || !newRole) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        // Check if username or email already exists
        const userExists = users.some(u => u.username === newUsername || u.email === newEmail);
        if (userExists) {
            showMessage('Username or email already exists.', 'error');
            return;
        }

        const newId = `user${users.length + 1}`; // Simple ID generation
        const newUser = {
            id: newId,
            username: newUsername,
            email: newEmail,
            password: newPassword,
            role: newRole
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users)); // Save updated users to localStorage
        showMessage('Registration successful! You can now log in.', 'success');
        signupForm.reset();
        showLoginForm(); // Switch back to login form after successful registration
    });

    // Logic: When 'Staff' or 'Admin' is selected in login, hide the 'Sign Up' tab and form
    loginRoleSelect.addEventListener('change', function() {
        if (loginRoleSelect.value === 'teacher' || loginRoleSelect.value === 'headmaster' || loginRoleSelect.value === 'admin') {
            signupTab.classList.add('hidden'); // Hide the sign up tab
            signupForm.classList.add('hidden'); // Ensure sign up form is hidden
            showLoginForm(); // Always switch to login form
            tabNavigation.classList.add('justify-center'); // Center the remaining tab
            loginTab.classList.remove('flex-1'); // Remove flex-1 from login tab when alone
            loginTab.classList.add('w-full'); // Make login tab full width when alone
        } else {
            signupTab.classList.remove('hidden'); // Show the sign up tab for other roles
            tabNavigation.classList.remove('justify-center'); // Reset centering
            loginTab.classList.add('flex-1'); // Reset flex-1 for login tab
            loginTab.classList.remove('w-full'); // Reset width for login tab
        }
    });
});