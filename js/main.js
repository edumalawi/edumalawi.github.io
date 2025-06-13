document.addEventListener('DOMContentLoaded', function() {
    // main.js - Add this code inside your DOMContentLoaded listener

    // Get references to tabs and forms for index.htm
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabNavigation = document.getElementById('tab-navigation'); // This is the div containing your tabs

    // Function to show Login Form and activate Login tab
    function showLoginForm() {
        // Only proceed if elements exist (relevant for index.htm)
        if (loginForm && signupForm && loginTab && signupTab) {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');

            loginTab.classList.add('tab-active'); // Apply active style
            loginTab.classList.remove('text-gray-500', 'hover:text-indigo-600', 'hover:border-indigo-600'); // Remove inactive/hover styles

            signupTab.classList.remove('tab-active'); // Deactivate signup tab
            signupTab.classList.add('text-gray-500', 'hover:text-indigo-600', 'hover:border-indigo-600'); // Add inactive/hover styles
        }
    }

    // Function to show Sign Up Form and activate Sign Up tab
    function showSignupForm() {
        // Only proceed if elements exist (relevant for index.htm)
        if (loginForm && signupForm && loginTab && signupTab) {
            signupForm.classList.remove('hidden');
            loginForm.classList.add('hidden');

            signupTab.classList.add('tab-active'); // Apply active style
            signupTab.classList.remove('text-gray-500', 'hover:text-indigo-600', 'hover:border-indigo-600'); // Remove inactive/hover styles

            loginTab.classList.remove('tab-active'); // Deactivate login tab
            loginTab.classList.add('text-gray-500', 'hover:text-indigo-600', 'hover:border-indigo-600'); // Add inactive/hover styles
        }
    }

    // Event Listeners for the tabs on index.htm
    if (loginTab) {
        loginTab.addEventListener('click', showLoginForm);
    }
    if (signupTab) {
        signupTab.addEventListener('click', showSignupForm);
    }

    // Initial state: ensure login form is shown by default and tab is active when page loads
    // This should be done only if on index.htm
    if (window.location.pathname.split('/').pop() === 'index.htm' || window.location.pathname.split('/').pop() === '') {
        showLoginForm(); // Show login form by default on index.htm
    }

    // Handle login and signup form submissions (existing logic, ensure it's still present)
    const loginFormElement = document.getElementById('login-form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;

            // Simplified fetch for demonstration; in a real app, this would use proper error handling
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, role })
                });

                const data = await response.json();
                showMessage(data.message, data.type); // Display message box

                if (response.ok) {
                    // If login successful, save user info and redirect
                    sessionStorage.setItem('loggedInUser', JSON.stringify({ username: username, role: role }));

                    // Redirect to respective dashboard
                    let dashboardPage = '';
                    switch (role) {
                        case 'admin': dashboardPage = 'admin-dashboard.html'; break;
                        case 'student': dashboardPage = 'student-dashboard.html'; break;
                        case 'teacher': dashboardPage = 'teacher-dashboard.html'; break;
                        case 'parent': dashboardPage = 'parent-dashboard.html'; break;
                        case 'headmaster': dashboardPage = 'headmaster-dashboard.html'; break;
                        default: dashboardPage = 'index.htm'; // Fallback
                    }
                    window.location.href = dashboardPage;
                }
            } catch (error) {
                console.error('Error during login:', error);
                showMessage('An error occurred during login. Please try again later.', 'error');
            }
        });
    }

    const signupFormElement = document.getElementById('signup-form');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const role = document.getElementById('signup-role').value;

            try {
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password, role })
                });

                const data = await response.json();
                showMessage(data.message, data.type);

                if (response.ok) {
                    // Optionally auto-login or prompt to login after successful signup
                    console.log('Sign up successful, user needs to login.');
                    showLoginForm(); // Switch back to login form after successful signup
                }
            } catch (error) {
                console.error('Error during sign up:', error);
                showMessage('An error occurred during sign up. Please try again later.', 'error');
            }
        });
    }

    // Logic: When 'Staff' or 'Admin' is selected, hide the 'Sign Up' tab and form
    const loginRoleSelect = document.getElementById('login-role');
    if (loginRoleSelect) {
        loginRoleSelect.addEventListener('change', function() {
            if (loginRoleSelect.value === 'staff' || loginRoleSelect.value === 'admin' || loginRoleSelect.value === 'teacher' || loginRoleSelect.value === 'headmaster') {
                if (signupTab && signupForm && tabNavigation && loginTab) {
                    signupTab.classList.add('hidden'); // Hide the sign up tab
                    signupForm.classList.add('hidden'); // Ensure sign up form is hidden
                    showLoginForm(); // Always switch to login form
                    tabNavigation.classList.add('justify-center'); // Center the remaining tab
                    loginTab.classList.remove('flex-1'); // Remove flex-1 from login tab when alone
                    loginTab.classList.add('w-full'); // Make login tab full width when alone
                }
            } else {
                if (signupTab && signupForm && tabNavigation && loginTab) {
                    signupTab.classList.remove('hidden'); // Show the sign up tab for other roles
                    tabNavigation.classList.remove('justify-center'); // Reset centering
                    loginTab.classList.add('flex-1'); // Reset flex-1 for login tab
                    loginTab.classList.remove('w-full'); // Reset width for login tab
                }
            }
        });
    }
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
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            const navUsername = document.getElementById('nav-username');
            const navRole = document.getElementById('nav-role');
            if (navUsername) navUsername.textContent = loggedInUser.username;
            if (navRole) navRole.textContent = loggedInUser.role;
        }

        // Logout button listener (from navbar)
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                const logoutConfirmModal = document.getElementById('logout-confirm-modal');
                if (logoutConfirmModal) {
                    logoutConfirmModal.classList.remove('hidden');
                }
            });
        }
        // Note: notifications.js will attach listeners to bell and dropdown itself
    }

    // Initialize Logout Modal dynamic elements and event listeners
    function initializeLogoutModal() {
        const logoutConfirmModal = document.getElementById('logout-confirm-modal');
        const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
        const cancelLogoutBtn = document.getElementById('cancel-logout-btn');

        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener('click', function() {
                sessionStorage.removeItem('loggedInUser'); // Clear user session
                // Redirect to login page
                window.location.href = 'index.htm';
            });
        }

        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', function() {
                if (logoutConfirmModal) {
                    logoutConfirmModal.classList.add('hidden'); // Hide modal
                }
            });
        }

        // Close modal if clicked outside (optional, depends on design)
        if (logoutConfirmModal) {
            logoutConfirmModal.addEventListener('click', function(event) {
                if (event.target === logoutConfirmModal) {
                    logoutConfirmModal.classList.add('hidden');
                }
            });
        }
    }

    // Load Navbar (now from root)
    loadComponent('navbar-placeholder', 'navbar.html', initializeNavbar);

    // Load Logout Modal (now from root)
    loadComponent('logout-modal-placeholder', 'logout-modal.html', initializeLogoutModal);

    // Basic redirection if user is not logged in on a dashboard page
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