document.addEventListener('DOMContentLoaded', function() {
    const notificationBell = document.getElementById('notification-bell');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    const notificationsList = document.getElementById('notifications-list');
    const markAllReadBtn = document.getElementById('mark-all-read-btn');

    // Simulate notifications data (in a real app, this would come from a backend)
    let notifications = JSON.parse(localStorage.getItem('userNotifications')) || [
        { id: 1, message: 'Welcome to EduMalawi! Check out your new dashboard.', read: false, time: '2 hours ago' },
        { id: 2, message: 'Your profile has been updated successfully.', read: false, time: '1 day ago' },
        { id: 3, message: 'Upcoming system maintenance on June 20th.', read: true, time: '3 days ago' }
    ];

    // Function to update the notifications UI (badge and list)
    function updateNotificationsUI() {
        // Filter unread notifications
        const unreadNotifications = notifications.filter(notif => !notif.read);

        // Update badge
        if (unreadNotifications.length > 0) {
            notificationBadge.classList.remove('hidden');
            notificationBadge.textContent = unreadNotifications.length;
        } else {
            notificationBadge.classList.add('hidden');
        }

        // Update dropdown list
        if (notificationsList) { // Check if the list element exists (it might not on all pages if nav.html isn't loaded yet)
            notificationsList.innerHTML = ''; // Clear existing list
            if (notifications.length === 0) {
                notificationsList.innerHTML = '<li class="p-3 text-gray-500">No notifications yet.</li>';
            } else {
                notifications.forEach(notif => {
                    const listItem = document.createElement('li');
                    listItem.className = `p-3 border-b border-gray-200 last:border-b-0 ${notif.read ? 'text-gray-500' : 'bg-blue-50 text-gray-800 font-medium'}`;
                    listItem.innerHTML = `
                        <div class="flex justify-between items-center">
                            <span>${notif.message}</span>
                            <span class="text-xs ${notif.read ? 'text-gray-400' : 'text-blue-500'}">${notif.time}</span>
                        </div>
                        <div class="flex justify-end space-x-2 mt-2">
                            ${!notif.read ? `<button data-id="${notif.id}" class="mark-read-btn text-xs text-blue-600 hover:underline">Mark as Read</button>` : ''}
                        </div>
                    `;
                    notificationsList.appendChild(listItem);
                });
            }
        }
    }

    // Function to add a new notification and save it
    // This function is now made globally accessible so other scripts can call it.
    window.addNewNotification = function(message) {
        // Retrieve current notifications from localStorage or initialize if empty
        let currentNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];

        // Generate a new ID
        const newId = currentNotifications.length > 0 ? Math.max(...currentNotifications.map(n => n.id)) + 1 : 1;
        const newNotification = { id: newId, message: message, read: false, time: 'just now' };

        currentNotifications.unshift(newNotification); // Add to the beginning
        localStorage.setItem('userNotifications', JSON.stringify(currentNotifications)); // Save back to localStorage

        notifications = currentNotifications; // Update local notifications array
        updateNotificationsUI(); // Refresh UI

        // Show a temporary badge update even if dropdown is closed
        if (notificationBadge && notificationsDropdown && notificationsDropdown.classList.contains('hidden')) {
            notificationBadge.classList.remove('hidden');
            notificationBadge.textContent = parseInt(notificationBadge.textContent || 0) + 1;
            notificationBadge.classList.add('pulse'); // Add pulse effect for new notification
            setTimeout(() => {
                notificationBadge.classList.remove('pulse');
            }, 1500);
        }
    };

    // Initial update of UI when the page loads
    updateNotificationsUI();

    // Event listener for clicking the notification bell
    if (notificationBell) {
        notificationBell.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent document click from immediately closing it
            notificationsDropdown.classList.toggle('hidden');
            // When opening, mark all currently visible unread as read (optional, could be on item click)
            // Or just ensure the badge updates when the dropdown is closed again
        });
    }

    // Event listener for "Mark All as Read" button
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            notifications.forEach(notif => notif.read = true);
            localStorage.setItem('userNotifications', JSON.stringify(notifications)); // Save changes
            updateNotificationsUI();
            notificationsDropdown.classList.add('hidden'); // Close dropdown after marking all as read
        });
    }

    // Event listener for "Mark as Read" on individual notification items (delegated)
    if (notificationsList) {
        notificationsList.addEventListener('click', function(event) {
            const target = event.target.closest('.mark-read-btn');
            if (target) {
                const notificationId = parseInt(target.dataset.id);
                const notif = notifications.find(n => n.id === notificationId);
                if (notif) {
                    notif.read = true;
                    localStorage.setItem('userNotifications', JSON.stringify(notifications)); // Save changes
                    updateNotificationsUI();
                }
            }
        });
    }

    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        // Ensure notificationBell and notificationsDropdown exist before trying to use them
        if (notificationBell && notificationsDropdown) {
            if (!notificationBell.contains(event.target) && !notificationsDropdown.contains(event.target)) {
                notificationsDropdown.classList.add('hidden');
            }
        }
    });

    // Simulate a new notification after 15 seconds on any page where notifications.js is loaded
    setTimeout(() => {
        const userRole = JSON.parse(sessionStorage.getItem('loggedInUser'))?.role || 'Guest';
        addNewNotification(`A new announcement for ${userRole}s has been posted!`);
    }, 15000);
});