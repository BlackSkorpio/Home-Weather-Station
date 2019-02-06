{
	"coord": {
		"lon":11.44, // City geo location, longitude
		"lat":58.27 // City geo location, latitude
	},
	"weather": [{
		"id":804, // Weather condition id
		"main":"Clouds", // Group of weather parameters (Rain, Snow, Extreme etc.)
		"description":"mulet", // Weather condition within the group
		"icon":"04n" // Weather icon id
	}],
	"base":"stations", // Internal parameter
	"main": {
		"temp":1, // Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
		"pressure":1014, // Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa
		"humidity":100, // Humidity, %
		"temp_min":1, // Minimum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
		"temp_max":1, // Maximum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
		"sea_level":, // Atmospheric pressure on the sea level, hPa
		"grnd_level": // Atmospheric pressure on the ground level, hPa
	},
	"visibility":10000, // Visibility, meter
	"wind": {
		"speed":4.6, // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
		"deg":280 // Wind direction, degrees (meteorological)
	},
	"clouds": {
		"all":90 // Cloudiness, %
	},
	"rain": {
		"1h": 10, // Rain volume for the last 1 hour, mm
		"3h": 20 // Rain volume for the last 3 hours, mm
	},
	"snow": {
		"1h": 10, // Snow volume for the last 1 hour, mm
		"3h": 20 // Snow volume for the last 3 hours, mm
	},
	"dt":1549381800, // Time of data calculation, unix, UTC
	"sys": {
		"type":1, // Internal parameter
		"id":1752, // Internal parameter
		"message":0.0039, // Internal parameter
		"country":"SE", // Country code (GB, JP etc.)
		"sunrise":1549350582, // Sunrise time, unix, UTC
		"sunset":1549381661 // Sunset time, unix, UTC
	},
	"id":2693301, // City ID
	"name":"Lysekil", // City name
	"cod":200 // Internal parameter
}
