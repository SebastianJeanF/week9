function drawWeather(data) {
	let fahrenheit = Math.round(data.main.temp);
	let max_fahrenheit = Math.round(data.main.temp_max);
	let min_fahrenheit = Math.round(data.main.temp_min);
	document.getElementById('description').innerHTML = data.weather[0].description;
	document.getElementById('temp').innerHTML = fahrenheit + '°F';
	document.getElementById('h_temp').innerHTML = 'H:' + max_fahrenheit + '°F';
	document.getElementById('l_temp').innerHTML = 'L:' + min_fahrenheit + '°F';
	document.getElementById('city-name').innerHTML = data.name;
	document.getElementById('wind-speed').innerHTML = data.wind.speed + 'miles/hr';
	let iconName = data.weather[0].icon;
	let iconURL = 'http://openweathermap.org/img/wn/' + iconName + '@2x.png';
	document.getElementById('weather-icon').src = iconURL;
}

function fireProbability(data) {
	humidityLvl = data.main.humidity;
	if (humidityLvl <= 50) {
		document.getElementById('fire').innerHTML = 'High';
		document.getElementById('fire').style.color = 'red';
	} else {
		document.getElementById('fire').innerHTML = 'Low';
		document.getElementById('fire').style.color = 'green';
	}
}

function pollenAPI(link) {
	fetch(link, {
		method: 'GET',
		headers: {
			'x-api-key': 'f2bb5ee119ee77dcd5ccdd8a54f9323c6ec8cb05973c01a63e51bd8ca7b6b8cb',
			'Content-type': 'application/json',
		},
	})
		.then(function (resp) {
			return resp.json();
		})
		.then(function (data) {
			if (
				data.message ===
				'We are currently working on expanding our coverage for pollen. The current version only supports locations in Europe and Asia.'
			) {
				document.getElementById('pollen').innerHTML = 'Unknown';
			} else {
				pollenLvl = data.data[0].Risk.grass_pollen;
				document.getElementById('pollen').innerHTML = pollenLvl;
				if (pollenLvl === 'High' || pollenLvl === 'Very High') {
					document.getElementById('pollen').style.color = 'red';
				} else {
					document.getElementById('pollen').style.color = 'green';
				}
			}
		});
}

function weather() {
	const API_KEY = '64b38d3f58717f4e8c8c6a8033addac1';
	if (document.weatherForm.city.value === '') {
		var city_name = 'San Diego';
	} else {
		var city_name = document.weatherForm.city.value;
	}
	const base_url = 'http://api.openweathermap.org/data/2.5/weather?';
	const final_url_geocoding = base_url + 'appid=' + API_KEY + '&q=' + city_name + '&units=imperial';
	const coords = async function weatherAPI() {
		let resp = await fetch(final_url_geocoding);
		let data = await resp.json();
		if (data.cod === 200) {
			document.getElementById('error').style.display = 'none';
			drawWeather(data);

			let lat = data.coord.lat;
			let long = data.coord.lon;
			fireProbability(data);
			let pollenAPILink =
				'https://api.ambeedata.com/latest/pollen/by-lat-lng?lat=' + lat + '&lng=' + long;
			pollenAPI(pollenAPILink);
		} else {
			document.getElementById('error').style.display = 'flex';
		}
	};
	coords();
}
document.querySelector('#form').addEventListener('submit', weather);
document.querySelector('#button').addEventListener('click', weather);
