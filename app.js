let settings = {
    color: localStorage.getItem('clockColor') || '#FFFFFF',
    font: localStorage.getItem('clockFont') || "'Figtree', sans-serif",
    showSeconds: localStorage.getItem('showSeconds') === 'true'
};

// --- Page Switching ---
const displayPage = document.getElementById('display-page');
const settingsPage = document.getElementById('settings-page');

document.getElementById('open-settings').addEventListener('click', () => {
    displayPage.classList.add('hidden');
    settingsPage.classList.remove('hidden');
});

document.getElementById('close-settings').addEventListener('click', () => {
    settingsPage.classList.add('hidden');
    displayPage.classList.remove('hidden');
});

// --- Settings Logic ---
function applySettings() {
    const timeEl = document.getElementById('time');
    timeEl.style.color = settings.color;
    timeEl.style.fontFamily = settings.font;
    document.getElementById('show-seconds').checked = settings.showSeconds;
    
    // Highlight active color circle
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === settings.color);
    });
}

// Color Selection
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        settings.color = btn.dataset.color;
        localStorage.setItem('clockColor', settings.color);
        applySettings();
    });
});

// Font Selection
document.getElementById('font-selector').addEventListener('change', (e) => {
    settings.font = e.target.value;
    localStorage.setItem('clockFont', settings.font);
    applySettings();
});

// Seconds Toggle
document.getElementById('show-seconds').addEventListener('change', (e) => {
    settings.showSeconds = e.target.checked;
    localStorage.setItem('showSeconds', settings.showSeconds);
});

// Night Mode
document.getElementById('night-toggle').addEventListener('click', () => {
    document.getElementById('main-container').classList.toggle('night-mode');
});

// --- Clock Logic ---
function updateClock() {
    const now = new Date();
    const options = { 
        hour: '2-digit', minute: '2-digit', 
        second: settings.showSeconds ? '2-digit' : undefined,
        hour12: true 
    };
    let timeStr = now.toLocaleTimeString([], options).replace(" AM", "").replace(" PM", "");
    document.getElementById('time').textContent = timeStr;
    document.getElementById('date').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

// Wake Lock & Start
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    if ('wakeLock' in navigator) navigator.wakeLock.request('screen');
});

applySettings();
setInterval(updateClock, 1000);
updateClock();
