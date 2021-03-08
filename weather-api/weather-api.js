const https = require("https");
// Don't bother trying the api key, It won't work, I know it's a BAD!! practice
const API_KEY = "473903e95828efdb84fbee7d8e7f951c";
const WEATHER_ICONS = require("./assets/weatger-icons.json");
const ICON_CLASS_PREFIX = "wi wi-";

async function getWeatherByCity(cityName) {
    const endpoint = `/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
    const options = createRequestOptions(endpoint);

    const response = await makeRequest(options);
    return transformResponse(response);
}

async function getWeatherByCoordinates(lat, lon) {
    const endpoint = `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const options = createRequestOptions(endpoint);

    const response = await makeRequest(options);
    return transformResponse(response);
}

function createRequestOptions(path) {
    return {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        port: 443,
        host: `api.openweathermap.org`,
        path,
    };
}

async function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseString = "";

            res.on("data", (data) => {
                responseString += data;
            });
            res.on("end", () => {
                const responseObject = JSON.parse(responseString);
                resolve(responseObject);
            });
        });

        req.on("error", (error) => {
            console.error(error);
            resolve("");
        });
        req.end();
    });
}

function transformResponse(responseObject) {
    const iconCode = responseObject.weather[0].id;
    let icon = WEATHER_ICONS[iconCode].icon;
    let label = WEATHER_ICONS[iconCode].label;

    // If we are not in the ranges mentioned above, add a day/night prefix.
    if (!(iconCode > 699 && iconCode < 800) && !(iconCode > 899 && iconCode < 1000)) {
        icon = "day-" + icon;
    }

    icon = ICON_CLASS_PREFIX + icon;

    return {
        icon,
        label,
        temp: responseObject.main.temp,
        pressure: responseObject.main.pressure,
        humidity: responseObject.main.humidity,
        city: responseObject.name,
    };
}

module.exports = {
    getWeatherByCity,
    getWeatherByCoordinates,
};
