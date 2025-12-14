const API_KEY = "d92b741b5a586a12ac4f2edfc1750fd5";
let lang = "tr";
let dark = true;
let map;

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            loadByCoords(pos.coords.latitude, pos.coords.longitude);
        });
    }
};

function loadByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`)
        .then(r=>r.json())
        .then(showWeather);

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`)
        .then(r=>r.json())
        .then(showForecast);

    showMap(lat, lon);
}

function getWeather() {
    const city = document.getElementById("city").value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${lang}`)
        .then(r=>r.json())
        .then(data=>{
            showWeather(data);
            showMap(data.coord.lat, data.coord.lon);
        });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=${lang}`)
        .then(r=>r.json())
        .then(showForecast);
}

function showWeather(data) {
    document.getElementById("result").innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>
    `;
}

function showForecast(data) {
    let html = "<h3>7 Günlük Tahmin</h3>";
    for (let i=0; i<data.list.length; i+=8) {
        html += `<p>${data.list[i].dt_txt.split(" ")[0]} - ${data.list[i].main.temp}°C</p>`;
    }
    document.getElementById("forecast").innerHTML = html;
}

function showMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }
    L.marker([lat, lon]).addTo(map);
}

function toggleTheme() {
    dark = !dark;
    document.body.style.background = dark ? "#000" : "#87CEEB";
}

function changeLang() {
    lang = document.getElementById("language").value;
}
