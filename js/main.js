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