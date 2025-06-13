// main.js

// Function to show a custom message box (moved from index.htm)
function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`;
        messageBox.classList.remove('hidden');

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML content into a placeholder
    function loadComponent(placeholderId, filePath, callback) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - Could not load ${filePath}`);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                    if (callback && typeof callback === 'function') {
                        callback(); // Execute callback after component is loaded and rendered
                    }
                } else {
                    console.warn(`Placeholder #${placeholderId} not found for ${filePath}`);
                }
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = `<p class="text-red-500 text-center py-4">Failed to load ${filePath.split('/').pop()}.</p>`;
                }
            });
    }

    // Initialize Navbar dynamic elements and event listeners
    function initializeNavbar() {
        const logoutButton = document.getElementById('logout-button');
        const logoutConfirmModal = document.getElementById('logout-confirm-modal');
        const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
        const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
        const navUsername = document.getElementById('nav-username');
        const navRole = document.getElementById('nav-role');
        const notificationBell = document.getElementById('notification-bell'); // Assuming this exists in navbar.htm
        const notificationBadge = document.getElementById('notification-badge'); // Assuming this exists in navbar.htm
        const notificationsDropdown = document.getElementById('notifications-dropdown'); // Assuming this exists in navbar.htm
        const markAllReadBtn = document.getElementById('mark-all-read-btn');

        // Populate user info in navbar
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            try {
                const user = JSON.parse(loggedInUser);
                if (navUsername) navUsername.textContent = user.username || 'User';
                if (navRole) navRole.textContent = user.role || 'Role';
            } catch (e) {
                console.error('Error parsing loggedInUser from sessionStorage:', e);
                sessionStorage.removeItem('loggedInUser'); // Clear invalid data
                window.location.href = 'index.htm'; // Redirect to login
            }
        } else {
            // If no user is logged in, ensure we are on the login page or redirect
            if (!['index.htm', ''].includes(window.location.pathname.split('/').pop())) {
                 window.location.href = 'index.htm';
            }
        }

        // Logout button functionality
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                if (logoutConfirmModal) {
                    logoutConfirmModal.classList.remove('hidden');
                }
            });
        }

        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', function() {
                if (logoutConfirmModal) {
                    logoutConfirmModal.classList.add('hidden');
                }
            });
        }

        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener('click', function() {
                // Clear session storage or any login tokens
                sessionStorage.removeItem('loggedInUser');
                // Redirect to login page
                window.location.href = 'index.htm';
            });
        }

        // Close modal if clicking outside (optional, but good UX)
        if (logoutConfirmModal) {
            logoutConfirmModal.addEventListener('click', function(event) {
                if (event.target === logoutConfirmModal) {
                    logoutConfirmModal.classList.add('hidden');
                }
            });
        }

        // Initialize Notifications
        // This part would ideally be in a separate notifications.js or a more robust module
        // But for this structure, it remains here.
        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

        function updateNotificationsUI() {
            if (!notificationsList) return; // Ensure element exists

            notificationsList.innerHTML = ''; // Clear existing
            const unreadNotifications = notifications.filter(n => !n.read);
            if (unreadNotifications.length > 0) {
                notificationBadge.textContent = unreadNotifications.length;
                notificationBadge.classList.remove('hidden');
            } else {
                notificationBadge.classList.add('hidden');
            }

            if (notifications.length === 0) {
                notificationsList.innerHTML = '<li class="p-3 text-gray-500">No new notifications.</li>';
            } else {
                notifications.forEach(notif => {
                    const li = document.createElement('li');
                    li.className = `p-3 border-b border-gray-100 last:border-b-0 ${notif.read ? 'text-gray-500' : 'font-semibold text-gray-800'}`;
                    li.innerHTML = `
                        <div>${notif.message}</div>
                        <div class="text-xs text-gray-400 mt-1">${notif.time}</div>
                    `;
                    notificationsList.appendChild(li);
                });
            }
            localStorage.setItem('notifications', JSON.stringify(notifications)); // Save to localStorage
        }

        if (notificationBell) {
            notificationBell.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent document click from closing it immediately
                if (notificationsDropdown) {
                    notificationsDropdown.classList.toggle('hidden');
                    updateNotificationsUI(); // Update UI when opening
                }
            });
        }

        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                notifications.forEach(notif => notif.read = true);
                updateNotificationsUI();
                if (notificationsDropdown) {
                    notificationsDropdown.classList.add('hidden');
                }
            });
        }

        window.addEventListener('click', function(event) {
            if (notificationBell && notificationsDropdown && !notificationBell.contains(event.target) && !notificationsDropdown.contains(event.target)) {
                notificationsDropdown.classList.add('hidden');
            }
        });

        // Initial update
        updateNotificationsUI();
    }

    // Load common components
    loadComponent('navbar-placeholder', 'navbar.htm', initializeNavbar); // Navbar needs initialization after loading
    loadComponent('sidebar-placeholder', 'sidebar.htm');
    loadComponent('logout-modal-placeholder', 'logout-modal.htm');

    // Authentication and Redirection Logic (for index.htm)
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const tabNavigation = document.getElementById('tab-navigation'); // Parent of tabs
    const loginRoleSelect = document.getElementById('login-role'); // For the login role selection

    function showLoginForm() {
        loginTab.classList.add('tab-active');
        signupTab.classList.remove('tab-active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }

    function showSignupForm() {
        signupTab.classList.add('tab-active');
        loginTab.classList.remove('tab-active');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    // Only set up login/signup logic if on index.htm
    if (loginForm && signupForm) {
        loginTab.addEventListener('click', showLoginForm);
        signupTab.addEventListener('click', showSignupForm);

        // Initial state
        showLoginForm(); // Default to showing login form

        // Login Form Submission
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, role })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(data.message, 'success');
                    sessionStorage.setItem('loggedInUser', JSON.stringify(data.user)); // Store user data
                    // Redirect based on role
                    setTimeout(() => {
                        switch (data.user.role) {
                            case 'admin': window.location.href = 'admin-dashboard.html'; break;
                            case 'student': window.location.href = 'student-dashboard.html'; break;
                            case 'teacher': window.location.href = 'teacher-dashboard.html'; break;
                            case 'parent': window.location.href = 'parent-dashboard.html'; break;
                            case 'headmaster': window.location.href = 'headmaster-dashboard.html'; break;
                            default: showMessage('Unknown role, redirect failed.', 'error');
                        }
                    }, 1000);
                } else {
                    showMessage(data.message || 'Login failed.', 'error');
                }
            } catch (error) {
                console.error('Error during login:', error);
                showMessage('An error occurred during login. Please try again later.', 'error');
            }
        });

        // Signup Form Submission
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const role = document.getElementById('signup-role').value;

            try {
                const response = await fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password, role })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(data.message, 'success');
                    // Optionally, automatically log in or redirect to login
                    setTimeout(() => {
                        showLoginForm();
                        document.getElementById('login-email').value = email; // Pre-fill login email
                    }, 1000);
                } else {
                    showMessage(data.message || 'Sign up failed.', 'error');
                }
            } catch (error) {
                console.error('Error during sign up:', error);
                showMessage('An error occurred during sign up. Please try again later.', 'error');
            }
        });

        // Logic: When 'Staff' or 'Admin' is selected, hide the 'Sign Up' tab and form
        loginRoleSelect.addEventListener('change', function() {
            if (loginRoleSelect.value === 'staff' || loginRoleSelect.value === 'admin' || loginRoleSelect.value === 'headmaster') { // Added headmaster
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
    }


    // Global authentication check and redirection (client-side)
    // This should ideally be handled by server-side authentication in a real app
    const currentPage = window.location.pathname.split('/').pop();
    const allowedPagesWithoutLogin = ['index.htm', '']; // Add other non-login pages if any

    if (!allowedPagesWithoutLogin.includes(currentPage)) {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            // alert('You must be logged in to access this page.');
            window.location.href = 'index.htm';
            return; // Stop further execution
        }

        // Optional: Redirect to correct dashboard if trying to access wrong one
        // (This is basic client-side check, proper authorization is server-side)
        const user = JSON.parse(loggedInUser);
        let expectedDashboard = '';
        switch (user.role) {
            case 'admin': expectedDashboard = 'admin-dashboard.html'; break;
            case 'student': expectedDashboard = 'student-dashboard.html'; break;
            case 'teacher': expectedDashboard = 'teacher-dashboard.html'; break;
            case 'parent': expectedDashboard = 'parent-dashboard.html'; break;
            case 'headmaster': expectedDashboard = 'headmaster-dashboard.html'; break;
        }

        if (currentPage !== expectedDashboard && expectedDashboard !== '') {
            // alert(`Redirecting to your ${user.role} dashboard.`);
            window.location.href = expectedDashboard;
        }
    }
});