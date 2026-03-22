let settings = {
    color: localStorage.getItem('clockColor') || '#FFFFFF',
    font: localStorage.getItem('clockFont') || "'Figtree', sans-serif",
    showSeconds: localStorage.getItem('showSeconds') === 'true',
    leftWidget: localStorage.getItem('leftWidget') || 'clock',
    rightWidget: localStorage.getItem('rightWidget') || 'calendar'
};

// --- Widget Renderers ---

function renderClock() {
    return `<div class="clock-display">
                <h1 id="time" style="color:${settings.color}; font-family:${settings.font}">00:00</h1>
                <p id="date">${new Date().toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}</p>
            </div>`;
}

function renderCalendar() {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const firstDay = new Date(year, now.getMonth(), 1).getDay();
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

    let html = `<div class="calendar-widget">
        <div class="cal-header">${month} ${year}</div>
        <div class="cal-grid">
            <div class="day-name">S</div><div class="day-name">M</div><div class="day-name">T</div>
            <div class="day-name">W</div><div class="day-name">T</div><div class="day-name">F</div><div class="day-name">S</div>`;
    
    for (let i = 0; i < firstDay; i++) html += `<div></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === now.getDate() ? 'today' : '';
        html += `<div class="day-num ${isToday}">${d}</div>`;
    }
    html += `</div></div>`;
    return html;
}

async function fetchWeather() {
    try {
        // Default to London, but you can use navigator.geolocation for better results
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.50&longitude=-0.12&current_weather=true');
        const data = await res.json();
        const slot = document.querySelector('.weather-widget');
        if (slot) {
            slot.innerHTML = `<p class="temp">${Math.round(data.current_weather.temperature)}°</p>
                              <p class="condition">London</p>`;
        }
    } catch (e) { console.error("Weather failed", e); }
}

// --- Layout Manager ---

function updateLayout() {
    const leftSlot = document.getElementById('left-widget');
    const rightSlot = document.getElementById('right-widget');

    const widgets = {
        'clock': renderClock(),
        'calendar': renderCalendar(),
        'weather': `<div class="weather-widget"><p>Loading weather...</p></div>`
    };

    leftSlot.innerHTML = widgets[settings.leftWidget];
    rightSlot.innerHTML = widgets[settings.rightWidget];

    if (settings.leftWidget === 'weather' || settings.rightWidget === 'weather') fetchWeather();
}

// --- Settings Handlers ---

document.getElementById('left-selector').addEventListener('change', (e) => {
    settings.leftWidget = e.target.value;
    localStorage.setItem('leftWidget', settings.leftWidget);
    updateLayout();
});

document.getElementById('right-selector').addEventListener('change', (e) => {
    settings.rightWidget = e.target.value;
    localStorage.setItem('rightWidget', settings.rightWidget);
    updateLayout();
});

// Update the clock numbers every second
function updateTime() {
    const timeEl = document.getElementById('time');
    if (!timeEl) return;
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: settings.showSeconds ? '2-digit' : undefined, hour12: true };
    timeEl.textContent = now.toLocaleTimeString([], options).replace(" AM", "").replace(" PM", "");
}

// --- Init ---
document.getElementById('left-selector').value = settings.leftWidget;
document.getElementById('right-selector').value = settings.rightWidget;

updateLayout();
setInterval(updateTime, 1000);
