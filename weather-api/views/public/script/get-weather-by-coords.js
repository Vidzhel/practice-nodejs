window.onload = () => {
	const weatherWidget = document.getElementsByClassName("weather-widget")[0];
	const weatherWidgetWrapper = document.getElementById("wrapper");
	const status = document.getElementById("status");

	if (!navigator.geolocation) {
		status.textContent = 'Geolocation is not supported by your browser';
	} else {
		status.textContent = 'Locating…';
		navigator.geolocation.getCurrentPosition(onGetCoords, onError);
	}

	async function onGetCoords(position) {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		const result = await getWeather(latitude, longitude);
		updateWeather(result);

		status.parentNode.removeChild(status);
		weatherWidgetWrapper.style.display = "block";
	}

	function onError() {
		status.textContent = 'Unable to retrieve your location';
	}

	function updateWeather(weather) {
		const title = weatherWidget.getElementsByClassName("title")[0];
		const label = weatherWidget.getElementsByClassName("label")[0];
		const icon = weatherWidget.getElementsByClassName("icon")[0];
		const temp = weatherWidget.getElementsByClassName("temp")[0];
		const pressure = weatherWidget.getElementsByClassName("pressure")[0];
		const humidity = weatherWidget.getElementsByClassName("humidity")[0];

		title.textContent = `Weather in ${weather.city}`;
		label.textContent = weather.label;
		icon.className += weather.icon;
		temp.textContent = weather.temp;
		pressure.textContent = weather.pressure;
		humidity.textContent = weather.humidity;
	}
}

async function getWeather(lat, lon) {
	return await fetch(`/weather/${lat}/${lon}`)
		.then(response => response.json());
}
