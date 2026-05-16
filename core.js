// Select an Input Box from HTML
const inputBox = document.querySelector("input");
// API Key
const apiKey = "8d86be893d2f42a188d131751260905";

function getCountryCode(name) {
    return countryMap[name] || name; // fallback to full name if not in map
}

function getDayShort(dateStr) {
    const date = new Date(dateStr);
    // returns "Wed", "Thu" etc.
    return date.toLocaleDateString("en-US", { weekday: "short" }).toLocaleUpperCase();
}

function setTempBar(temp) {
    const min = -20;  // coldest possible
    const max = 50;   // hottest possible

    // Convert temp to a percentage between 0–100
    const percent = ((temp - min) / (max - min)) * 100;

    // Clamp between 0 and 100 so it never overflows
    const clamped = Math.min(100, Math.max(0, percent));

    document.getElementById("tempBar").style.width = clamped + "%";
}


const getActivate = () => {
    const backCard = document.querySelector(".back-card");
    backCard.classList.remove("hidden");
    backCard.classList.remove("active");
    void backCard.offsetWidth;          // ✅ reset animation
    backCard.classList.add("active");
    document.querySelector(".front-card").classList.add("hidden");  
}


const getWeather = async () => {
    // access the input box value
    const city = inputBox.value.trim();

    // firstly check if the user doesn't input city name, show error message
    if (city === "") {
        Swal.fire({
            icon: "warning",
            title: "Input Required",
            text: "Please enter a city name"
        });
        return;
    }
    // Weather URL
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
    try {
        // FETCH Data from API
        const response = await fetch(
            forecastUrl);

        if (response.status === 400) {
            Swal.fire({
                icon: "error",
                title: "City Not Found",
                text: "Please enter a valid city name"
            });
            return;
        }
        // if API key is invalid
        if (response.status === 401) {
            Swal.fire({
                icon: "error",
                title: "Invalid API Key",
                text: "Please check your Weather API key"
            });
            return;
        }

        // Convert Response to Usable Format(JSON)
        let data = await response.json();


        console.log(city);
        console.log(data);


        // let emoji = "🌤️"; // default

        // if (conditionText.includes("mist")) emoji = "🌫️";
        // else if (conditionText.includes("sunny")) emoji = "☀️";
        // else if (conditionText.includes("rain")) emoji = "🌧️";
        // else if (conditionText.includes("snow")) emoji = "❄️";
        // else if (conditionText.includes("cloud")) emoji = "☁️";
        // else if (conditionText.includes("thunder")) emoji = "⛈️";
        // else if (conditionText.includes("fog")) emoji = "🌫️";
        // else if (conditionText.includes("clear")) emoji = "🌙"; // night clear

        // document.getElementById("weatherIcon").textContent = emoji;

        // Access Weather Data from API and render it to HTML
        // ================Weather Data===========================
        // Select Icon
        const iconUrl = "https:" + data.current.condition.icon;
        document.getElementById("weather-icon").src = iconUrl;
        // Access Temperature
        document.getElementById("temp_c").innerText =
            Math.round(data.current.temp_c);

        // Call it after you get temp from API:
        setTempBar(data.current.temp_c);  // e.g. 38°C → 82%
        // Access City Name
        document.getElementById("city-name").innerText =
            data.location.name;
        // Access Country Name in Abbreviated form
        const code = getCountryCode(data.location.country);
        document.getElementById("country").innerText =
            code;
        // Access Weather Condition
        document.getElementById("conditionText").innerText =
            data.current.condition.text;
        // Access Humidity
        document.getElementById("humidity").innerText =
            data.current.humidity + "%";
        // Access Wind
        document.getElementById("wind").innerText =
            data.current.wind_kph + " km/h";
        // Access Feels Like
        document.getElementById("feelslike_c").innerText =
            data.current.feelslike_c + "°C";
        // Access Forecast Days
        const days = data.forecast.forecastday;
        days.slice(1).forEach((day, idx) => {
            // Get Day Name in UpperCase
            document.getElementById(`day${idx + 1}`).innerText = getDayShort(day.date);
            // Get Avg Temp
            document.getElementById(`avgtemp_c${idx + 1}`).innerText = Math.round(day.day.avgtemp_c) + "°";
            // Get Icon
            document.getElementById(`icon${idx + 1}`).src = "https:" + day.day.condition.icon;// image URL
        });
        // if the data is successfully gotten from API
        // Success Message
        Swal.fire({
            icon: "success", title: "Weather Loaded!",
            text: `Showing weather for ${data.location.name}`,
            timer: 1500, showConfirmButton: false
        }).then(() => {
            getActivate(); // ← runs after alert auto-closes
        });

    } catch (error) {
        console.error(error);
        Swal.fire({ icon: "error", title: "Something went wrong", text: "Check your internet connection" });
        return;
    }


}