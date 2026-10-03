/**
 * Service Worker Registration
 * Handles registration and lifecycle events for offline PWA functionality
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);

          // Check for updates periodically (every hour)
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });

    // Handle controller change (when a new service worker takes over)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed - app updated');
      // Optionally show a notification to the user that the app has been updated
      showUpdateNotification();
    });
  }
}

/**
 * Shows a notification when the app has been updated
 */
function showUpdateNotification() {
  // You can customize this notification based on your UI library
  const message = 'App updated! Refresh to see the latest version.';
  console.log(message);

  // Example: Show a toast or banner to the user
  // This can be replaced with your app's notification system
  if (document.readyState === 'complete') {
    // Example implementation (customize as needed)
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 16px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

/**
 * Checks if the app is currently online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Refreshes the static file cache by checking for service worker updates
 * and optionally clearing old cached assets
 */
export async function refreshStaticCache() {
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Check for service worker updates
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      console.log('Static cache refresh check initiated');

      // Optional: Clear old caches and refresh
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('Available caches:', cacheNames);
        // Note: Service worker will handle cache invalidation automatically
        // You can add custom cache purging logic here if needed
      }
    }
  } catch (error) {
    console.error('Error refreshing static cache:', error);
  }
}

/**
 * Handles online/offline events
 */
export function setupOnlineStatusListener(
  onlineCallback?: () => void,
  offlineCallback?: () => void
) {
  window.addEventListener('online', () => {
    console.log('App is now online');
    
    // Automatically refresh static cache when coming online
    refreshStaticCache();
    
    onlineCallback?.();
  });

  window.addEventListener('offline', () => {
    console.log('App is now offline');
    offlineCallback?.();
  });
}

/**
 * Unregisters all service workers (useful for debugging or testing)
 */
export async function unregisterServiceWorkers() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('All service workers unregistered');
  }
}
