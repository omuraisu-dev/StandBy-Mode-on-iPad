let wakeLock = null;
let settings = {
    color: localStorage.getItem('clockColor') || '#FFFFFF',
    font: localStorage.getItem('clockFont') || "'Figtree', sans-serif",
    showSeconds: localStorage.getItem('showSeconds') === 'true'
};

// --- Gesture Detection (Swipe from Left) ---
let touchStartX = 0;
const menu = document.getElementById('settings-menu');

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchmove', e => {
    let touchMoveX = e.changedTouches[0].screenX;
    
    // Open: If swipe starts near left edge (< 60px) and moves right
    if (touchStartX < 60 && touchMoveX > 100) {
        menu.classList.add('visible');
    }
    
    // Close: If menu is open and user swipes left
    if (menu.classList.contains('visible') && touchStartX - touchMoveX > 80) {
        menu.classList.remove('visible');
    }
});

// --- Settings Logic ---
function applySettings() {
    const timeEl = document.getElementById('time');
    timeEl.style.color = settings.color;
    timeEl.style.fontFamily = settings.font;
    document.getElementById('show-seconds').checked = settings.showSeconds;
}

// Color Pickers
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        settings.color = btn.dataset.color;
        localStorage.setItem('clockColor', settings.color);
        applySettings();
    });
});

// Font Dropdown
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

// --- Core Clock Engine ---
function updateClock() {
    const now = new Date();
    const options = { 
        hour: '2-digit', minute: '2-digit', 
        second: settings.showSeconds ? '2-digit' : undefined,
        hour12: true 
    };
    document.getElementById('time').textContent = now.toLocaleTimeString([], options).replace(" AM", "").replace(" PM", "");
    document.getElementById('date').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

// Start App
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    if ('wakeLock' in navigator) navigator.wakeLock.request('screen');
});

applySettings();
setInterval(updateClock, 1000);
updateClock();
