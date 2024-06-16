document.addEventListener("DOMContentLoaded", () => {
    const timeElement = document.querySelector('#time');
    const dateElement = document.querySelector('#date');
    const weatherElement = document.querySelector('#weather');
    const themeSelector = document.querySelector('#theme');
    const primaryColorPicker = document.querySelector('#primary-color');
    const secondaryColorPicker = document.querySelector('#secondary-color');
    const tertiaryColorPicker = document.querySelector('#tertiary-color');

    // Function to update the displayed time and date
    const updateDateTime = () => {
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let dayNight = 'AM';

        if (hours > 12) {
            dayNight = 'PM';
            hours -= 12;
        }

        if (hours === 0) {
            hours = 12;
        }

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        timeElement.textContent = `${hours}:${minutes}:${seconds} ${dayNight}`;
        dateElement.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Function to apply selected theme
    const applyTheme = (theme) => {
        const root = document.documentElement;
        switch(theme) {
            case 'dark':
                root.style.setProperty('--background-color', '#000');
                root.style.setProperty('--text-color', '#fff');
                break;
            case 'light':
                root.style.setProperty('--background-color', '#fff');
                root.style.setProperty('--text-color', '#000');
                break;
            case 'colorful':
                root.style.setProperty('--background-color', '#1b1b1b');
                root.style.setProperty('--text-color', '#fff');
                root.style.setProperty('--primary-color', '#ff5722');
                root.style.setProperty('--secondary-color', '#4caf50');
                root.style.setProperty('--tertiary-color', '#2196f3');
                break;
            default:
                root.style.setProperty('--background-color', '#1b1b1b');
                root.style.setProperty('--text-color', '#fff');
                root.style.setProperty('--primary-color', '#14ffe9');
                root.style.setProperty('--secondary-color', '#ffeb3b');
                root.style.setProperty('--tertiary-color', '#ff00e0');
        }
    };

    // Function to update colors based on color picker input
    const updateColors = () => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primaryColorPicker.value);
        root.style.setProperty('--secondary-color', secondaryColorPicker.value);
        root.style.setProperty('--tertiary-color', tertiaryColorPicker.value);
    };

    // Event listeners
    themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));
    primaryColorPicker.addEventListener('input', updateColors);
    secondaryColorPicker.addEventListener('input', updateColors);
    tertiaryColorPicker.addEventListener('input', updateColors);

    // Initial setup
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Function to fetch weather data
    const fetchWeather = (lat, lon) => {
        const apiKey = 'your_openweather_api_key'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temp = data.main.temp;
                const weather = data.weather[0].description;
                weatherElement.textContent = `${temp}°C, ${weather.charAt(0).toUpperCase() + weather.slice(1)}`;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherElement.textContent = 'Unable to fetch weather data';
            });
    };

    // Function to get user's location
    const updateWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(lat, lon);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    weatherElement.textContent = 'Unable to get location';
                }
            );
        } else {
            weatherElement.textContent = 'Geolocation not supported';
        }
    };

    updateWeather();
});
