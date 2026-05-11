const inputBox = document.querySelector("input");
const apiKey = "8d86be893d2f42a188d131751260905";

const getWeather = async () => {
    const city = inputBox.value;
    //guard: don't fetch if empty
    if (!city) {
        alert("Please enter a city!");
        return;
    }
    let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);

    let data = await response.json();

    console.log(city);

    console.log(data);
}