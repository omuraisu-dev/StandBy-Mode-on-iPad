let wakeLock = null;

// Function to keep the screen awake
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log("Screen Wake Lock is active");
        }
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

// Update the clock every second
function updateClock() {
    const now = new Date();
    
    // Time format (e.g., 12:45)
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    document.getElementById('time').textContent = now.toLocaleTimeString([], timeOptions).replace(" AM", "").replace(" PM", "");

    // Date format (e.g., Monday, March 22)
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString([], dateOptions);
}

// Start Button logic
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    requestWakeLock();
    // Request fullscreen (optional)
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
});

// Night Mode Toggle
document.getElementById('night-toggle').addEventListener('click', () => {
    document.getElementById('main-container').classList.toggle('night-mode');
});

// Listen for visibility changes (re-enable wake lock if user switches apps and comes back)
document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});

setInterval(updateClock, 1000);
updateClock();
