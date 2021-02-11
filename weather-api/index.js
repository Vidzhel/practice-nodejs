const express = require("express");
const hbs = require("hbs");
const CITIES = require("./configs.json").cities;
const {getWeatherByCoordinates, getWeatherByCity} = require("./weather-api");

const app = express();
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + "/views/public/"));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
	res.render("home.hbs", {cities: CITIES});
});

app.get("/weather/:lat/:lon", async (req, res) => {
	const lat = req.params["lat"];
	const lon = req.params["lon"];

	const result = await getWeatherByCoordinates(lat, lon);
	res.json(result)
});

app.get("/weather/:cityName(\\w+)?", async (req, res) => {
	const cityName = req.params["cityName"] ? req.params["cityName"] : req.query["city"];

	if (!cityName) {
		res.render("weather.hbs", {cities: CITIES});
	} else {
		const result = await getWeatherByCity(cityName);
		res.render("weather-city.hbs", {cities: CITIES, weather: result});
	}
});

app.listen(3000, () => {
	console.log("Started app on port 3000");
})
