let wakeLock = null;

// --- State Management (Load from LocalStorage or use defaults) ---
let settings = {
    color: localStorage.getItem('clockColor') || '#ffffff',
    font: localStorage.getItem('clockFont') || '-apple-system',
    showSeconds: localStorage.getItem('showSeconds') === 'true'
};

// --- Initialization ---
function init() {
    // Apply saved settings on load
    document.getElementById('time').style.color = settings.color;
    document.getElementById('time').style.fontFamily = settings.font;
    document.getElementById('color-picker').value = settings.color;
    document.getElementById('font-selector').value = settings.font;
    document.getElementById('show-seconds').checked = settings.showSeconds;
}

// --- Clock Logic ---
function updateClock() {
    const now = new Date();
    
    const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: settings.showSeconds ? '2-digit' : undefined,
        hour12: true 
    };
    
    let timeString = now.toLocaleTimeString([], options).replace(" AM", "").replace(" PM", "");
    document.getElementById('time').textContent = timeString;

    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString([], dateOptions);
}

// --- Settings Handlers ---

// Toggle Menu
document.getElementById('settings-toggle').addEventListener('click', () => {
    document.getElementById('settings-menu').classList.remove('hidden');
});

document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('settings-menu').classList.add('hidden');
});

// Change Color
document.getElementById('color-picker').addEventListener('input', (e) => {
    const color = e.target.value;
    document.getElementById('time').style.color = color;
    localStorage.setItem('clockColor', color);
});

// Change Font
document.getElementById('font-selector').addEventListener('change', (e) => {
    const font = e.target.value;
    document.getElementById('time').style.fontFamily = font;
    settings.font = font;
    localStorage.setItem('clockFont', font);
});

// Toggle Seconds
document.getElementById('show-seconds').addEventListener('change', (e) => {
    settings.showSeconds = e.target.checked;
    localStorage.setItem('showSeconds', settings.showSeconds);
});

// Night Mode Toggle
document.getElementById('night-toggle').addEventListener('click', () => {
    document.getElementById('main-container').classList.toggle('night-mode');
});

// Start Button Logic
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then(lock => wakeLock = lock);
    }
});

// Run
init();
setInterval(updateClock, 1000);
updateClock();
