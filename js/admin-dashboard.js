document.addEventListener('DOMContentLoaded', function() {
    const totalUsersEl = document.getElementById('total-users');
    const totalTeachersEl = document.getElementById('total-teachers');
    const totalStudentsEl = document.getElementById('total-students');
    const pendingUsersCountEl = document.getElementById('pending-users-count');
    const pendingUsersList = document.getElementById('pending-users-list');

    // Simulate all users and pending users data (in a real app, from backend)
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    let pendingUsers = JSON.parse(localStorage.getItem('pendingUsers')) || [
        { id: 'pend1', username: 'newstudent1', email: 'newstudent1@example.com', role: 'student' },
        { id: 'pend2', username: 'newteacher1', email: 'newteacher1@example.com', role: 'teacher' }
    ];
    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers)); // Ensure defaults are set

    // Function to update the admin dashboard UI with current stats and pending users
    function updateAdminDashboardUI() {
        const students = allUsers.filter(user => user.role === 'student');
        const teachers = allUsers.filter(user => user.role === 'teacher');

        if (totalUsersEl) totalUsersEl.textContent = allUsers.length;
        if (totalTeachersEl) totalTeachersEl.textContent = teachers.length;
        if (totalStudentsEl) totalStudentsEl.textContent = students.length;
        if (pendingUsersCountEl) pendingUsersCountEl.textContent = pendingUsers.length;

        // Render pending users list
        if (pendingUsersList) {
            pendingUsersList.innerHTML = '';
            if (pendingUsers.length === 0) {
                pendingUsersList.innerHTML = '<li class="p-3 text-gray-500">No pending user requests.</li>';
            } else {
                pendingUsers.forEach(user => {
                    const listItem = document.createElement('li');
                    listItem.className = 'py-3 flex items-center justify-between border-b border-gray-200 last:border-b-0';
                    listItem.innerHTML = `
                        <div class="flex-1">
                            <span class="font-medium text-gray-800">${user.username}</span>
                            <span class="text-sm text-gray-600"> (${user.role})</span>
                        </div>
                        <div class="space-x-2">
                            <button data-id="${user.id}" data-role="${user.role}" class="approve-btn bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded">Approve</button>
                            <button data-id="${user.id}" class="reject-btn bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">Reject</button>
                        </div>
                    `;
                    pendingUsersList.appendChild(listItem);
                });
            }
        }
    }

    // Event listener for approval/rejection actions (delegated)
    if (pendingUsersList) {
        pendingUsersList.addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('approve-btn')) {
                const userIdToApprove = target.dataset.id;
                const userRole = target.dataset.role; // Get the role to assign
                const userIndex = pendingUsers.findIndex(user => user.id === userIdToApprove);

                if (userIndex !== -1) {
                    const approvedUser = pendingUsers[userIndex];
                    approvedUser.role = userRole; // Ensure the role is set correctly upon approval
                    allUsers.push(approvedUser); // Add to main users list
                    localStorage.setItem('users', JSON.stringify(allUsers)); // Save to localStorage

                    pendingUsers.splice(userIndex, 1); // Remove from pending
                    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers)); // Save updated pendingUsers

                    updateAdminDashboardUI(); // Re-render the pending list and dashboard stats
                    // Assuming addNewNotification is globally available from notifications.js
                    if (typeof addNewNotification === 'function') {
                        addNewNotification(`User ${approvedUser.username} (${approvedUser.role}) approved.`);
                    }
                }
            } else if (target.classList.contains('reject-btn')) {
                const userIdToReject = target.dataset.id;
                const userIndex = pendingUsers.findIndex(user => user.id === userIdToReject);

                if (userIndex !== -1) {
                    const rejectedUser = pendingUsers[userIndex];
                    pendingUsers.splice(userIndex, 1);
                    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers)); // Save updated pendingUsers
                    updateAdminDashboardUI(); // Re-render the pending list and dashboard stats
                    if (typeof addNewNotification === 'function') {
                        addNewNotification(`User ${rejectedUser.username} rejected.`);
                    }
                }
            }
        });
    }


    // Initial render of dashboard UI
    updateAdminDashboardUI();

    // Quick Access Buttons functionality
    const manageUsersBtn = document.getElementById('manage-users-btn');
    if (manageUsersBtn) {
        manageUsersBtn.addEventListener('click', function() {
            window.location.href = 'user_management.html'; // Go to User Management page
        });
    }

    const addNewCourseBtn = document.getElementById('add-new-course-btn');
    if (addNewCourseBtn) {
        addNewCourseBtn.addEventListener('click', function() {
            alert('Simulating: Open Add New Course interface');
            if (typeof addNewNotification === 'function') {
                addNewNotification('Add New Course interface opened.');
            }
        });
    }

    const runDiagnosticsBtn = document.getElementById('run-diagnostics-btn');
    if (runDiagnosticsBtn) {
        runDiagnosticsBtn.addEventListener('click', function() {
            alert('Simulating: Running system diagnostics...');
            if (typeof addNewNotification === 'function') {
                addNewNotification('System check initiated.');
            }
        });
    }

    const sendBroadcastBtn = document.getElementById('send-broadcast-btn');
    if (sendBroadcastBtn) {
        sendBroadcastBtn.addEventListener('click', function() {
            alert('Simulating: Opening broadcast message composer');
            if (typeof addNewNotification === 'function') {
                addNewNotification('Broadcast message composer opened.');
            }
        });
    }
});