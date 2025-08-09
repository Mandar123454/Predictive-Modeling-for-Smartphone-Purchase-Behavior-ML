// Register service worker for offline support

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Check if the app is in online or offline mode
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    console.log(`App is now ${status}`);
    
    if (!navigator.onLine) {
        showOfflineNotification();
    } else {
        hideOfflineNotification();
    }
}

function showOfflineNotification() {
    // Check if notification already exists
    if (document.getElementById('offline-notification')) return;
    
    const notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#f56565';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.innerHTML = '<i class="fas fa-wifi" style="margin-right: 8px;"></i> You are currently offline. Some features may be limited.';
    
    document.body.appendChild(notification);
}

function hideOfflineNotification() {
    const notification = document.getElementById('offline-notification');
    if (notification) {
        notification.remove();
    }
}
