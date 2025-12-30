const apiKey = '9f172a7c37fc6df314e3bec106a9f245';

const form = document.getElementById('search-form');
const input = document.getElementById('city-input');

const card = document.getElementById('result');
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const humidityEl = document.getElementById('humidity');
const errorEl = document.getElementById('error');
const historyList = document.getElementById('history-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;

  try {
    const data = await fetchWeather(city);
    renderWeather(data);
    saveHistory(city);
    renderHistory();
  } catch (err) {
    showError(err.message);
  }
});

historyList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    input.value = e.target.textContent;
    form.dispatchEvent(new Event('submit'));
  }
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ru`;
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('Ошибка сети');
  }
  if (!res.ok) {
    if (res.status === 404) throw new Error('Город не найден');
    throw new Error(`Код ошибки: ${res.status}`);
  }
  return res.json();
}

function renderWeather(data) {
  errorEl.classList.add('hidden');
  cityNameEl.textContent = data.name;
  tempEl.textContent = `Температура: ${Math.round(data.main.temp)}°C`;
  descEl.textContent = `Описание: ${data.weather[0].description}`;
  humidityEl.textContent = `Влажность: ${data.main.humidity}%`;

  card.classList.remove('hidden');
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
  card.classList.remove('hidden');
}

function saveHistory(city) {
  const key = 'weather_history';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = [city, ...current.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 3);
  localStorage.setItem(key, JSON.stringify(updated));
}

function renderHistory() {
  const key = 'weather_history';
  const items = JSON.parse(localStorage.getItem(key) || '[]');
  historyList.innerHTML = '';
  items.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    historyList.appendChild(li);
  });
}

renderHistory();
