/* minifyOnSave, checkOutputFileAlreadyExists: false, checkAlreadyMinifiedFile: false, filenamePattern: $1.min.$2 */
(function() {
	//NOTE: ES5 chosen instead of ES6 for compatibility with older mobile devices
	var usephp				= true; // set to true to use a PHP document to hide your api key
	var useip				= true;
	var locationRequested	= false;
	var useSVG				= true;
	//var appID				= "YOUR_API_KEY_HERE"; // NOTE Only usefull if you opt-out of using the weather.php or as an backup
	var appID				= "9aa352a903101d13f7be396a2414e280";

	/* Multilingual support
		You can use lang parameter to get the output in your language. We support the following
		languages that you can use with the corresponded lang values:
			Arabic - ar, Bulgarian - bg, Catalan - ca, Czech - cz
			German - de, Greek - el, English - en, Persian (Farsi) - fa
			Finnish - fi, French - fr, Galician - gl, Croatian - hr
			Hungarian - hu, Italian - it, Japanese - ja, Korean - kr
			Latvian - la, Lithuanian - lt, Macedonian - mk, Dutch - nl
			Polish - pl, Portuguese - pt, Romanian - ro, Russian - ru
			Swedish - se, Slovak - sk, Slovenian - sl, Spanish - es
			Turkish - tr, Ukrainian - ua, Vietnamese - vi
			Chinese Simplified - zh_cn, Chinese Traditional - zh_tw.
	*/
	var langCode			= "se";
	/* Units format
		Standard, metric, and imperial units are available.
			Temperature is available in Fahrenheit, Celsius and Kelvin units.
				For temperature in Fahrenheit use units = imperial
				For temperature in Celsius use units = metric
				Temperature in Kelvin is used by default, no need to use units parameter in API call
	*/
	var unitsFormat			= "metric";
	var gettingTxt, locErrorTxt, gpsTxt, minMaxTxt, pressureTxt, humidityTxt, windTxt, sunRiseTxt, sunSetTxt, goldenTxt, goldMorTxt, goldEveTxt, moonRiseTxt, moonSetsTxt, clearTxt, cloudTxt, cloudTxt2, rainTxt, snowTxt, sunTxt, mistTxt;
	var wd_bfTxt, bfsHeadTxt, bfs00Txt, bfs01Txt, bfs02Txt, bfs03Txt, bfs04Txt, bfs05Txt, bfs06Txt, bfs07Txt, bfs08Txt, bfs09Txt, bfs10Txt, bfs11Txt, bfs12Txt, bfs13Txt, bfs14Txt, bfs15Txt, bfs16Txt, bfs17Txt, bfs21Txt, bfs22Txt, bfs23Txt, bfs24Txt, bfs25Txt, bfs26Txt;
	var months, days, directionsTxt, beaufortScale, wd_ws, wd_bf, bfSvgId, wd_LB, ws_s, ws_m, ws_f;
	var tempForm, windSpeed, beaufortForm, pressureForm, humidityForm, timeForm;
	var svgPrefix, titlePrefix, titleSuffix, usePrefix, useSuffix, textSpanPrefix, textSpanSuffix, timePrefix, timePrefixEnd, timeSuffix;
	var useCompass, useLocation, useSunRise, useSunSet, useGoldenHour, useMoonRise, useMoonSet, useHumidity, useWindspeed, usePressure, useTemprature, useWindRose, useWeatherDude;
	/*-_--_-_-_-_- Language strings -_--_-_-_-_-*/
	switch ( langCode ) {
		case "se":
			gettingTxt	= "Läser in vädret";
			locErrorTxt	= "GEO-location service är inte tillgänglig, försök igen senare.";
			gpsTxt		= "GPS: ";
			minMaxTxt	= "Min/Max temperatur idag:<br>";
			pressureTxt	= "Lufttryck: ";
			humidityTxt	= "Luftfuktighet: ";
			windTxt		= "Vindhastighet: ";
			sunRiseTxt	= "Soluppgång: ";
			sunSetTxt	= "Solnedgång: ";
			goldenTxt	= "Golden hour: ";
			goldMorTxt	= "morning golden hour (soft light, best time for photography) ends";
			goldEveTxt	= "evening golden hour starts";
			moonRiseTxt	= "Månen går upp: ";
			moonSetsTxt	= "Månen går ner: ";
			clearTxt	= "klar";
			cloudTxt	= "mulet";// moln
			cloudTxt2	= "moln";// moln
			rainTxt		= "regn";
			snowTxt		= "snö";
			sunTxt		= "sol";
			mistTxt		= "dimm";
			bfsHeadTxt	= "Vindstyrka i beaufort: ";
			bfs00Txt	= "Lugnt";
			bfs01Txt	= "Svag vind";
			bfs02Txt	= bfs01Txt;
			bfs03Txt	= "Måttlig vind";
			bfs04Txt	= bfs03Txt;
			bfs05Txt	= "Frisk vind";
			bfs06Txt	= bfs05Txt;
			bfs07Txt	= "Hård vind";
			bfs08Txt	= bfs07Txt;
			bfs09Txt	= "Mycket hård vind";
			bfs10Txt	= "Storm";
			bfs11Txt	= "Svår storm";
			bfs12Txt	= "Orkan";
			bfs13Txt	= bfs12Txt;
			bfs14Txt	= bfs12Txt;
			bfs15Txt	= bfs12Txt;
			bfs16Txt	= bfs12Txt;
			bfs17Txt	= bfs12Txt;
			bfs21Txt	= "Or just sufficient to give steerage way.";
			bfs22Txt	= "Or that in which a man-of-war, with all sail set, and clean full, would go in smooth water, from";
			bfs07Txt	= "High wind, moderate gale, near gale";
			bfs23Txt	= "Or that to which a well-conditioned man-of-war could just carry in chase, full and by";
			bfs24Txt	= "Or that which she could scarcely bear close-reefed main-topsail and reefed foresail.";
			bfs25Txt	= "Or that which would reduce her to storm stay-sails.";
			bfs26Txt	= "Or that which no canvas could withstand.";
			months = [
				"Januari",
				"Februari",
				"Mars",
				"April",
				"Maj",
				"Juni",
				"Juli",
				"Augusti",
				"September",
				"Oktober",
				"November",
				"December"
			];
			days = [
				"Söndag",
				"Måndag",
				"Tisdag",
				"Onsdag",
				"Torsdag",
				"Fredag",
				"Lördag"
			];
			directionsTxt = [
				"N",
				"NNV",
				"NV",
				"VNV",
				"V",
				"VSV",
				"SV",
				"SSV",
				"S",
				"SSÖ",
				"SÖ",
				"ÖSÖ",
				"Ö",
				"ÖNÖ",
				"NÖ",
				"NNÖ",
				"N"
			];
			break;
		default:
			gettingTxt	= "getting weather";
			locErrorTxt	= "IP address location service is unavailable.";
			gpsTxt		= "GPS: ";
			minMaxTxt	= "Min/Max temperatur idag:<br>";
			pressureTxt	= "Pressure: ";
			humidityTxt	= "Humidity: ";
			windTxt		= "Winds: ";
			sunRiseTxt	= "Sunrise: ";
			sunSetTxt	= "Sunset: ";
			goldenTxt	= "Golden hour: ";
			goldMorTxt	= "morning golden hour (soft light, best time for photography) ends";
			goldEveTxt	= "evening golden hour starts";
			moonRiseTxt	= "Moon Rises: ";
			moonSetsTxt	= "Moon Sets: ";
			clearTxt	= "clear";
			cloudTxt	= "cloud";
			rainTxt		= "rain";
			snowTxt		= "snow";
			sunTxt		= "sun";
			mistTxt		= "mist";
			bfsHeadTxt	= "Beaufort number: ";
			bfs00Txt	= "Calm";
			bfs01Txt	= "Light air";
			bfs02Txt	= "Light breeze";
			bfs03Txt	= "Gentle breeze";
			bfs04Txt	= "Moderate breeze";
			bfs05Txt	= "Fresh breeze";
			bfs06Txt	= "Strong breeze";
			bfs07Txt	= "Moderate gale";
			bfs08Txt	= "Fresh gale";
			bfs09Txt	= "Strong gale";
			bfs10Txt	= "Whole gale";
			bfs11Txt	= "Storm";
			bfs12Txt	= "Hurricane";
			bfs13Txt	= bfs12Txt;
			bfs14Txt	= bfs12Txt;
			bfs15Txt	= bfs12Txt;
			bfs16Txt	= bfs12Txt;
			bfs17Txt	= bfs12Txt;
			bfs21Txt	= "Or just sufficient to give steerage way.";
			bfs22Txt	= "Or that in which a man-of-war, with all sail set, and clean full, would go in smooth water, from";
			bfs07Txt	= "High wind, moderate gale, near gale";
			bfs23Txt	= "Or that to which a well-conditioned man-of-war could just carry in chase, full and by";
			bfs24Txt	= "Or that which she could scarcely bear close-reefed main-topsail and reefed foresail.";
			bfs25Txt	= "Or that which would reduce her to storm stay-sails.";
			bfs26Txt	= "Or that which no canvas could withstand.";
			months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			];
			days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			];
			directionsTxt = [
				"N",
				"NNW",
				"NW",
				"WNW",
				"W",
				"WSW",
				"SW",
				"SSW",
				"S",
				"SSE",
				"SE",
				"ESE",
				"E",
				"ENE",
				"NE",
				"NNE",
				"N"
			];
	}
	switch ( unitsFormat ) {
		case "metric":
			tempForm	= "°C";
			windSpeed	= "ms";
			beaufortForm = "bft";
			pressureForm = " hPa";
			humidityForm = "%";
			timeForm	= "eu";
			//dateForm = day + date + month + year;
		break;
		case "imperial":
			tempForm	= "°F";
			windSpeed	= "mph";
			beaufortForm = "bft";
			pressureForm = " hPa";
			humidityForm = "%";
			timeForm	= "en";
			//dateForm = day + ", " + month + " " + date + ", " + year;
		break;
		default:
			tempForm	= "°K";
			windSpeed	= "mph";
			beaufortForm = "bft";
			pressureForm = " hPa";
			humidityForm = "%";
			timeForm	= "en";
			//dateForm = day + ", " + month + " " + date + ", " + year;
	}

	/*-_-_--_-_-_-_- Leave alone -_--_-_-_-_-_-*/
	var dataDiv = "<span class='divider'>|</span>";
	var wd_LB = '&#013;';// Hard Linebreak

	var svgPrefix			= '<svg class="svgIcon" role="img">';
	var titlePrefix			= '<title style="white-space:pre-line;margin:0 10px 0 10px;">';
	var titleSuffix			= '</title>';
	var usePrefix			= '<use xlink:href="#';
	var useSuffix			= '" /></svg>';

	var textSpanPrefix		= '<span class="dataText">';
	var textSpanSuffix		= '</span>';

	var timePrefix			= '<time class="dataText" datetime="';
	var timePrefixEnd		= '">';
	var timeSuffix			= "</time>";

	var useCompass			= svgPrefix + usePrefix + "compass_rose" + useSuffix;
	var useLocation			= svgPrefix + titlePrefix + gpsTxt + titleSuffix + usePrefix + "location" + useSuffix;
	var useSunRise			= svgPrefix + titlePrefix + sunRiseTxt + titleSuffix + usePrefix + "sunrise" + useSuffix;
	var useSunSet			= svgPrefix + titlePrefix + sunSetTxt + titleSuffix + usePrefix + "sunset" + useSuffix;
	var useGoldenHour		= svgPrefix + titlePrefix + goldenTxt + titleSuffix + usePrefix + "goldenhour" + useSuffix;
	var useMoonRise			= svgPrefix + titlePrefix + moonRiseTxt + titleSuffix + usePrefix + "moonrise" + useSuffix;
	var useMoonSet			= svgPrefix + titlePrefix + moonSetsTxt + titleSuffix + usePrefix + "moonset" + useSuffix;
	var useHumidity			= svgPrefix + titlePrefix + humidityTxt + titleSuffix + usePrefix + "humidity" + useSuffix;
	var useWindspeed		= svgPrefix + titlePrefix + windTxt + titleSuffix + usePrefix + "windspeed" + useSuffix;
	var usePressure			= svgPrefix + titlePrefix + pressureTxt + titleSuffix + usePrefix + "pressure" + useSuffix;
	var useTemprature		= svgPrefix + titlePrefix + tempForm + titleSuffix + usePrefix + "temperatur" + useSuffix;
	var useWindRose			= svgPrefix + usePrefix + "windirection" + useSuffix;
	var useWeatherDude		= '<svg class="getting" role="img">' + titlePrefix + gettingTxt + titleSuffix + usePrefix + "weatherDude" + useSuffix;

	var container, sStyles, now, dd, td, details, wd_summary;
	var lat, lon, region, gd, gpsbutton;
	var city = "";
	var weatherurl, wd, icon, beaufort;
	var weatherdata, weatherminute;
	var sunsettime = 0;
	var sunrisetime = 0;
	var cloudlayer, rainlayer, snowlayer, sunlayer, clearnightlayer, mistlayer;
	var isDark, isCloudy, isRainy, isSnowy, isSunny, isClearNight, isClear, isMisty, isDusk, isDawn;

	document.addEventListener("DOMContentLoaded", init, false);

	function init() {
		//now = new Date(2018, 11, 31, 17, 14, 26, 0); // for testing
		var href = window.location.href;
		if ( href.indexOf("localhost:")>= 0 || href.indexOf("file:")>= 0 ) {
			usephp = false;
			//also remember to load yak code
		}
		// Inject the svgSprite https://css-tricks.com/ajaxing-svg-sprite/
		if ( useSVG ) {
			var ajax = new XMLHttpRequest();
			ajax.open("GET", "img/sprite.svg", true);
			ajax.send();
			ajax.onload = function(e) {
				var svgSprite = document.createElement("div");
				svgSprite.className = "svgSprite";
				svgSprite.innerHTML = ajax.responseText;
				document.body.insertBefore(svgSprite, document.body.childNodes[0]);
			}
		}
		document.getElementsByTagName("html")[0].setAttribute("lang", langCode);
		container = document.getElementById("container");
		sStyles = document.getElementById('svgValues');
		dd = document.getElementById("date");
		td = document.getElementById("time");
		wd = document.getElementById("weather");
		wd_summary = document.getElementById("details");
		details = document.getElementById("weatherdetails");
		gd = document.getElementById("gps");
		beaufort = document.getElementById("beaufort");
		icon = document.getElementById("icon");

		cloudlayer = document.getElementById("cloudlayer");
		rainlayer = document.getElementById("rainlayer");
		snowlayer = document.getElementById("snowlayer");
		sunlayer = document.getElementById("sunlayer");
		clearnightlayer = document.getElementById("clearnightlayer");
		mistlayer = document.getElementById("mistlayer");
		gpsbutton = document.getElementById("gpsbutton");
		gpsbutton.addEventListener("click",getLocation,false);
		weatherminute = randRange(0,14);
		getLocation();
		updateTime();
		setInterval(updateTime,1000);
	}

	function updateTime() {
		var clockdata = getClockStrings();
		dd.innerHTML = clockdata.datehtml;
		td.innerHTML = clockdata.timehtml;
		dd.dateTime = now.toISOString();
		td.dateTime = now.toISOString();
		var sec = now.getSeconds();
		var minutes = now.getMinutes();
		if (locationRequested && sec === 0) {
			setLayers();
			if (minutes % 15 === weatherminute) {
				getWeather(); //get weather every 15 minutes while the app is running
				//weatherminute is a random number between 0 and 14 to ensure
				//that users don't all hit the API at the same minute
			}
			if (minutes % 5 === 0 && !useip) {
				getLocation(); //get location every 5 minutes if not using ip for location
			}
		}
	}

	function getClockStrings() {
		now = new Date();
		//now = new Date(now.getTime() + 1000); // for testing fixed dates
		var year = now.getFullYear();
		//console.log(now.getMonth());
		var month = months[now.getMonth()];
		var date = now.getDate();
		var day = days[now.getDay()];
		var hour = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		var clockminutes = minutes < 10 ? "0" + minutes : minutes;
		var clockseconds = seconds < 10 ? "0" + seconds : seconds;
		if ( unitsFormat == "metric" ) {
			var clockhour = hour < 10 ? "0" + hour : hour;
			var datehtml = day + " " + date + " " + month + " " + year;
			var timehtml = clockhour + ":" + clockminutes + "<span>:" + clockseconds + "</span>";
		} else {
			var meridian = hour < 12 ? "AM" : "PM";
			var clockhour = hour > 12 ? hour - 12 : hour;
			if ( hour === 0) {
				clockhour = 12;
			}
			var datehtml = day + ", " + month + " " + date + ", " + year;
			var timehtml = clockhour + ":" + clockminutes + "<span>:" + clockseconds + " " + meridian + "</span>";
		}
		return {"datehtml":datehtml,"timehtml":timehtml};
	}

	function getLocation() {
		if (useip) {
			getIPLocation();
		} else {
			getGPSLocation();
		}
	}

	function getGPSLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(gpsPosition,geoError);
		} else {
			gd.innerHTML = locErrorTxt;
			locationRequested = false;
		}
	}

	function getIPLocation() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (!locationRequested) {
				if (this.readyState === 4) {
					var json = JSON.parse(xhttp.responseText);
					var noerror = true;//for testing
					if (this.status === 200 && noerror) {
						if (json.status === "success") {
							lat = Number(json.lat);
							lon = Number(json.lon);
							city = json.city;
							region = json.region;
							country = json.countryCode;
							//gd.innerHTML = "<span id='city'>" + city + ",</span><span id='region'> " + region + "</span><span id='country'> (" + country + ")</span> <span class='svgIcon' id='gps_compass'>" + useCompass + "</span>";
							gpsbutton.style.display = "none";
							showPosition();
						} else {
							gpsbutton.style.display = "block";
							useip = false;
						}
					} else {
						gpsbutton.style.display = "block";
						useip = false;
					}
				}
			}
		};
		xhttp.open("GET", "https://extreme-ip-lookup.com/json/", true);
		xhttp.send();
	}

	function geoError() {
		gd.innerHTML = locErrorTxt;
	}

	function gpsPosition(json) {
		gpsbutton.style.display = "none";
		lat = json.coords.latitude;
		lon = json.coords.longitude;
		gd.innerHTML = city + " (" + lat.toFixed(2) + " | " + lon.toFixed(2) + ")";
		showPosition();
	}

	function showPosition() {
		if ( usephp ) {
			weatherurl = "weather.php?lat=" + lat + "&lon=" + lon + "&lang=" + langCode + "&units=" + unitsFormat;
			//weatherurl = "weather.php?lat=200&lon=200"; // for testing error response
		} else {
			weatherurl = "https://api.openweathermap.org/data/2.5/weather?";
			weatherurl += "lat=" + lat + "&lon=" + lon + "&lang=" + langCode + "&units=" + unitsFormat + "&APPID=" + appID;
			//for the APPID, please substitute your own API Key you can get for free from openweathermap.org
		}
		if (!locationRequested) {
			//gets the weather when the page first loads and GPS coordinates are obtained
			getWeather();
			locationRequested = true;
		}
	}

	function getWeather() {
		wd.innerHTML = gettingTxt + "<br />" + useWeatherDude;
		// I opted to use the older XMLHttpRequest because fetch is not supported on old devices like the iPhone 4s
		// I developed this page so I could use my old iPhone 4s as a wall clock.
		var xhttp = new XMLHttpRequest();
		if ( usephp ) {
			//the php file returns a document rather than plain text
			xhttp.responseType = "document";
		} else {
			xhttp.responseType = "text";
		}
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				//when using php as a data source we need the textContent of the body of the returned document
				var data = usephp ? xhttp.response.body.textContent : xhttp.responseText;
				weatherdata = JSON.parse(data);
				processWeather(weatherdata);
			}
		};
		xhttp.open("GET", weatherurl, true);
		xhttp.send();
	}

	function processWeather(data) {
		//console.log('Weather id: '+weather.id);
		// NOTE SunCalc
		//var SunCalc;
		/*
		var SunCalcNow = new Date();
		var SunCalLat = lat.toFixed(2);
		var SunCalLon = lon.toFixed(2);

		var getMoonTimes = SunCalc.getMoonTimes( SunCalcNow, SunCalLat, SunCalLon);
		//Object.keys(getMoonTimes).forEach(function(key) {
		//	console.log(key + ': ' + getMoonTimes[key]);
		//});
		var getSunTimes = SunCalc.getTimes( SunCalcNow, SunCalLat, SunCalLon);
		//Object.keys(getSunTimes).forEach(function(key) {
		//	console.log(key + ': ' + getSunTimes[key]);
		//});

		// NOTE Moon up & Down
		var moonRises = timePrefix;
			moonRises += new Date(getMoonTimes['rise']).toISOString();
			moonRises += timePrefixEnd;
			moonRises += getMoonTimes['rise'].toLocaleTimeString(timeForm);
			moonRises += timeSuffix;

		var moonSets = timePrefix;
			moonSets += new Date(getMoonTimes['set']).toISOString();
			moonSets += timePrefixEnd;
			moonSets += getMoonTimes['set'].toLocaleTimeString(timeForm);
			moonSets += timeSuffix;

		var moonUp = useMoonRise + moonRises;
		var moonDown = useMoonSet + moonSets;

		// NOTE Golden hours
		var goldMorTime = timePrefix;
			goldMorTime += new Date(getSunTimes['goldenHourEnd']).toISOString();
			goldMorTime += timePrefixEnd;
			goldMorTime += getSunTimes['goldenHourEnd'].toLocaleTimeString(timeForm);
			goldMorTime += timeSuffix;

		var goldEveTime = timePrefix;
			goldEveTime += new Date(getSunTimes['goldenHour']).toISOString();
			goldEveTime += timePrefixEnd;
			goldEveTime += getSunTimes['goldenHour'].toLocaleTimeString(timeForm);
			goldEveTime += timeSuffix;

		var goldSvgPrefix = svgPrefix;
			goldSvgPrefix += titlePrefix;
		var goldSvgSuffix = titleSuffix;
			goldSvgSuffix += usePrefix;
			goldSvgSuffix += "goldenhour";
			goldSvgSuffix += useSuffix;

		var morningHour = goldSvgPrefix;
			morningHour += goldenTxt + goldMorTxt;
			morningHour += goldSvgSuffix;
			morningHour += goldMorTime;
		var eveningHour = goldSvgPrefix;
			eveningHour += goldenTxt + goldEveTxt;
			eveningHour += goldSvgSuffix;
			eveningHour += goldEveTime;

			var morningHourline = '<li id="wd_morning">' + morningHour;
			var moonriseline = '<li id="wd_moonrise">' + moonUp;
			var eveningHourline = '<li id="wd_evening">' + eveningHour;
			var moonsetline = '<li id="wd_moonset">' + moonDown;
		*/


		if (!useip){
			city = data.name;
			region = "";
			gd.innerHTML = textSpanPrefix + city + " (" + lat.toFixed(2) + " | " + lon.toFixed(2) + ")" + textSpanSuffix;
		}
		// var dh = JSON.stringify(data);
		// dh = dh.split(",").join("<br>");

		// NOTE Convert hPA to kPa for display in gauge
		var hPaData = data.main.pressure;
		var kPaOut = hPaData/10;
		//var hPaOut = hPaData.substring(0, 3);
		//var hPaOut = hPaData.match(/.{1,3}/g);
		//var kPaOut = hPaOut.join(".");

		// NOTE Get sun position
		var sunUpRaw, sunDownRaw, sunNowRaw, sunUp, sunNow, sunDown, sunLeft, sunHours, sunLeftCalc, sunPosition;
		var sunUpRaw	= new Date(data.sys.sunrise * 1000);
		var sunNowRaw	= new Date();
		var sunDownRaw	= new Date(data.sys.sunset * 1000);
		var sunUp		= sunUpRaw.getHours()+'.'+sunUpRaw.getMinutes();	/* A */
		var sunNow		= sunNowRaw.getHours()+'.'+sunNowRaw.getMinutes();	/* B */
		var sunDown		= sunDownRaw.getHours()+'.'+sunDownRaw.getMinutes();/* C*/
		var sunLeft		= sunDown - sunNow;	/* D = C - B */
		var sunHours	= sunDown - sunUp;	/* X = C - A */
		var sunLeftCalc	= sunLeft * 100;	/* Y = D * 100 */
		/* Z = Y * 100 / X */
		var sunPosition	= sunLeftCalc / sunHours;
		//console.log(sunPosition);

		//var svgStyle = '<style id="svgValues">symbol{';
		var svgStyle = ':root{';
			//svgStyle += '--hPa:' + kPaOut.trim() +'deg;';
			svgStyle += '--hPa:'+kPaOut+'deg;';
			svgStyle += '--windeg:'+data.wind.deg+'deg;';
			svgStyle += '--sunPosition:'+sunPosition+'%;';
			svgStyle += '}';
			//svgStyle += '}</style>';
		sStyles.innerHTML = svgStyle;

		var hilowline = '<li id="wd_hilowtemp">';
			hilowline += textSpanPrefix;
			hilowline += "Hourly Max | Min: ";
			hilowline += data.main.temp_max + tempForm;
			hilowline += dataDiv;
			hilowline += data.main.temp_min  + tempForm;
			hilowline += textSpanSuffix;

		var gpsline = '<li id="wd_location">';
			gpsline += useLocation;
			gpsline += textSpanPrefix;
			gpsline += '<a href="https://openweathermap.org/city/';
			gpsline += data.id;
			gpsline += '" title="">';
			gpsline += lat.toFixed(2);
			gpsline += dataDiv;
			gpsline += lon.toFixed(2);
			gpsline += '</a>';
			gpsline += textSpanSuffix;

		var pressureline = '<li id="wd_pressure">';
			pressureline += usePressure;
			pressureline += textSpanPrefix;
			pressureline += data.main.pressure;
			pressureline += pressureForm;
			pressureline += textSpanSuffix;

		var humidityline = '<li id="wd_humidity">';
			humidityline += useHumidity;
			humidityline += textSpanPrefix;
			humidityline += data.main.humidity;
			humidityline += humidityForm;
			humidityline += textSpanSuffix;

		var windline = '<li id="wd_wind">';
			windline += useWindspeed;
			windline += textSpanPrefix;
			windline += data.wind.speed;
			windline += windSpeed;
			windline += textSpanSuffix;
			//windline += beaufortSVG;
			if ( data.wind.deg !=null ) {
				//windline += " ";
				windline += textSpanPrefix;
				windline += getWindDirection(data.wind.deg);
				windline += textSpanSuffix;
				windline += svgPrefix;
				windline += titlePrefix;
				windline += windTxt;
				windline += data.wind.deg.toFixed(0);
				windline += "° ";
				windline += getWindDirection(data.wind.deg);
				windline += titleSuffix;
				windline += usePrefix;
				windline += "windirection";
				windline += useSuffix;
			//} else {
				//windline += useWindspeed;
				//windline += textSpanPrefix;
				//windline += data.wind.speed;
				//windline += windSpeed;
				//windline += textSpanSuffix;
			}

		var sunriseline = '<li id="wd_sunrise">';
			sunriseline += useSunRise;
			sunriseline += textSpanPrefix;
			sunriseline += new Date(data.sys.sunrise * 1000).toLocaleTimeString(timeForm);
			sunriseline += textSpanSuffix;

		var sunsetline = '<li id="wd_sunset">';
			sunsetline += useSunSet;
			sunsetline += textSpanPrefix;
			sunsetline += new Date(data.sys.sunset * 1000).toLocaleTimeString(timeForm);
			sunsetline += textSpanSuffix;

		details.innerHTML = windline + pressureline + humidityline + sunriseline + sunsetline + gpsline;
		//details.innerHTML = svgStyle + windline + pressureline + humidityline + sunriseline + sunsetline + gpsline;
		//details.innerHTML = svgStyle + windline + pressureline + humidityline + sunriseline + morningHourline + moonsetline + sunsetline + eveningHourline + moonriseline + gpsline;
		// NOTE Set the details section to display block
		wd_summary.className = "visible";

		var weather = data["weather"][0];

		icon.className = "weather i-" + weather.icon;
		icon.style.opacity = 1;
		icon.innerHTML = svgPrefix + usePrefix + weather.icon + useSuffix;
		var localtemperature = data["main"].temp;
		var weatherstring = useTemprature;
			weatherstring += textSpanPrefix;
			weatherstring += localtemperature;
			weatherstring += tempForm;
			weatherstring += textSpanSuffix;
			//weatherstring += "&nbsp;&nbsp;";
			weatherstring += textSpanPrefix;
			weatherstring += weather.description;
			weatherstring += textSpanSuffix;
		// var weathergov = "https://forecast.weather.gov/MapClick.php";
		// var weatherlink = '<a class="weatherlink" target="_blank" href="'+weathergov+'?lat=' + lat + '&lon=' + lon + '">';
		// wd.innerHTML =  weatherlink + weatherstring + "</a>";
		wd.innerHTML = weatherstring;
		wd_beaufort(data);
		setLayers();
	}

	function wd_beaufort(data) {
		// NOTE Convert m/s to beaufort scale
		// Skalan kan beräknas med formeln V = k · B3/2, där k = 0,8365, B = Beauforttalet, och V = vindhastighet i m/s
		// 2.9 = 0.8365 * 3/2
		var wd_ws = data.wind.speed;
		if ( wd_ws >=    0 && wd_ws <=  0.2 ) {
			wd_bf =  0;
			wd_bfTxt = bfs21Txt + wd_LB + bfs00Txt;
		}
		if ( wd_ws >=  0.3 && wd_ws <=  1.5 ) {
			wd_bf =  1;
			wd_bfTxt = bfs01Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  1.6 && wd_ws <=  3.3 ) {
			wd_bf =  2;
			wd_bfTxt = bfs02Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  3.4 && wd_ws <=  5.4 ) {
			wd_bf =  3;
			wd_bfTxt = bfs03Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  5.5 && wd_ws <=  7.9 ) {
			wd_bf =  4;
			wd_bfTxt = bfs04Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  8.0 && wd_ws <= 10.7 ) {
			wd_bf =  5;
			wd_bfTxt = bfs05Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 10.8 && wd_ws <= 13.8 ) {
			wd_bf =  6;
			wd_bfTxt = bfs06Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 13.9 && wd_ws <= 17.1 ) {
			wd_bf =  7;
			wd_bfTxt = bfs07Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 17.2 && wd_ws <= 20.7 ) {
			wd_bf =  8;
			wd_bfTxt = bfs08Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 20.8 && wd_ws <= 24.4 ) {
			wd_bf =  9;
			wd_bfTxt = bfs09Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 24.5 && wd_ws <= 28.4 ) {
			wd_bf = 10;
			wd_bfTxt = bfs10Txt + wd_LB + bfs24Txt;
		}
		if ( wd_ws >= 28.5 && wd_ws <= 32.6 ) {
			wd_bf = 11;
			wd_bfTxt = bfs11Txt + wd_LB + bfs25Txt;
		}
		if ( wd_ws >= 32.7 && wd_ws <= 36.9 ) {
			wd_bf = 12;
			wd_bfTxt = bfs12Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 37.0 && wd_ws <= 41.4 ) {
			wd_bf = 13;
			wd_bfTxt = bfs13Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 41.5 && wd_ws <= 46.1 ) {
			wd_bf = 14;
			wd_bfTxt = bfs14Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 46.2 && wd_ws <= 50.9 ) {
			wd_bf = 15;
			wd_bfTxt = bfs15Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 51.0 && wd_ws <= 56.0 ) {
			wd_bf = 16;
			wd_bfTxt = bfs16Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 56.1 && wd_ws <= 61.2 ) {
			wd_bf = 17;
			wd_bfTxt = bfs17Txt + wd_LB + bfs26Txt;
		}
		if ( wd_bf >=    0 && wd_bf <=    2 ) bfSvgId = 0, ws_s = 65, ws_m = 45, ws_f = 35;
		if ( wd_bf >=    3 && wd_bf <=    4 ) bfSvgId = 1, ws_s = 65, ws_m = 45, ws_f = 35;
		if ( wd_bf >=    5 && wd_bf <=    6 ) bfSvgId = 2, ws_s = 65, ws_m = 45, ws_f = 35;
		if ( wd_bf >=    7 && wd_bf <=    8 ) bfSvgId = 3, ws_s = 55, ws_m = 35, ws_f = 25;
		if ( wd_bf >=    9 && wd_bf <=   10 ) bfSvgId = 4, ws_s = 45, ws_m = 25, ws_f = 15;
		if ( wd_bf >=   11 && wd_bf <=   17 ) bfSvgId = 5, ws_s = 35, ws_m = 15, ws_f =  5;

		var wd_beaufortTitle = bfsHeadTxt + wd_bf + beaufortForm + wd_LB + wd_bfTxt;
		var beaufortSVG = svgPrefix;
			beaufortSVG += titlePrefix;
			beaufortSVG += wd_beaufortTitle;
			beaufortSVG += titleSuffix;
			beaufortSVG += usePrefix;
			beaufortSVG += "bf" + bfSvgId;
			beaufortSVG += useSuffix;
			beaufortSVG += "<style>.cloud{--windspeed-s:"+ws_s+"s;--windspeed-m:"+ws_m+"s;--windspeed-f:"+ws_f+"s;}</style>";

		beaufort.className = "windspeed i-" + wd_bf + "bf";
		beaufort.innerHTML = beaufortSVG;
	}

	function getWindDirection(deg) {
		var degs = [348.75,326.25,303.75,281.25,258.75,236.25,213.75,191.25,168.75,146.25,123.75,101.25,78.75,56.25,33.75,11.25,0];
		for ( var i=0;i < degs.length;i++) {
			if ( deg > degs[i] ) {
				return directionsTxt[i];
			}
		}
		return "__";
	}

	function setLayers() {
		if (weatherdata) {
			var weather = weatherdata["weather"][0];
			sunsettime = Number(weatherdata["sys"].sunset);
			sunrisetime = Number(weatherdata["sys"].sunrise);
			checkForSunset();
			isClear = (weather.description.indexOf(clearTxt) >= 0);

			isCloudy = (weather.description.indexOf(cloudTxt) >= 0) || weather.description.indexOf(cloudTxt2) >= 0;
			//isCloudy = false; //for testing
			cloudlayer.style.display = isCloudy ? "block" : "none";
			cloudlayer.style.opacity = isDark ? 0.75 : 1;

			isRainy = (weather.description.indexOf(rainTxt) >= 0);
			//isRainy = false; //for testing
			rainlayer.style.display = isRainy ? "block" : "none";
			rainlayer.style.opacity = isDark || isDusk ? 0.05 : 0.1;

			isSnowy = (weather.description.indexOf(snowTxt) >= 0);
			//isSnowy = true; //for testing
			snowlayer.style.display = isSnowy ? "block" : "none";
			snowlayer.style.opacity = isDark ? 0.1 : 0.75;

			isSunny = (weather.description.indexOf(sunTxt) >= 0 || (isClear && !isDark));
			//isSunny = false; //for testing
			sunlayer.style.display = isSunny ? "block" : "none";

			isClearNight = (weather.description.indexOf(clearTxt) >= 0) && isDark;
			//isClearNight = false; //for testing

			isMisty = (weather.description.indexOf(mistTxt) >= 0);
			//isMisty = false; //for testing
			mistlayer.style.display = isMisty ? "block" : "none";
			mistlayer.style.opacity = isDark ? 0.75 : 0.85;
			if (isDark && isMisty) {
				isClearNight = true;
			}
			clearnightlayer.style.display = isClearNight || isDusk || isDawn ? "block" : "none";
			clearnightlayer.style.opacity = isDusk || isDawn ? 0.2 : 1;
		}
	}

	function checkForSunset() {
		var nowtime = now.getTime()/1000;
		//changes the presentation style if the time of day is after sunset
		//or before the next day's sunrise
		var wasDark = isDark;
		var sunrisedate = new Date(sunrisetime * 1000);
		var sunsetdate = new Date(sunsettime * 1000);
		isDark = nowtime >= sunsettime + 1740 || nowtime + 900 <= sunrisetime;
		isDusk = nowtime - sunsettime < 1740 && nowtime - (sunsettime - sunsetdate.getSeconds() - 1) >= 0;
		isDawn = sunrisetime - nowtime < 900 && sunrisetime - (nowtime + sunrisedate.getSeconds() + 1) >= 0;
		//console.log(nowtime,sunsettime,sunrisetime,isDark,isDusk,isDawn);
		//isDark = true; //for testing
		//only change styles if isDark has changed
		if (isDark !== wasDark) {
			//container.className = isDark ? "nightmode" : "daymode";
			//css in JavaScript seems to work more reliably when the iPhone 4s is in standalone mode
			if (isDark) {
				container.style.background = "#121212 linear-gradient(to bottom left, #121212 10%,#333955 100%)";
			} else {
				container.style.background = "#87ceeb linear-gradient(to bottom left, #87ceeb 0%,#ccc 100%)";
			}
			container.style.color = isDark ? "#fff" : "#333";
			container.style.textShadow = isDark ? "1px 1px 1px black" : "2px 2px 4px white";
		}
		var weather = weatherdata["weather"][0];
		if (isDark && weather.icon.substring(2,3) === "d") {
			weather.icon = weather.icon.substring(0,2) + "n";
		}
		if (!isDark && weather.icon.substring(2,3) === "n") {
			weather.icon = weather.icon.substring(0,2) + "d";
		}
		icon.className = "weather i" + weather.icon;
		icon.innerHTML = svgPrefix + usePrefix + weather.icon + useSuffix;
	}

	//random number utility function
	function randRange(min, max) {
		return Math.floor(Math.random()*(max-min+1))+min;
	}
})();
// remove unwanted nodes from inside a DOM node
(function() {
	var utils = {};
	var node, cleanGps, cleanForecast;
	var doc = document;
	var cleanGps = doc.getElementById("gps");
	var cleanForecast = doc.getElementById("forecast");
	utils.clean = function(node) {
		var child, i, len = node.childNodes.length;
		if (len === 0) { return; }
		// iterate backwards, as we are removing unwanted nodes
		for (i = len; i > 0; i -= 1) {
			child = node.childNodes[i - 1];
			// comment node? or empty text node
			if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue) )) {
				node.removeChild(child);
			/*} else {
				if (child.nodeType === 1) {
					utils.clean(child);
				}*/
			}
		}
	};
	setTimeout(function() {
		//document.documentElement.className='cText';
		utils.clean(cleanGps);
		utils.clean(cleanForecast);
	}, 2000);
})();
