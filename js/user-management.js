document.addEventListener('DOMContentLoaded', function() {
    const usersTableBody = document.getElementById('users-table-body');
    const searchInput = document.getElementById('search-input');
    const roleFilter = document.getElementById('role-filter');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');
    const addUserBtn = document.getElementById('add-user-btn');
    const addUserModal = document.getElementById('add-user-modal');
    const closeAddUserModal = document.getElementById('close-add-user-modal');
    const addUserForm = document.getElementById('add-user-form');

    let allUsers = JSON.parse(localStorage.getItem('users')) || []; // Use 'users' from localStorage
    const usersPerPage = 10;
    let currentPage = 1;

    // Function to render the users table
    function renderUsersTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterRole = roleFilter.value;

        // Filter users based on search term and role
        const filteredUsers = allUsers.filter(user => {
            const matchesSearch = user.username.toLowerCase().includes(searchTerm) ||
                                  user.email.toLowerCase().includes(searchTerm);
            const matchesRole = filterRole === '' || user.role === filterRole;
            return matchesSearch && matchesRole;
        });

        // Calculate pagination
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        usersTableBody.innerHTML = ''; // Clear existing rows

        if (paginatedUsers.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-gray-500">No users found.</td></tr>';
        } else {
            paginatedUsers.forEach(user => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-200 hover:bg-gray-50';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.username}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">${user.role}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button data-id="${user.id}" class="edit-user-btn text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button data-id="${user.id}" class="delete-user-btn text-red-600 hover:text-red-900">Delete</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });
        }

        // Update pagination controls
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Event Listeners for Filters and Pagination
    searchInput.addEventListener('input', () => {
        currentPage = 1; // Reset to first page on search
        renderUsersTable();
    });

    roleFilter.addEventListener('change', () => {
        currentPage = 1; // Reset to first page on filter change
        renderUsersTable();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsersTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterRole = roleFilter.value;
        const filteredUsers = allUsers.filter(user => {
            const matchesSearch = user.username.toLowerCase().includes(searchTerm) ||
                                  user.email.toLowerCase().includes(searchTerm);
            const matchesRole = filterRole === '' || user.role === filterRole;
            return matchesSearch && matchesRole;
        });
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            renderUsersTable();
        }
    });

    // Add User Modal functionality
    addUserBtn.addEventListener('click', () => {
        addUserModal.classList.remove('hidden');
    });

    closeAddUserModal.addEventListener('click', () => {
        addUserModal.classList.add('hidden');
        addUserForm.reset(); // Clear form on close
    });

    window.addEventListener('click', (event) => {
        if (event.target === addUserModal) {
            addUserModal.classList.add('hidden');
            addUserForm.reset();
        }
    });

    // Add User Form Submission
    addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('new-username').value;
        const email = document.getElementById('new-email').value;
        const password = document.getElementById('new-password').value;
        const role = document.getElementById('new-role').value;

        // Simple validation
        if (!username || !email || !password || !role) {
            alert('Please fill in all fields.');
            return;
        }

        // Check if username or email already exists
        const userExists = allUsers.some(user => user.username === username || user.email === email);
        if (userExists) {
            alert('Username or email already exists. Please choose another.');
            return;
        }

        const newId = `user${allUsers.length > 0 ? Math.max(...allUsers.map(u => parseInt(u.id.replace('user', '') || 0))) + 1 : 1}`; // Generate unique ID
        const newUser = { id: newId, username, email, password, role };
        allUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(allUsers)); // Save to localStorage

        // Assuming addNewNotification is globally available from notifications.js
        if (typeof addNewNotification === 'function') {
            addNewNotification(`New user ${username} (${role}) added.`);
        }

        addUserModal.classList.add('hidden');
        addUserForm.reset();
        currentPage = 1; // Go to first page to see new user
        renderUsersTable(); // Update the main users table
    });

    // Placeholder for edit/delete user actions (delegated)
    usersTableBody.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const userId = target.dataset.id; // Keep as string, easier for 'userX' IDs
        if (target.classList.contains('edit-user-btn')) {
            console.log(`Edit user with ID: ${userId}`);
            alert(`Simulating edit for user ID: ${userId}`);
            // In a real application, you'd open an edit modal here, pre-filling with user data
            // and then update allUsers and localStorage on save.
            if (typeof addNewNotification === 'function') {
                addNewNotification(`Simulating edit for user ${userId}.`);
            }
        } else if (target.classList.contains('delete-user-btn')) {
            if (confirm('Are you sure you want to delete this user?')) {
                console.log(`Deleting user with ID: ${userId}`);
                allUsers = allUsers.filter(user => user.id !== userId);
                localStorage.setItem('users', JSON.stringify(allUsers)); // Save to localStorage
                currentPage = 1; // Reset to first page after deletion
                renderUsersTable(); // Re-render the table
                if (typeof addNewNotification === 'function') {
                    addNewNotification(`User ${userId} deleted.`);
                }
            }
        }
    });

    // Initial render of the table when the page loads
    renderUsersTable();
});