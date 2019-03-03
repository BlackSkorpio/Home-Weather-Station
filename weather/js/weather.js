/* minifyOnSave, checkOutputFileAlreadyExists: false, checkAlreadyMinifiedFile: false, filenamePattern: $1.min.$2 */
/*! Home Weather Station weather.js
 *  Copyright  (c) 2015-2019 Bjarne Varoystrand - bjarne ○ kokensupport • com
 *  License: MIT
 *  @author Bjarne Varoystrand (@black_skorpio)
 *  @version 1.4.5
 *  @description Forked from the ShearSpire Media Weather Clock by Steven Estrella (https://www.shearspiremedia.com)
 *               First introduced here: https://css-tricks.com/how-i-built-a-gps-powered-weather-clock-with-my-old-iphone-4/
 *  http://varoystrand.se | http://kokensupport.com
**/
(function() {
	'use strict';
	//NOTE: ES5 chosen instead of ES6 for compatibility with older mobile devices
	var usephp			= true; // set to true to use a PHP document to hide your api key
		var useip		= true;
		var locationRequested = false;
		var useSVG		= true;
		var appID		= "YOUR_API_KEY_HERE"; // NOTE Only usefull if you opt-out of using the weather.php or as an backup

		var appVersion	= "1.4.5";
		var appName		= "Home Weahter Station";
		var _cslFlag	= false;
		var _cslHash	= 'CSL';
		var _cslState	= 0;
		var devHost		= (location.hostname == 'oxygen.local' || location.hostname == 'varoystrand.se');
		var DEVCONSOLE	= (_cslState == 1 && devHost) || location.hash == '#'+_cslHash;

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
	var langCode = "se";
	/* Units format
		Standard, metric, and imperial units are available.
			Temperature is available in Fahrenheit, Celsius and Kelvin units.
				For temperature in Fahrenheit use units = imperial
				For temperature in Celsius use units = metric
				For Temperature in Kelvin use units = Standard
	*/
	var unitsFormat = "metric";

	var doc = document,
		win = window;
		var Fragments, svgIcon, precipionTxt, precipion1Txt, precipion3Txt, notificationTxt, weatherDescTxt, updateNowTxt, updateSecTxt, updateMinTxt, updateHourTxt, updateDayTxt, updateMonthTxt, updateYearTxt, updateAgoTxt, updatePluralTxt, updatePlural2Txt, galeTxt, updatedTimeTxt, detailsTxt, bfsTxt, locationTxt, windDirTxt, gettingTxt, locErrorTxt, gpsTxt, minMaxTxt, visibilityTxt, visibilityDesc, cloudinessTxt, cloudinessDesc, pressureTxt, humidityTxt, windTxt, sunRiseTxt, sunSetTxt, goldenTxt, goldMorTxt, goldEveTxt, moonRiseTxt, moonSetsTxt, clearTxt, cloudTxt, cloudTxt2, rainTxt, snowTxt, sunTxt, mistTxt, moonsetDesc, moonriseDesc, locationDesc, sunsetDesc, sunriseDesc, humidityDesc, pressureDesc, winddirDesc, windSpeedDesc, bftDesc, modalDescTxt, modalTitleTxt, wd_bfTxt, bfsHeadTxt, bfs00Txt, bfs01Txt, bfs02Txt, bfs03Txt, bfs04Txt, bfs05Txt, bfs06Txt, bfs07Txt, bfs08Txt, bfs09Txt, bfs10Txt, bfs11Txt, bfs12Txt, bfs13Txt, bfs14Txt, bfs15Txt, bfs16Txt, bfs17Txt, bfs21Txt, bfs22Txt, bfs23Txt, bfs24Txt, bfs25Txt, bfs26Txt, buttonOpen, months, days, directionsTxt, beaufortScale, ws_bft, wd_ws, wd_windspeed, wd_bf, bfSvgId, ws_s, ws_m, ws_f, wd_stormFlag, miles, km, visibleLength, localtemperature, tempForm, overcastForm, visibilityForm, windSpeed, beaufortForm, pressureForm, humidityForm, timeForm, tempClr, rainyWindow, overCastLayer;

	/*-_--_-_-_-_- Language strings -_--_-_-_-_-*/
	switch ( langCode ) {
		case "se":
			weatherDescTxt = appName + " är en webbaserad applikation som är gjord för att fungera på allt från smarta klockor till datorn; eller din TV.<br />Aktuell version av " + appName + " är " + appVersion;
			notificationTxt = appName + "<br />is now ready to go offline";
			gettingTxt	= "Läser in vädret";
			locErrorTxt	= "GEO-location service är inte tillgänglig, försök igen senare.";
			detailsTxt	= "Vädret i Detalj";
			gpsTxt		= "GPS: ";
			updatedTimeTxt = "Uppdaterades: ";
			locationTxt	= "Kordinater: ";
			locationDesc = "Längd- och latitudkoordinater baseras på den IP-adress du har tilldelats av din operatör, <br /> och används av oss för att bestämma var du befinner dig.";
			minMaxTxt	= "Min/Max temperatur idag: ";
			precipionTxt = "Nederbörd: ";
			precipion1Txt = "den senaste timmen";
			precipion3Txt = "de sista tre timmarna";
			visibilityTxt = "Sikt: ";
			visibilityDesc = "Sikt rapporteras i kilometer (km). Det definieras som det största avstånd vid vilket ett stort svart föremål kan ses och redovisas mot himlen. Sikt beräknas utifrån mätningar av ljusspridning och absorption av partiklar och gaser.";
			cloudinessTxt = "Molntäcke: ";
			cloudinessDesc = "Den totala molnmängden ska ange hur stor del av himlen som skymd av moln utan hänsyn till molnslag eller molnhöjd och rapporteras i procent, där 0% betyder molnfritt och 100% helt molntäckt himmel.";
			pressureTxt	= "Lufttryck: ";
			pressureDesc = "Lufttrycket, även känt som atmosfärstryck, är kraften per enhetsarea som utövas på en yta av vikten av luft ovanför den ytan i atmosfären av en planet.<br />I de flesta fall är atmosfärstrycket nära approximerat av det hydrostatiska trycket som orsakas av luftens vikt över mätpunkten.";
			humidityTxt	= "Luftfuktighet: ";
			humidityDesc = "Luftfuktighet är vattendammmassan i den totala massan av torr luft i en viss volym luft vid en viss temperatur. I huvudsak ju varmare luften är desto mer vatten kan luften innehålla.<br />Relativ luftfuktighet blir förhållandet med högsta absoluta luftfuktighet mot den aktuella absoluta fuktigheten, som är beroende av aktuell lufttemperatur.";
			windTxt		= "Vindhastighet: ";
			windSpeedDesc = "Prognoserna för vindhastighet och riktning är medelvärdet av dessa vindar och lulls, mätt över 10 minuter i en höjd av 10 meter över havet. Gustarna under en 10-minutersperiod är typiskt 40% högre än den genomsnittliga vindhastigheten.";
			windDirTxt	= "Vindriktning: ";
			winddirDesc = "Vindriktningen är baserad på sann nordlig orientering och är den riktning som vinden blåser från. Till exempel blåser en nordlig vind från norr mot söder.<br />Vindhastighet och riktning kan påverkas väsentligt av lokal miljö. Klippor och andra landskapsfunktioner kommer att påverka vindar nära stranden.";
			sunRiseTxt	= "Soluppgång: ";
			sunriseDesc = "Klockslag när solen börjar gå upp.";
			sunSetTxt	= "Solnedgång: ";
			sunsetDesc	= "Klockslag när solen börjar gå ner.";
			goldenTxt	= "Gyllene timmen: ";
			goldMorTxt	= "Morgonens gyllene timmen (mjukt ljus, bästa tiden för fotografering) slutar.";
			goldEveTxt	= "Kvällens gyllene timmen börjar";
			moonRiseTxt	= "Månen går upp: ";
			moonriseDesc = "Klockslag när månen börjar gå upp.";
			moonSetsTxt	= "Månen går ner: ";
			moonsetDesc	= "Klockslag när månen börjar gå ner.";
			bfsTxt		= "Beaufort Skalan: ";
			bftDesc		= "Beaufort vindskala mäter vindhastighet beroende på vindens påverkan på mark och hav. Även om systemet är gammalt (först utvecklat 1805 av Sir Francis Beaufort), förblir det ett mycket vanligt system för att mäta vindhastighet idag.";
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
			bfs21Txt	= "Eller knappt tillräckligt för att ge styrfart.";
			bfs22Txt	= "Or that in which a man-of-war, with all sail set, and clean full, would go in smooth water, from";
			bfs07Txt	= "High wind, moderate gale, near gale";
			bfs23Txt	= "Or that to which a well-conditioned man-of-war could just carry in chase, full and by";
			bfs24Txt	= "Eller det som hon knappt kunde bära när revat huvudstorsegel och drivs framåt.";
			bfs25Txt	= "Or that which would reduce her to storm stay-sails.";
			bfs26Txt	= "Eller det som ingen segelduk kunde klara av.";
			galeTxt		= "Associerad varningsflagga: ";
			modalTitleTxt = "Icon legend";
			modalDescTxt = "Förklaring till vad de olika ikonerna representerar.";
			updateNowTxt = "precis nu";
			updateSecTxt = "sekund";
			updateMinTxt = "minut";
			updateHourTxt = "timma";
			updateDayTxt = "dag";
			updateMonthTxt = "månad";
			updateYearTxt = "år";
			updateAgoTxt = " sedan";
			updatePluralTxt = "er";
			updatePlural2Txt = "r";
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
			weatherDescTxt = appName + " is a webbased weather app that is designed to be runned on everything from smart watches and computers, to big screen devices as your TV set.<br />Current version of  " + appName + " is " + appVersion;
			notificationTxt = appName + " is now ready to go offline";
			gettingTxt	= "Getting weather";
			locErrorTxt	= "IP address location service is unavailable.";
			detailsTxt	= "Weather Details";
			gpsTxt		= "GPS: ";
			updatedTimeTxt = "Updated: ";
			locationTxt	= "Location: ";
			locationDesc = "Length and latitude coordinates are based on the IP address assigned to you by your operator, <br /> and used by us to determine your location.";
			minMaxTxt	= "Hourly Max | Min: ";
			precipionTxt = "Precipion: ";
			precipion1Txt = "in the last hour";
			precipion3Txt = "in the last 3 hours";
			visibilityTxt = "Visibility: ";
			visibilityDesc = "Visual range is reported in miles (mi). It is defined as the greatest distance at which a large black object can be seen and recognized against the background sky. Visual range is calculated from measurements of light scattering and absorption by particles and gases.";
			cloudinessTxt = "Overcast: ";
			cloudinessDesc = "The total cloud amount should indicate how much of the sky is obscured by clouds without regard to cloud or cloud height and reported in percent, where 0% means cloudless and 100% completely clouded sky.";
			pressureTxt	= "Pressure: ";
			pressureDesc = "Air pressure also known as atmospheric pressure is the force per unit area exerted on a surface by the weight of air above that surface in the atmosphere of a planet.<br />In most circumstances atmospheric pressure is closely approximated by the hydrostatic pressure caused by the weight of air above the measurement point.";
			humidityTxt	= "Humidity: ";
			humidityDesc = "Humidity is the water vapor mass contained within the total mass of dry air inside a specified volume of air at a specific temperature. Essentially, the hotter the air is, the more water the air can contain.<br />Relative humidity becomes the ratio of highest absolute humidity against the current absolute humidity, which is dependent on current air temperature.";
			windTxt		= "Winds: ";
			windSpeedDesc = "The forecasts of wind speed and direction are the average of these gusts and lulls, measured over a 10-minute period at a height of 10 metres above sea level. The gusts during any 10-minute period are typically 40% higher than the average wind speed.";
			windDirTxt	= "Wind direction: ";
			winddirDesc = "The wind direction is based on true north orientation and is the direction the wind is blowing from. For example, a northerly wind is blowing from the north towards the south.<br />Wind speed and direction can be influenced significantly by the local environment. Cliffs and other landscape features will affect winds near the shore.";
			sunRiseTxt	= "Sunrise: ";
			sunriseDesc = "Time when the sun begins to rise";
			sunSetTxt	= "Sunset: ";
			sunsetDesc	= "Time when the sun begins to set";
			goldenTxt	= "Golden hour: ";
			goldMorTxt	= "morning golden hour (soft light, best time for photography) ends";
			goldEveTxt	= "evening golden hour starts";
			moonRiseTxt	= "Moon Rises: ";
			moonriseDesc = "Time when the moon begins to rise";
			moonSetsTxt	= "Moon Sets: ";
			moonsetDesc = "Time when the moon begins to set";
			bfsTxt		= "Beaufort Scale: ";
			bftDesc		= "The Beaufort wind scale measures wind speed according to the impact the wind has on the land and sea. Although the system is old (first developed in 1805 by Sir Francis Beaufort), it remains a widely used system to measure wind speed today.";
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
			galeTxt		= "Associated warning flag: ";
			modalTitleTxt = "Icon legend";
			modalDescTxt = "Explanation on what the different icons represents.";
			updateNowTxt = "just now";
			updateSecTxt = "sec";
			updateMinTxt = "min";
			updateHourTxt = "hour";
			updateDayTxt = "day";
			updateMonthTxt = "month";
			updateYearTxt = "year";
			updateAgoTxt = " ago";
			updatePluralTxt = "s";
			updatePlural2Txt = "s";
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

	/*-_-_--_-_-_-_- Leave alone -_--_-_-_-_-_-*/
	switch ( unitsFormat ) {
		case "metric":
			tempForm	= "°C";
			windSpeed	= "ms";
			visibilityForm = "km";
			overcastForm = "%";
			beaufortForm = "bft";
			pressureForm = " hPa";
			humidityForm = "%";
			timeForm	= "eu";
		break;
		case "imperial":
			tempForm	= "°F";
			windSpeed	= "mph";
			visibilityForm = "mi";
			overcastForm = "%";
			beaufortForm = "bft";
			pressureForm = " hPa";
			humidityForm = "%";
			timeForm	= "en";
		break;
		default:
			tempForm	= "°K";
			windSpeed	= "mph";
			visibilityForm = "m";
			overcastForm = "%";
			beaufortForm = "bft";
			pressureForm = " hPa";
			humidityForm = "%";
			timeForm	= "en";
	}

	var Fragments = new Object();
	var svgIcon = new Object();
	Fragments = {
		dataDiv:	"<span class='divider'>|</span>",
		wd_LB:		'&#013;',// Hard Linebreak
		svgPfx:		'<svg class="svgIcon" role="img">',
		titlePfx:	'<title style="white-space:pre-line;margin:0 10px 0 10px;">',
		titleSfx:	'</title>',
		usePfx:		'<use xlink:href="#',
		useSfx:		'" /></svg>',
		sumPfx:		"<summary>",
		sumSfx:		"</summary>",
		spanPfx:	"<span>",
		spanTxt:	'<span class="dataText">',
		spanSfx:	"</span>",
		timePfx:	'<time class="dataText" datetime="',
		PfxEnd:		'">',
		timeSfx:	"</time>",
		liPfx: '<li',
		idPfx: ' id="'
	};
	var liPfx = Fragments['liPfx'], idPfx = Fragments['idPfx'], timePfx = Fragments['timePfx'], PfxEnd = Fragments['PfxEnd'], timeSfx = Fragments['timeSfx'], dataDiv = Fragments['dataDiv'], wd_LB = Fragments['wd_LB'], sumPfx = Fragments['sumPfx'], sumSfx = Fragments['sumSfx'], spanPfx = Fragments['spanPfx'], spanTxt = Fragments['spanTxt'], spanSfx = Fragments['spanSfx'], svgPfx = Fragments['svgPfx'], titlePfx = Fragments['titlePfx'], titleSfx = Fragments['titleSfx'], usePfx = Fragments['usePfx'], useSfx = Fragments['useSfx'];
	svgIcon = {
		useLocation:	svgPfx + titlePfx + locationTxt + titleSfx + usePfx + "location" + useSfx,
		useSunRise:		svgPfx + titlePfx + sunRiseTxt + titleSfx + usePfx + "sunrise" + useSfx,
		useSunSet:		svgPfx + titlePfx + sunSetTxt + titleSfx + usePfx + "sunset" + useSfx,
		useGoldenHour:	svgPfx + titlePfx + goldenTxt + titleSfx + usePfx + "goldenhour" + useSfx,
		useMoonRise:	svgPfx + titlePfx + moonRiseTxt + titleSfx + usePfx + "moonrise" + useSfx,
		useMoonSet:		svgPfx + titlePfx + moonSetsTxt + titleSfx + usePfx + "moonset" + useSfx,
		useHumidity:	svgPfx + titlePfx + humidityTxt + titleSfx + usePfx + "humidity" + useSfx,
		useWindspeed:	svgPfx + titlePfx + windTxt + titleSfx + usePfx + "windspeed" + useSfx,
		usePressure:	svgPfx + titlePfx + pressureTxt + titleSfx + usePfx + "pressure" + useSfx,
		useTemprature:	svgPfx + titlePfx + tempForm + titleSfx + usePfx + "temperatur" + useSfx,
		useWindRose:	svgPfx + titlePfx + windDirTxt + titleSfx + usePfx + "windirection" + useSfx,
		useWeatherDude:	'<svg class="getting" role="img">' + titlePfx + gettingTxt + titleSfx + usePfx + "weatherDude" + useSfx,
		useBeaufort:	svgPfx + usePfx + "bf0" + useSfx,
		useVisibility:	svgPfx + titlePfx + visibilityTxt + titleSfx + usePfx + "visibility" + useSfx,
		useOvercast:	svgPfx + titlePfx + cloudinessTxt + titleSfx + usePfx,
		useUpdated:		svgPfx + titlePfx + updatedTimeTxt + titleSfx + usePfx + "clock" + useSfx,
		useLogosmall:	svgPfx + titlePfx + appName + titleSfx + usePfx + "logosmall" + useSfx
	};
	var useLocation = svgIcon['useLocation'], useSunRise = svgIcon['useSunRise'], useSunSet = svgIcon['useSunSet'], useGoldenHour = svgIcon['useGoldenHour'], useMoonRise = svgIcon['useMoonRise'], useMoonSet = svgIcon['useMoonSet'], useHumidity = svgIcon['useHumidity'], useWindspeed = svgIcon['useWindspeed'], usePressure = svgIcon['usePressure'], useTemprature = svgIcon['useTemprature'], useWindRose = svgIcon['useWindRose'], useWeatherDude = svgIcon['useWeatherDude'], useBeaufort = svgIcon['useBeaufort'], useVisibility = svgIcon['useVisibility'], useOvercast = svgIcon['useOvercast'], useUpdated = svgIcon['useUpdated'], useLogosmall = svgIcon['useLogosmall'];

	var main, container, sStyles, now, dd, td, dt, details, wd_summary, detailsHeader, infoModal, dtTimeRaw, dtHour, dtMin, dtTime, updatedTime, lat, lon, region, gd, gpsbutton, weatherurl, wd, precipion_wrap, icon, beaufort, weatherdata, weatherminute;
		var city = "";
		var sunsettime = 0;
		var sunrisetime = 0;
		var cloudlayer, rainlayer, rainwindow, snowlayer, sunlayer, clearnightlayer, shootinglayer, moonlayer, mistlayer, isDark, isCloudy, isRainy, isDrizzle, isSnowy, isSunny, isClearNight, isClear, isMisty, isDusk, isDawn, _csl, _cslHeadOpen, _cslHeadDiv, _cslHeadFont, _cslLB, _cslFooter;
		_csl		= console;
		_cslHeadDiv	= ' -=- ';
		_cslHeadOpen = '%c'+_cslHeadDiv;
		_cslHeadFont = 'font:1.5em sans-serif; color:orange;';
		_cslLB		= '\n';
		_cslFooter	= _cslLB+'//-------------------------------------//'+_cslLB+_cslLB;

	doc.addEventListener("DOMContentLoaded", init, false);

	function init() {
		//now = new Date(2018, 11, 31, 17, 14, 26, 0); // for testing
		var href = win.location.href;
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
				var svgSprite = doc.createElement("div");
				svgSprite.className = "svgSprite";
				svgSprite.innerHTML = ajax.responseText;
				doc.body.insertBefore(svgSprite, doc.body.childNodes[0]);
			}
		}
		doc.getElementsByTagName("html")[0].setAttribute("lang", langCode);
		main		= doc.querySelector('main');
		container	= doc.getElementById("container");
		sStyles		= doc.getElementById('svgValues');
		dd			= doc.getElementById("date");
		td			= doc.getElementById("time");
		dt			= doc.getElementById("updateTime");
		wd			= doc.getElementById("weather");
		precipion_wrap = doc.getElementById('precipion');
		wd_summary	= doc.getElementById("details");
		detailsHeader = doc.getElementById("detailsHeader");
		details		= doc.getElementById("weatherdetails");
		gd			= doc.getElementById("gps");
		beaufort	= doc.getElementById("beaufort");
		infoModal	= doc.getElementById("modal");
		icon		= doc.getElementById("icon");

		cloudlayer	= doc.getElementById("cloudlayer");
		rainlayer	= doc.getElementById("rainlayer");
		rainwindow	= doc.getElementById("rainwindow");
		snowlayer	= doc.getElementById("snowlayer");
		sunlayer	= doc.getElementById("sunlayer");
		clearnightlayer = doc.getElementById("clearnightlayer");
		shootinglayer	= doc.getElementById("shooting");
		moonlayer	=doc.getElementById("moonOrbit");
		mistlayer	= doc.getElementById("mistlayer");
		gpsbutton	= doc.getElementById("gpsbutton");
		gpsbutton.addEventListener("click",getLocation,false);
		weatherminute = randRange(0,14);
		getLocation();
		updateTime();
		wd_core();
		setInterval(updateTime,1000);
	}

	function wd_core() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing wd_core');
		}
		var wd_byLine, devState, devHost, devCheck, core_svgPfx, core_titlePfx, core_titleSfx, core_usePfx, core_useSfx;
			devState	= 1;
			devHost		= 'varoystrand.se';
			devCheck	= ( devState == 1 || location.hostname == devHost );
			wd_byLine	= "By Baldurs Photography";
			core_svgPfx = svgPfx;
			core_titlePfx = titlePfx;
			core_titleSfx = titleSfx;
			core_usePfx = usePfx;
			core_useSfx = useSfx;

		doc.title	= appName + " " + wd_byLine;

		/*var offlineMode = function() {
			var DEVCONSOLE, notification, notificationIcon;
			DEVCONSOLE = location.hostname == 'oxygen.local';
			notification = doc.getElementById("offlineNotification");

			if('serviceWorker' in navigator) {
				window.addEventListener('load', function() {
					navigator.serviceWorker.register('sw-weather.min.js')
					.then(function(registration) {
						if (DEVCONSOLE && _cslFlag == false) console.log("[register] Service Worker registration successful", registration);
					}, function(err) {
						if (DEVCONSOLE && _cslFlag == false) console.log("[register] Registration failed", registration)
					})
				})

				// Listen for claiming of our ServiceWorker
				navigator.serviceWorker.addEventListener('controllerchange', function(event) {
					if (DEVCONSOLE && _cslFlag == false) console.log('[controllerchange] A "controllerchange" event has happened within navigator.serviceWorker: ', event);

					// Listen for changes in the state of our ServiceWorker
					navigator.serviceWorker.controller.addEventListener('statechange', function() {
						if (DEVCONSOLE && _cslFlag == false) console.log('[controllerchange][statechange] A "statechange" has occured: ', this.state);

						// If the ServiceWorker becomes "activated", let the user know they can go offline!
						if (this.state === 'activated') {
							if (DEVCONSOLE && _cslFlag == false) console.log('[controllerchange][statechange][activated] WHS is ready to go offline');
							// Show the "You may now use offline" notification
							notification.classList.add('ready');
							notificationIcon = core_svgPfx + core_titlePfx + 'WHS is ready to go offline' + core_titleSfx + core_usePfx + 'serviceworker' + core_useSfx;
							notification.innerHTML = notificationIcon + notificationTxt;
						}
					});
				});
				if(navigator.serviceWorker.controller) { navigator.serviceWorker.controller.postMessage({'command': 'trimCache'}); }
			};
		}*/

		var toGitHub = function() {
			var dayState, stateClr, BUILD_ELEMENTS, bundle, buildlink, wd_windowOpen, wd_rel, forkmewrapp, wd_forkTitle, wd_forkStyle, wd_buildurl, wd_buildIcon, wd_forkmeIcon;

			BUILD_ELEMENTS	= '#buildlink';
			buildlink		= doc.getElementById("buildlink");
			forkmewrapp		= doc.getElementById("ribbonwrapp");
			bundle			= doc.querySelectorAll( BUILD_ELEMENTS );

			dayState		= isDark ? 'Night' : 'Day';
			stateClr		= isDark ? '#000' : 'var(--db)';
			/*if ( isDark = true ) {
				stateClr = '#000'
			} else {
				stateClr = '#ffe95c'
			};*/

			wd_buildurl		= "//github.com/BlackSkorpio/Home-Weather-Station";
			wd_windowOpen	= "window.open(this.href);return false;";
			wd_rel			= "nofollow";
			wd_forkTitle	= titlePfx + "Fork " + appName + " on GitHub" + titleSfx;
			wd_forkStyle	= "<style>#f_s1{--stateClr:"+stateClr+"}</style>";

			wd_buildIcon	= useLogosmall;
			wd_forkmeIcon	= svgPfx + wd_forkTitle + wd_forkStyle + usePfx + "ribbon" + useSfx;

			bundle.forEach(function(elements) {
				return elements.setAttribute('href', wd_buildurl),
					elements.setAttribute('onclick', wd_windowOpen),
					elements.setAttribute('rel', wd_rel);
			});

			buildlink.setAttribute('title', appName + ' ' + appVersion);
			buildlink.innerHTML = wd_buildIcon;

			forkmewrapp.innerHTML = wd_forkmeIcon;

			if (devCheck !=1) forkmewrapp.remove();
			if (DEVCONSOLE) {
				_csl.groupCollapsed(_cslHeadOpen+'wd_core => toGitHub'+_cslHeadDiv, _cslHeadFont );
				_csl.debug(
					'RunOnce: '+_cslFlag +_cslLB+
					'dayState: ' + dayState +_cslLB+
					'stateClr: ' + stateClr
					+ _cslFooter
				);
				_csl.groupEnd();
				_csl.trace('Tracing toGitHub');
			}
		}

		toGitHub();
		//offlineMode();
	}

	function updateTime() {
		//(DEVCONSOLE) _csl.trace('Tracing updateTime');
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
		//if (DEVCONSOLE) _csl.trace('Tracing getClockStrings');
		now = new Date();
		//now = new Date(now.getTime() + 1000); // for testing fixed dates
		var year = now.getFullYear();
		var month = months[now.getMonth()];
		var date = now.getDate();
		var day = days[now.getDay()];
		var hour = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		var timeWrap, wrapHour, wrapMin, wrapSec, wrapClose, timeDiv;
			timeWrap	= '<span class="liveTime">';
			wrapHour	= '<span class="hours">';
			timeDiv		= '<span class="timeDiv">:</span>';
			wrapMin		= '<span class="minutes">';
			wrapSec		= '<span class="seconds">';
			wrapClose	= spanSfx;
		var clockminutes = minutes < 10 ? "0" + minutes : minutes;
		var clockseconds = seconds < 10 ? "0" + seconds : seconds;
		if ( unitsFormat == "metric" ) {
			var clockhour = hour < 10 ? "0" + hour : hour;
			var datehtml = day + " " + date + " " + month;
			var timehtml = timeWrap;
				timehtml += wrapHour;
				timehtml += clockhour;
				timehtml += wrapClose;
				timehtml += timeDiv;
				timehtml += wrapMin;
				timehtml += clockminutes;
				timehtml += wrapClose;
				timehtml += wrapSec;
				timehtml += clockseconds;
				timehtml += wrapClose;
				timehtml += wrapClose;
		} else {
			var meridian = hour < 12 ? "AM" : "PM";
			var clockhour = hour > 12 ? hour - 12 : hour;
			if ( hour === 0) {
				clockhour = 12;
			}
			var datehtml = day + ", " + month + " " + date;
			var timehtml = timeWrap;
				timehtml += wrapHour;
				timehtml += clockhour;
				timehtml += wrapClose;
				timehtml += timeDiv;
				timehtml += wrapMin;
				timehtml += clockminutes;
				timehtml += wrapClose;
				timehtml += wrapSec;
				timehtml += clockseconds + " " + meridian;
				timehtml += wrapClose;
				timehtml += wrapClose;
		}
		return {"datehtml":datehtml,"timehtml":timehtml};
	}

	function getLocation() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing getLocation');
		}
		if (useip) {
			getIPLocation();
		} else {
			getGPSLocation();
		}
	}

	function getGPSLocation() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing getGPSLocation');
		}
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(gpsPosition,geoError);
		} else {
			gd.innerHTML = locErrorTxt;
			locationRequested = false;
		}
	}

	function getIPLocation() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing getIPLocation');
		}
		var xhttp = new XMLHttpRequest();
		var country;
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
							//gd.innerHTML = "<span id='city'>" + city + ",</span><span id='region'> " + region + "</span><span id='country'> (" + country + ")</span>";
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
		if (DEVCONSOLE) {
			_csl.trace('Tracing geoError');
		}
		gd.innerHTML = locErrorTxt;
	}

	function gpsPosition(json) {
		if (DEVCONSOLE) {
			_csl.trace('Tracing gpsPosition');
		}
		gpsbutton.style.display = "none";
		lat = json.coords.latitude;
		lon = json.coords.longitude;
		gd.innerHTML = city + " (" + lat.toFixed(2) + " | " + lon.toFixed(2) + ")";
		showPosition();
	}

	function showPosition() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing showPosition');
		}
		var location = "lat=" + lat + "&lon=" + lon;
			// For Testing
			// Los Angeles, CR
			//var location = "lat=10.4907&lon=-85.0224";
			// Dubai, SO
			//var location = "lat=2.8017&lon=44.0816";
			// Jockmock, SE
			//var location = "lat=66.6069609&lon=19.8229206";

			// For Testing Warm(est) place on earth?
			// Ahvaz, IR
			//var location = "lat=31.323&lon=48.6793";
			// Tirat Tsvi, IL
			//var location = "lat=32.4219&lon=35.528";
			// Araouane, ML
			//var location = "lat=18.9041&lon=-3.5276";
			// Timbuktu, ML
			//var location = "lat=16.7719&lon=-3.0088";
			// Kebili, TN
			//var location = "lat=33.7044&lon=8.969";
			// Ghadames, DZ
			//var location = "lat=30.1258&lon=9.4901";

			// For Testing Cold(est) place on earth?
			// Prospect, CA
			//var location = "lat=44.4715&lon=-63.79";
			// Ust-Nera, RU
			//var location = "lat=64.5664&lon=143.2378";
			// Yakutsk, RU
			//var location = "lat=62.0273&lon=129.7321";
			// Verkhoyansk, RU
			//var location = "lat=67.5527&lon=133.3912";
			// Oymyakon, RU
			//var location = "lat=63.4629&lon=142.787";
			// Oymyakon, RU
			//var location = "lat=63.4629&lon=142.787";

		if ( usephp ) {
			weatherurl = "weather.php?" + location + "&lang=" + langCode + "&units=" + unitsFormat;
		} else {
			weatherurl = "https://api.openweathermap.org/data/2.5/weather?";
			weatherurl += location + "&lang=" + langCode + "&units=" + unitsFormat + "&APPID=" + appID;
			//for the APPID, please substitute your own API Key you can get for free from openweathermap.org
		}
		if (!locationRequested) {
			//gets the weather when the page first loads and GPS coordinates are obtained
			getWeather();
			locationRequested = true;
		}
	}

	function getWeather() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing getWeather');
		}
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
		var minTemp, maxTemp, minMaxTemp, hitempdata, lowtempdata, minmaxline;
		// NOTE SunCalc
		//var SunCalc;
		/*
		var SunCalcNow = new Date();
		var SunCalLat = lat.toFixed(2);
		var SunCalLon = lon.toFixed(2);

		var getMoonTimes = SunCalc.getMoonTimes( SunCalcNow, SunCalLat, SunCalLon);
		//Object.keys(getMoonTimes).forEach(function(key) {
		//	if (DEVCONSOLE && _cslFlag == false) console.log(key + ': ' + getMoonTimes[key]);
		//});
		var getSunTimes = SunCalc.getTimes( SunCalcNow, SunCalLat, SunCalLon);
		//Object.keys(getSunTimes).forEach(function(key) {
		//	if (DEVCONSOLE && _cslFlag == false) console.log(key + ': ' + getSunTimes[key]);
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


		/*if (!useip){
			city = data.name;
			region = "";
			gd.innerHTML = textSpanPrefix + city + " (" + lat.toFixed(2) + " | " + lon.toFixed(2) + ")" + spanSuffix;
		}*/
		city = data.name;
		var country = data.sys.country;
		//gd.innerHTML = "<span id='city'>" + city + ",</span><span id='country'> (" + country + ")</span>";
		// var dh = JSON.stringify(data);
		// dh = dh.split(",").join("<br>");

		// NOTE Convert hPA to kPa for display in gauge
		var hPaData = data.main.pressure;
		var kPaOut = hPaData/10;
		//var hPaOut = hPaData.substring(0, 3);
		//var hPaOut = hPaData.match(/.{1,3}/g);
		//var kPaOut = hPaOut.join(".");

		// NOTE Convert the visibility data to metric or imperial
		var km = data.visibility / 1000;
		var miles = data.visibility * 0.0006213712;
		switch ( unitsFormat ) {
			case "metric":
				visibleLength = km.toFixed(1);
				localtemperature = +data["main"].temp.toFixed(1);
				minTemp = +data.main.temp_min.toFixed(1);
				maxTemp = +data.main.temp_max.toFixed(1);
			break;
			case "imperial":
				visibleLength = miles.toFixed(2);
				localtemperature = +data["main"].temp.toFixed(2);
				minTemp = +data.main.temp_min.toFixed(2);
				maxTemp = +data.main.temp_max.toFixed(2);
			break;
			default:
				visibleLength = data.visibility;
				localtemperature = data["main"].temp;
				minTemp = data.main.temp_min;
				maxTemp = data.main.temp_max;
		};
		// NOTE Check that minTemp and maxTemp is not empty and is not equal
		var minMaxTemp = ( ( minTemp !=null || maxTemp !=null ) && maxTemp != minTemp );

		// NOTE Calculate sun position
		/*https://stackoverflow.com/a/18358056/6820262*/
		var sunUpRaw, sunDownRaw, sunNowRaw, sunUpHour, sunUpMin, sunUpMinute, sunNowHour, sunNowMin, sunNowMinute, sunDownHour, sunDownMin, sunDownMinute, sunUp, sunNow, sunDown, sunLeft, sunHours, sunLeftCalc, sunPos, sunPosition, moonHours;
		var sunUpRaw	= new Date(data.sys.sunrise * 1000);
		var sunNowRaw	= new Date();
		var sunDownRaw	= new Date(data.sys.sunset * 1000);
		var sunUpHour	= sunUpRaw.getHours();
		var sunNowHour	= sunNowRaw.getHours();
		var sunDownHour	= sunDownRaw.getHours();
		var sunUpMin	= sunUpRaw.getMinutes();
		var sunUpMinute = sunUpMin < 10 ? "0" + sunUpMin   : sunUpMin;
		var sunNowMin	= sunNowRaw.getMinutes();
		var sunNowMinute = sunNowMin < 10 ? "0" + sunNowMin  : sunNowMin;
		var sunDownMin	= sunDownRaw.getMinutes();
		var sunDownMinute = sunDownMin < 10 ? "0" + sunDownMin : sunDownMin;

		var sunUp		= sunUpHour + '.' + sunUpMinute;	// A
		var sunNow		= sunNowHour + '.' + sunNowMinute;	// B
		//var sunNow		= 08.05; // For testing
		var sunDown		= sunDownHour + '.' + sunDownMinute;// C
		var sunLeft		= sunDown - sunNow;	// X = C - B
		var sunHours	= sunDown - sunUp;	// Y = C - A
		//* Z = X / Y * 100
		var sunPos	= sunLeft.toFixed(2) / sunHours.toFixed(2) * 100;
		var sunPosition = sunPos > 100.00 ? 99.99 : sunPos;
		//var sunPlacement = 'right ' + roundToTwo(sunPosition);
		//sunPosition = sunPlacement.toFixed(2);
		var moonHours = (24 - sunHours) * 60;
		var moonBrightnes = 100 - Number(data.clouds.all);
		var isDay = sunLeft >=0;

		wd_beaufort(data);
		wd_tempScale(data,tempClr);
		//checkForSunset();
		var rainyWindow			= isDay ? 'day' : 'night';
		var overCastLayer		= isDay ? "overcastDay" : "overcastNight";
		var svgStyle = ':root{';
			//svgStyle += '--hPa:' + kPaOut.trim() +'deg;';
			svgStyle += '--hPa:' + kPaOut + 'deg;';
			svgStyle += '--windeg:' + data.wind.deg + 'deg;';
			svgStyle += '--sunPosition:' + sunPosition.toFixed(2) + '%;';
			svgStyle += '--window:url("../img/window-' + rainyWindow + '.jpg");';
			svgStyle += '--moontime:' + moonHours + 's;';
			svgStyle += '--tempClr:' + tempClr + ';';
			svgStyle += '--bftclr:var(--bf' + bfSvgId + ');';
			svgStyle += '--bftSpeed:' + ws_bft + 's;';
			svgStyle += '--windspeed-s:' + ws_s + 's;';
			svgStyle += '--windspeed-m:' + ws_m + 's;';
			svgStyle += '--windspeed-f:' + ws_f + 's;';
			//svgStyle += '--moonBright:'+ 'calc(100% - ' + data.clouds.all + '%);'
			svgStyle += '--moonBright:'+ moonBrightnes + '%;'
			svgStyle += '}';
		sStyles.innerHTML = svgStyle;

		detailsHeader.innerHTML = detailsTxt;

		/*var hilowline = liPfx + idPfx + 'wd_hilowtemp' + PfxEnd;
			hilowline += spanTxt;
			hilowline += "Hourly Max | Min: ";
			hilowline += maxTemp + tempForm;
			hilowline += dataDiv;
			hilowline += minTemp + tempForm;
			hilowline += spanSfx;*/

		var hitempdata = liPfx + idPfx + 'wd_hightemp' + PfxEnd;
			hitempdata += useTemprature;
			hitempdata += spanTxt;
			hitempdata += maxTemp;
			hitempdata += tempForm;
			hitempdata += spanSfx;
		var lowtempdata = liPfx + idPfx + 'wd_lowtemp' + PfxEnd;
			lowtempdata += useTemprature;
			lowtempdata += spanTxt;
			lowtempdata += minTemp;
			lowtempdata += tempForm;
			lowtempdata += spanSfx;
		var minmaxline = hitempdata + lowtempdata;

		var gpsline = liPfx + idPfx + 'wd_location' + PfxEnd;
			gpsline += useLocation;
			gpsline += '<span id="city">';
			gpsline += city;
			gpsline += spanSfx;
			gpsline += '<span id="country">, (';
			gpsline += country;
			gpsline += ') ';
			gpsline += spanSfx;
			gpsline += spanPfx;
			gpsline += '<a href="https://openweathermap.org/city/';
			gpsline += data.id;
			gpsline += '" title="">';
			gpsline += lat.toFixed(2);
			gpsline += dataDiv;
			gpsline += lon.toFixed(2);
			gpsline += '</a>';
			gpsline += spanSfx;

		var pressureline = liPfx + idPfx + 'wd_pressure' + PfxEnd;
			pressureline += usePressure;
			pressureline += spanTxt;
			pressureline += data.main.pressure;
			pressureline += pressureForm;
			pressureline += spanSfx;

		var humidityline = liPfx + idPfx + 'wd_humidity' + PfxEnd;
			humidityline += useHumidity;
			humidityline += spanTxt;
			humidityline += data.main.humidity;
			humidityline += humidityForm;
			humidityline += spanSfx;

		var windline = liPfx + idPfx + 'wd_wind' + PfxEnd;
			windline += useWindspeed;
			windline += spanTxt;
			windline += data.wind.speed;
			windline += windSpeed;
			windline += spanSfx;

		var windirdata = spanTxt;
			if ( data.wind.deg !=null ) {
				windirdata += data.wind.deg.toFixed(0);
				windirdata += "° ";
				windirdata += getWindDirection(data.wind.deg);
			} else {
				windirdata += "No data";
			}
			windirdata += spanSfx;
		var windirection = liPfx + idPfx + 'wd_windir' + PfxEnd;
			windirection += useWindRose;
			windirection += windirdata;

		var sunriseline = liPfx + idPfx + 'wd_sunrise' + PfxEnd;
			sunriseline += useSunRise;
			sunriseline += spanTxt;
			sunriseline += new Date(data.sys.sunrise * 1000).toLocaleTimeString(timeForm);
			sunriseline += spanSfx;

		var sunsetline = liPfx + idPfx + 'wd_sunset' + PfxEnd;
			sunsetline += useSunSet;
			sunsetline += spanTxt;
			sunsetline += new Date(data.sys.sunset * 1000).toLocaleTimeString(timeForm);
			sunsetline += spanSfx;

		var visibilityline = liPfx + idPfx + 'wd_visibility' + PfxEnd;
			visibilityline += useVisibility;
			visibilityline += spanTxt;
			visibilityline += data.visibility !=null ? visibleLength + visibilityForm : "No data";
			//visibilityline += data.visibility !=null ? visibilityForm : "";
			visibilityline += spanSfx;

		var overcastline = liPfx + idPfx + 'wd_clouds' + PfxEnd;
			overcastline += useOvercast + overCastLayer + useSfx;
			overcastline += spanTxt;
			overcastline += data.clouds.all;
			overcastline += overcastForm;
			overcastline += spanSfx;

		details.innerHTML = visibilityline + overcastline + windline + windirection + pressureline + humidityline + sunriseline + sunsetline + gpsline;
		if ( minMaxTemp ) details.innerHTML += minmaxline;

		var weather = data["weather"][0];

		icon.className = "weather i-" + weather.icon;
		icon.style.opacity = 1;
		icon.innerHTML = svgPfx + usePfx + weather.icon + useSfx;
		//var localtemperature = data["main"].temp.toFixed(1);
		var weatherstring = useTemprature;
			weatherstring += spanTxt;
			weatherstring += localtemperature;
			weatherstring += tempForm;
			weatherstring += spanSfx;
			weatherstring += spanTxt;
			weatherstring += weather.description;
			weatherstring += spanSfx;

		wd.innerHTML = weatherstring;

		wd_precipion(data);
		setLayers();
		wd_modal(data);
		wd_visible();
		wd_updatedTime(data);
		// NOTE Update the update time every 30 sek (https://stackoverflow.com/a/13304567/6820262)
		/*var updatedInterval = setInterval(function() {
			wd_updatedTime(data);
		}, 30 * 1000);*/
		if (DEVCONSOLE) {
			_csl.group(_cslHeadOpen+'processWeather'+_cslHeadDiv, _cslHeadFont );
			_csl.debug(
				'RunOnce: '+_cslFlag +_cslLB+
				'Weather id: ' + weather.id +_cslLB+
				'Visibility: ' + data.visibility +_cslLB+_cslLB+
				'TempRaw: ' + data["main"].temp +_cslLB+
				'TempRaw fixed: ' + +data["main"].temp.toFixed(1) +_cslLB+
				'localtemperature: ' + localtemperature +_cslLB+
				'TempMin: ' + minTemp +_cslLB+
				'TempMax: ' + maxTemp +_cslLB+_cslLB+
				'sunUpRaw: ' + sunUpRaw +_cslLB+
				'sunNowRaw: ' + sunNowRaw +_cslLB+
				'sunDownRaw: ' + sunDownRaw +_cslLB+_cslLB+
				'sunUp: ' + sunUp +_cslLB+
				'sunNow: ' + sunNow +_cslLB+
				'sunDown: ' + sunDown +_cslLB+_cslLB+
				'sunLeft: ' + sunDown + ' - ' + sunNow + ' = ' + sunLeft.toFixed(2) +_cslLB+
				'sunHours: ' + sunDown + ' - ' + sunUp + ' = ' + sunHours.toFixed(2) +_cslLB+
				'sunPosition: ' + sunLeft.toFixed(2) + ' / ' + sunHours.toFixed(2) + ' * 100 = ' + sunPosition.toFixed(2) +_cslLB+
				'moonHours: ' + '(24 - ' + sunHours +')  * 60 = ' + moonHours +_cslLB+_cslLB+
				'isDay: ' + isDay
				+ _cslFooter
			);
			_csl.groupEnd();
			//_csl.trace('Tracing processWeather');
		}
	}

	function wd_precipion(data) {
		if (DEVCONSOLE) _csl.trace('Tracing wd_precipion');
		var rain = data.rain;
			snow = data.snow;
			var rain1, snow1, rain3, snow3, rainFall, snowFall, precipionSvg, rainData, snowData, precipionTime;

		// NOTE check if we have some rain data
		if ( rain !=null ) {
			rain1 = rain['1h'], rain3 = rain['3h'];
			if (rain1 !=null) rainFall = rain1, precipionTime = precipion1Txt;
			if (rain3 !=null) rainFall = rain3, precipionTime = precipion3Txt;

			precipionSvg = svgPfx + titlePfx + precipionTxt + titleSfx + usePfx + 'precipion_';

			rainData = precipionSvg;
				rainData += 'rain';
				rainData += useSfx;
				rainData += spanTxt;
				rainData += rainFall.toFixed(1)+"mm ";
				rainData += precipionTime;
				rainData += spanSfx;
		}
		// NOTE check if we have some snow data
		if ( snow !=null ) {
			snow1 = snow['1h'], snow3 = snow['3h'];
			if (snow1 !=null) snowFall = snow1, precipionTime = precipion1Txt;
			if (snow3 !=null) snowFall = snow3, precipionTime = precipion3Txt;

			snowData = precipionSvg;
				snowData += 'snow';
				snowData += useSfx;
				snowData += spanTxt;
				snowData += snowFall.toFixed(1)+"mm ";
				snowData += precipionTime;
				snowData += spanSfx;
		}

		if ( rain !=null ) precipion_wrap.innerHTML = rainData;
		if ( snow !=null ) precipion_wrap.innerHTML = snowData;

		if (DEVCONSOLE) {
			_csl.groupCollapsed(_cslHeadOpen+'wd_precipion'+_cslHeadDiv, _cslHeadFont );
			_csl.debug(
				'Rain: '+ rain +_cslLB+
				'  Rain1: '+ rain1 +_cslLB+
				'  Rain3: '+ rain3 +_cslLB+
				'Snow: '+ rain +_cslLB+
				'  Snow1: '+ snow1 +_cslLB+
				'  Snow3: '+ snow3 +_cslLB
				+ _cslFooter
			);
			_csl.groupEnd();
		}
	}

	function wd_beaufort(data) {
		// NOTE Convert m/s to beaufort scale
		// Skalan kan beräknas med formeln V = k · B3/2, där k = 0,8365, B = Beauforttalet, och V = vindhastighet i m/s
		// 2.9 = 0.8365 * 3/2
		var wd_windspeed = data.wind.speed.toFixed(2);
		switch ( unitsFormat ) {
			case "metric":
				wd_ws = wd_windspeed;
				break;
			case "imperial":
				wd_ws = wd_windspeed *  0.44704;
				break;
			default:
				wd_ws = wd_windspeed;
		}
		if ( wd_ws >=     0 && wd_ws <=  0.29 ) {
			wd_bf =  0;
			wd_bfTxt = bfs21Txt + wd_LB + bfs00Txt;
		}
		if ( wd_ws >=  0.30 && wd_ws <=  1.59 ) {
			wd_bf =  1;
			wd_bfTxt = bfs01Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  1.60 && wd_ws <=  3.33 ) {
			wd_bf =  2;
			wd_bfTxt = bfs02Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  3.40 && wd_ws <=  5.49 ) {
			wd_bf =  3;
			wd_bfTxt = bfs03Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  5.50 && wd_ws <=  7.99 ) {
			wd_bf =  4;
			wd_bfTxt = bfs04Txt + wd_LB + bfs21Txt;
		}
		if ( wd_ws >=  8.00 && wd_ws <= 10.79 ) {
			wd_bf =  5;
			wd_bfTxt = bfs05Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 10.80 && wd_ws <= 13.89 ) {
			wd_bf =  6;
			wd_bfTxt = bfs06Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 13.90 && wd_ws <= 17.19 ) {
			wd_bf =  7;
			wd_bfTxt = bfs07Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 17.20 && wd_ws <= 20.79 ) {
			wd_bf =  8;
			wd_bfTxt = bfs08Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 20.80 && wd_ws <= 24.49 ) {
			wd_bf =  9;
			wd_bfTxt = bfs09Txt + wd_LB + bfs23Txt;
		}
		if ( wd_ws >= 24.50 && wd_ws <= 28.49 ) {
			wd_bf = 10;
			wd_bfTxt = bfs10Txt + wd_LB + bfs24Txt;
		}
		if ( wd_ws >= 28.50 && wd_ws <= 32.69 ) {
			wd_bf = 11;
			wd_bfTxt = bfs11Txt + wd_LB + bfs25Txt;
		}
		if ( wd_ws >= 32.70 && wd_ws <= 36.99 ) {
			wd_bf = 12;
			wd_bfTxt = bfs12Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 37.00 && wd_ws <= 41.49 ) {
			wd_bf = 13;
			wd_bfTxt = bfs13Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 41.50 && wd_ws <= 46.19 ) {
			wd_bf = 14;
			wd_bfTxt = bfs14Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 46.20 && wd_ws <= 50.99 ) {
			wd_bf = 15;
			wd_bfTxt = bfs15Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 51.00 && wd_ws <= 56.09 ) {
			wd_bf = 16;
			wd_bfTxt = bfs16Txt + wd_LB + bfs26Txt;
		}
		if ( wd_ws >= 56.10 && wd_ws <= 61.20 ) {
			wd_bf = 17;
			wd_bfTxt = bfs17Txt + wd_LB + bfs26Txt;
		}

		if ( wd_bf >=    0 && wd_bf <=    2 ) bfSvgId = 0, ws_s = 75, ws_m = 55, ws_f = 35, ws_bft = 10;
		if ( wd_bf >=    3 && wd_bf <=    4 ) bfSvgId = 1, ws_s = 65, ws_m = 45, ws_f = 35, ws_bft =  5;
		if ( wd_bf >=    5 && wd_bf <=    6 ) bfSvgId = 2, ws_s = 60, ws_m = 40, ws_f = 30, ws_bft =  4;
		if ( wd_bf >=    7 && wd_bf <=    8 ) bfSvgId = 3, ws_s = 55, ws_m = 35, ws_f = 25, ws_bft =  3;
		if ( wd_bf >=    9 && wd_bf <=   10 ) bfSvgId = 4, ws_s = 45, ws_m = 25, ws_f = 15, ws_bft =  2;
		if ( wd_bf >=   11 && wd_bf <=   17 ) bfSvgId = 5, ws_s = 35, ws_m = 15, ws_f =  5, ws_bft =  1;

		//if ( wd_bf >=  0 && wd_bf <= 5 ) wd_flag = 0;
		if ( wd_ws >= 10.80 && wd_ws <= 17.19 ) wd_stormFlag = 'gale1';
		if ( wd_ws >= 17.20 && wd_ws <= 24.49 ) wd_stormFlag = 'gale2';
		if ( wd_ws >= 24.50 && wd_ws <= 32.69 ) wd_stormFlag = 'storm1';
		if ( wd_ws >= 32.70 && wd_ws <= 61.20 ) wd_stormFlag = 'storm2';
		if ( wd_ws >= 10.80 && wd_ws <= 61.20 ) {
			var wd_galeTitle = galeTxt;
			var galeSVG = svgPfx;
				galeSVG += titlePfx;
				galeSVG += wd_galeTitle;
				galeSVG += titleSfx;
				galeSVG += usePfx + wd_stormFlag;
				galeSVG += useSfx;
		} else {
			galeSVG = "";
		}

		var wd_beaufortTitle = bfsHeadTxt + wd_bf + beaufortForm + wd_LB + wd_bfTxt;
		var beaufortSVG = svgPfx;
			beaufortSVG += titlePfx;
			beaufortSVG += wd_beaufortTitle;
			beaufortSVG += titleSfx;
			beaufortSVG += usePfx + "bf0";
			beaufortSVG += useSfx;

		beaufort.className = "windspeed i-" + wd_bf + "bf";
		beaufort.innerHTML = beaufortSVG + galeSVG;

		if (DEVCONSOLE) {
			_csl.groupCollapsed(_cslHeadOpen+'wd_beaufort'+_cslHeadDiv, _cslHeadFont );
			_csl.debug(
				'RunOnce: '+_cslFlag +_cslLB+
				'wd_ws: ' + wd_ws +_cslLB+
				'wd_bf: ' + wd_bf +_cslLB+
				'bfSvgId: ' + bfSvgId +_cslLB+
				'ws_s: ' + ws_s +_cslLB+
				'ws_m: ' + ws_m +_cslLB+
				'ws_f: ' + ws_f +_cslLB+
				'ws_bft: ' + ws_bft
				+ _cslFooter
			);
			_csl.groupEnd();
			_csl.trace('Tracing wd_beaufort');
		}
	}

	function wd_modal(data) {
		if (DEVCONSOLE) {
			_csl.trace('Tracing wd_modal');
		}
		// Modal https://codepen.io/chriscoyier/pen/MeJWoM
		// And https://codepen.io/noahblon/pen/yJpXka
		var modal, modalOverlay, buttonClose, classClosed, aHidden, tabindex, FOCUSABLE_SELECTORS, modalTitle, modalDescription, modalBeaufort, modalWspeed, modalWdirection, modalPressure, modalHumidity, modalCloudiness, modalVisibility, modalSunrise, modalSunset, modalLocation, modalMoonrise, modalMonnset, modalMorningold, modalEveningold, modalBuiltBy;

		var modal				= doc.querySelector("#modal");
		var modalOverlay		= doc.querySelector("#modal-overlay");
		var buttonClose			= doc.querySelector("#close-button");
		var buttonOpen			= doc.querySelector("#open-button");
		var classClosed  		= "closed";
		var aHidden				= 'aria-hidden';
		var tabindex			= 'tabindex';
		var FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

		var modalTitle			= doc.getElementById("Modal_Title");
		var modalDescription	= doc.getElementById("Modal_Description");
		var modalBeaufort		= doc.getElementById("dt_bft");
		var modalWspeed			= doc.getElementById("dt_windspeed");
		var modalWdirection		= doc.getElementById("dt_windirection");
		var modalPressure		= doc.getElementById("dt_pressure");
		var modalHumidity		= doc.getElementById("dt_humidity");
		var modalVisibility		= doc.getElementById("dt_visibility");
		var modalCloudiness		= doc.getElementById("dt_cloudiness");
		var modalSunrise		= doc.getElementById("dt_sunrise");
		var modalSunset			= doc.getElementById("dt_sunset");
		var modalLocation		= doc.getElementById("dt_location");
		var modalMoonrise		= doc.getElementById("dt_moonrise");
		var modalMonnset		= doc.getElementById("dt_moonset");
		var modalMorningold		= doc.getElementById("dt_morningold");
		var modalEveningold		= doc.getElementById("dt_eveningold");
		var modalBuiltBy		= doc.getElementById("dt_builtby");

		var modalBeaufortTxt	= sumPfx;
			modalBeaufortTxt	+= useBeaufort + bfsTxt;
			modalBeaufortTxt	+= sumSfx;
			modalBeaufortTxt	+= spanPfx;
			modalBeaufortTxt	+= bftDesc;
			modalBeaufortTxt	+= spanSfx;
		var modalWspeedTxt		= sumPfx;
			modalWspeedTxt		+= useWindspeed + windTxt;
			modalWspeedTxt		+= sumSfx;
			modalWspeedTxt		+= spanPfx;
			modalWspeedTxt		+= windSpeedDesc;
			modalWspeedTxt		+= spanSfx;
		var modalWdirectionTxt	= sumPfx;
			modalWdirectionTxt	+= useWindRose + windDirTxt;
			modalWdirectionTxt	+= sumSfx;
			modalWdirectionTxt	+= spanPfx;
			modalWdirectionTxt	+= winddirDesc;
			modalWdirectionTxt	+= spanSfx;
		var modalPressureTxt	= sumPfx;
			modalPressureTxt	+= usePressure + pressureTxt;
			modalPressureTxt	+= sumSfx;
			modalPressureTxt	+= spanPfx;
			modalPressureTxt	+= pressureDesc;
			modalPressureTxt	+= spanSfx;
		var modalHumidityTxt	= sumPfx;
			modalHumidityTxt	+= useHumidity + humidityTxt;
			modalHumidityTxt	+= sumSfx;
			modalHumidityTxt	+= spanPfx;
			modalHumidityTxt	+= humidityDesc;
			modalHumidityTxt	+= spanSfx;
		var modalVisibilityTxt	= sumPfx;
			modalVisibilityTxt	+= useVisibility + visibilityTxt;
			modalVisibilityTxt	+= sumSfx;
			modalVisibilityTxt	+= spanPfx;
			modalVisibilityTxt	+= visibilityDesc;
			modalVisibilityTxt	+= spanSfx;
		var modalCloudinessTxt	= sumPfx;
			modalCloudinessTxt	+= useOvercast + "overcastDay" + useSfx + cloudinessTxt;
			modalCloudinessTxt	+= sumSfx;
			modalCloudinessTxt	+= spanPfx;
			modalCloudinessTxt	+= cloudinessDesc;
			modalCloudinessTxt	+= spanSfx;
		var modalSunriseTxt		= sumPfx;
			modalSunriseTxt		+= useSunRise + sunRiseTxt;
			modalSunriseTxt		+= sumSfx;
			modalSunriseTxt		+= spanPfx;
			modalSunriseTxt		+= sunriseDesc;
			modalSunriseTxt		+= spanSfx;
		var modalSunsetTxt		= sumPfx;
			modalSunsetTxt		+= useSunSet + sunSetTxt;
			modalSunsetTxt		+= sumSfx;
			modalSunsetTxt		+= spanPfx;
			modalSunsetTxt		+= sunsetDesc;
			modalSunsetTxt		+= spanSfx;
		var modalLocationTxt	= sumPfx;
			modalLocationTxt	+= useLocation + locationTxt;
			modalLocationTxt	+= sumSfx;
			modalLocationTxt	+= spanPfx;
			modalLocationTxt	+= locationDesc;
			modalLocationTxt	+= spanSfx;
		var modalMoonriseTxt	= sumPfx;
			modalMoonriseTxt	+= useMoonRise + moonRiseTxt;
			modalMoonriseTxt	+= sumSfx;
			modalMoonriseTxt	+= spanPfx;
			modalMoonriseTxt	+= moonriseDesc;
			modalMoonriseTxt	+= spanSfx;
		var modalMonnsetTxt		= sumPfx;
			modalMonnsetTxt		+= useMoonSet + moonSetsTxt;
			modalMonnsetTxt		+= sumSfx;
			modalMonnsetTxt		+= spanPfx;
			modalMonnsetTxt		+= moonsetDesc;
			modalMonnsetTxt		+= spanSfx;
		var modalMorningoldTxt	= sumPfx;
			modalMorningoldTxt	+= useGoldenHour + goldenTxt;
			modalMorningoldTxt	+= sumSfx;
			modalMorningoldTxt	+= spanPfx;
			modalMorningoldTxt	+= goldMorTxt;
			modalMorningoldTxt	+= spanSfx;
		var modalEveningoldTxt	= sumPfx;
			modalEveningoldTxt	+= useGoldenHour + goldenTxt;
			modalEveningoldTxt	+= sumSfx;
			modalEveningoldTxt	+= spanPfx;
			modalEveningoldTxt	+= goldEveTxt;
			modalEveningoldTxt	+= spanSfx;
		var modalBuiltByTxt		= sumPfx;
			modalBuiltByTxt		+= useLogosmall + appName;
			modalBuiltByTxt		+= sumSfx;
			modalBuiltByTxt		+= spanPfx;
			modalBuiltByTxt		+= weatherDescTxt;
			modalBuiltByTxt		+= spanSfx;

		modalTitle.innerHTML		= modalTitleTxt;
		modalDescription.innerHTML	= modalDescTxt;
		modalBeaufort.innerHTML		= modalBeaufortTxt;
		modalWspeed.innerHTML		= modalWspeedTxt;
		modalWdirection.innerHTML	= modalWdirectionTxt;
		modalPressure.innerHTML		= modalPressureTxt;
		modalHumidity.innerHTML		= modalHumidityTxt;
		modalVisibility.innerHTML	= modalVisibilityTxt;
		modalCloudiness.innerHTML	= modalCloudinessTxt;
		modalSunrise.innerHTML		= modalSunriseTxt;
		modalSunset.innerHTML		= modalSunsetTxt;
		modalLocation.innerHTML		= modalLocationTxt;
		modalMoonrise.innerHTML		= modalMoonriseTxt;
		modalMonnset.innerHTML		= modalMonnsetTxt;
		modalMorningold.innerHTML	= modalMorningoldTxt;
		modalEveningold.innerHTML	= modalEveningoldTxt;
		modalBuiltBy.innerHTML		= modalBuiltByTxt;
		buttonOpen.setAttribute('title', modalDescTxt);

		// show the modal
		var openModal = function() {
			// Focus the first element within the modal. Make sure the element is visible and doesnt have focus disabled (tabindex=-1);
			modal.querySelector(FOCUSABLE_SELECTORS).focus();
			modalOverlay.classList.remove(classClosed  );
			modal.classList.remove(classClosed  );
			// Trap the tab focus by disable tabbing on all elements outside of your modal.  Because the modal is a sibling of main, this is easier. Make sure to check if the element is visible, or already has a tabindex so you can restore it when you untrap.
			var focusableElements = main.querySelectorAll(FOCUSABLE_SELECTORS);
			focusableElements.forEach(function (el) {
				return el.setAttribute(tabindex, '-1');
			});
			// Trap the screen reader focus as well with aria roles. This is much easier as our main and modal elements are siblings, otherwise you'd have to set aria-hidden on every screen reader focusable element not in the modal.
			modal.removeAttribute(aHidden);
			main.setAttribute(aHidden, 'true');
		}
		// hide the modal
		var closeModal = function() {
			modalOverlay.classList.add(classClosed  );
			modal.classList.add(classClosed  );
			// Untrap the tab focus by removing tabindex=-1. You should restore previous values if an element had them.
			var focusableElements = main.querySelectorAll(FOCUSABLE_SELECTORS);
			focusableElements.forEach(function (el) {
				return el.removeAttribute(tabindex);
			});
			// Untrap screen reader focus
			modal.setAttribute(aHidden, 'true');
			main.removeAttribute(aHidden);
			// restore focus to the triggering element
			buttonOpen.focus();
		};

		buttonOpen.addEventListener("click", function() {
			openModal();
		});
		doc.addEventListener('keyup', function (evt) {
			if ( evt.keyCode === 27 && modal.classList.contains( classClosed  ) !== true ) closeModal();
		});
		// https://stackoverflow.com/a/52649135/6820262
		[modalOverlay, buttonClose].forEach(function(element) {
			element.addEventListener("click", function() {
				closeModal();
			});
		});
	}

	function wd_visible() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing setLayers');
		}
		var HIDDEN_ELEMENTS	= '#details, #beaufort, #open-button';
		var showElements	= main.querySelectorAll( HIDDEN_ELEMENTS );
		var classVisible	= "visible";
		var modal			= doc.querySelector("#modal");
		var HIDE_ELEMENTS	= '#dt_moonset, #dt_morningold, #dt_eveningold, #dt_moonrise';
		var hideElements	= modal.querySelectorAll( HIDE_ELEMENTS );
		var classHidden		= 'hidden';
		hideElements.forEach(function(elements) {
			return elements.classList.add( classHidden );
		});
		showElements.forEach(function(elements) {
			return elements.classList.add( classVisible );
		});
	}

	function wd_tempScale(data) {
		var tempNow, wd_temp, fromCelsius, fromFarenheit, fromKelvin;
		var tempNow			= Number(data.main.temp.toFixed(1));
		//var tempNow			= 55;
		var fromCelsius		= tempNow;
		var fromFarenheit	= (tempNow - 32) * 5/9;
		var fromKelvin		= tempNow - 273.15;
		switch ( unitsFormat ) {
			case "metric":
				wd_temp = fromCelsius;
				break;
			case "imperial":
				wd_temp = fromFarenheit;
				break;
			default:
				wd_temp = fromKelvin;
		}
		/*  40.1 -  50.0 */
		if ( wd_temp >=  40.1 ) tempClr = "rgb(43, 0, 1)";
		/*  30.1 -  40.0 */
		if ( wd_temp >=  30.1 && wd_temp <=  40.0 ) tempClr = "rgb(107,  21,  39)";
		/*  25.1 -  30.0 */
		if ( wd_temp >=  25.1 && wd_temp <=  30.0 ) tempClr = "rgb(195,  65, 114)";
		/*  20.1 -  25.0 */
		if ( wd_temp >=  20.1 && wd_temp <=  25.0 ) tempClr = "rgb(231, 121,  97)";
		/*  15.1 -  20.0 */
		if ( wd_temp >=  15.1 && wd_temp <=  20.0 ) tempClr = "rgb(236, 171,  77)";
		/*  10.1 -  15.0 */
		if ( wd_temp >=  10.1 && wd_temp <=  15.0 ) tempClr = "rgb(237, 218,  69)";
		/*   5.1 -  10.0 */
		if ( wd_temp >=   5.1 && wd_temp <=  10.0 ) tempClr = "rgb(195, 230,  77)";
		/*   5.0 -   0.0 */
		if ( wd_temp >=   0.0 && wd_temp <=   5.0 ) tempClr = "rgb( 89, 188, 160)";
		/*  -0.1 -  -5.0 */
		if ( wd_temp >=  -5.0 && wd_temp <=  -0.1 ) tempClr = "rgb( 77, 132, 203)";
		/*  -5.1 - -10.0 */
		if ( wd_temp >= -10.0 && wd_temp <=  -5.1 ) tempClr = "rgb( 99,  92, 183)";
		/* -10.1 - -15.0 */
		if ( wd_temp >= -15.0 && wd_temp <= -10.1 ) tempClr = "rgb( 54,  42, 118)";
		/* -15.1 - -20.0 */
		if ( wd_temp >= -20.0 && wd_temp <= -15.1 ) tempClr = "rgb(154,  29, 154)";
		/* -20.1 - -30.0 */
		if ( wd_temp >= -30.0 && wd_temp <= -20.1 ) tempClr = "rgb(255, 177, 255)";
		/* -30.1 - -40.0 */
		if ( wd_temp >= -40.0 && wd_temp <= -30.1 ) tempClr = "rgb(239, 239, 239)";
		/* -40.1 - -60.0 */
		if ( wd_temp <= -40.1 ) tempClr = "rgb(0, 8, 101)";
		if (DEVCONSOLE) {
			_csl.groupCollapsed(_cslHeadOpen+'wd_tempScale'+_cslHeadDiv, _cslHeadFont );
			_csl.debug(
				'RunOnce: '+_cslFlag +_cslLB+
				'tempNow: ' + tempNow +_cslLB+
				'Metric: ' + fromCelsius+'°C\n'+
				'Imperial: ' + fromFarenheit+'°F\n'+
				'Default: ' + fromKelvin+'°K\n'+
				'tempClr: ' + tempClr
				+ _cslFooter
			);
			_csl.groupEnd();
			_csl.trace('Tracing wd_tempScale');
		}
	}

	function wd_sunPosition(data) {
		// NOTE Calculate sun position
		var sunUpRaw, sunDownRaw, sunNowRaw, sunUpHour, sunUpMin, sunUpMinute,
			sunNowHour, sunNowMin, sunNowMinute, sunDownHour, sunDownMin,
			sunDownMinute, sunUp, sunNow, sunDown, sunLeft, sunHours,
			sunLeftCalc, sunPos, sunPosition, moonHours;

		var sunUpRaw	= new Date(data.sys.sunrise * 1000);
		var sunNowRaw	= new Date();
		var sunDownRaw	= new Date(data.sys.sunset * 1000);
		var sunUpHour	= sunUpRaw.getHours();
		var sunNowHour	= sunNowRaw.getHours();
		var sunDownHour	= sunDownRaw.getHours();
		var sunUpMin	= sunUpRaw.getMinutes();
		var sunUpMinute = sunUpMin < 10 ? "0" + sunUpMin   : sunUpMin;
		var sunNowMin	= sunNowRaw.getMinutes();
		var sunNowMinute = sunNowMin < 10 ? "0" + sunNowMin  : sunNowMin;
		var sunDownMin	= sunDownRaw.getMinutes();
		var sunDownMinute = sunDownMin < 10 ? "0" + sunDownMin : sunDownMin;

		var sunUp		= sunUpHour + '.' + sunUpMinute;	// A
		var sunNow		= sunNowHour + '.' + sunNowMinute;	// B
		//var sunNow		= 08.05; // For testing
		var sunDown		= sunDownHour + '.' + sunDownMinute;// C
		var sunLeft		= sunDown - sunNow;	// X = C - B
		var sunHours	= sunDown - sunUp;	// Y = C - A
		// Z = X / Y * 100
		var sunPos	= sunLeft.toFixed(2) / sunHours.toFixed(2) * 100;
		//var sunPosition = sunPos > 100.00 ? 99.99 : sunPos;
		//var sunPlacement = roundToTwo(sunPosition);
		var moonHours = (24 - sunHours) * 60;
		if (DEVCONSOLE) {
			_csl.groupCollapsed(_cslHeadOpen+'wd_sunPosition'+_cslHeadDiv, _cslHeadFont );
			_csl.debug(
				'RunOnce: '+_cslFlag +_cslLB+
				'sunUpRaw: '+sunUpRaw +_cslLB+
				'sunNowRaw: '+sunNowRaw +_cslLB+
				'sunDownRaw: '+sunDownRaw +_cslLB+
				'sunUp: '+sunUp +_cslLB+
				'sunNow: '+sunNow +_cslLB+
				'sunDown: '+sunDown +_cslLB+
				'sunLeft: '+sunDown+' - '+sunNow+' = '+roundToTwo(sunLeft) +_cslLB+
				'sunHours: '+sunDown+' - '+sunUp +' = '+roundToTwo(sunHours) +_cslLB+
				'sunPosition: '+roundToTwo(sunLeft)+' / '+roundToTwo(sunHours)+' * 100 = '+roundToTwo(sunPosition) +_cslLB+
				'moonHours: ' + '(24 - ' + sunHours +')  * 60 = ' + moonHours
				+ _cslFooter
			);
			_csl.groupEnd();
			_csl.trace('Tracing wd_sunPosition');
		}
	}

	function wd_updatedTime(data) {
		// function(globale) from: https://stackoverflow.com/a/50666409/6820262
		(function(global) {
			const SECOND	= 1;
			const MINUTE	= 60;
			const HOUR		= 3600;
			const DAY		= 86400;
			const MONTH		= 2629746;
			const YEAR		= 31556952;
			const DECADE	= 315569520;

			global.timeAgo = function(date){
				var now = new Date();
				var diff = Math.round(( now - date ) / 1000);

				var unit = '';
				var num = 0;
				var plural = false;
				var pluralTxt;

				switch(true){
					case diff <= 0:
						return updateNowTxt;
					break;
					case diff < MINUTE:
						num = Math.round(diff / SECOND);
						unit = updateSecTxt;
						plural = num > 1;
						pluralTxt = updatePluralTxt;
					break;
					case diff < HOUR:
						num = Math.round(diff / MINUTE);
						unit = updateMinTxt;
						plural = num > 1;
						pluralTxt = updatePluralTxt;
					break;
					case diff < DAY:
						num = Math.round(diff / HOUR);
						unit = updateHourTxt;
						plural = num > 1;
						pluralTxt = updatePlural2Txt;
					break;
					case diff < MONTH:
						num = Math.round(diff / DAY);
						unit = updateDayTxt;
						plural = num > 1;
						pluralTxt = updatePlural2Txt;
					break;
					case diff < YEAR:
						num = Math.round(diff / MONTH);
						unit = updateMonthTxt;
						plural = num > 1;
						pluralTxt = '';
					break;
					case diff < DECADE:
						num = Math.round(diff / YEAR);
						unit = updateYearTxt;
						plural = num > 1;
						pluralTxt = '';
					break;
					default:
						num = Math.round(diff / YEAR);
						unit = updateYearTxt;
						plural = num > 1;
						pluralTxt = '';
				}

				var str = '';
				if(num){
					str += num+' ';
				}

				str += unit;

				if(plural){
					str += pluralTxt;
					//str += updatePluralTxt;
				}

				str += updateAgoTxt;

				return str;
			}
		})(window);
		var dtTimeRaw = new Date(data.dt * 1000);
		var dtTime = dtTimeRaw.toLocaleTimeString(timeForm);
		var dtTimeAgo = timeAgo( dtTimeRaw );
		var dtHour = dtTimeRaw.getHours() < 10 ? "0" + dtTimeRaw.getHours() : dtTimeRaw.getHours();
		var dtMin = dtTimeRaw.getMinutes()
		var updatedTime = useUpdated;
			updatedTime += timePfx;
			updatedTime += dtTime;
			updatedTime += PfxEnd;
			updatedTime += dtTimeAgo;
			updatedTime += timeSfx;
		dt.innerHTML = updatedTime;
		dt.setAttribute('title', updatedTimeTxt+dtTime);
		if (DEVCONSOLE) {
			_csl.groupCollapsed(_cslHeadOpen+'wd_updatedTime'+_cslHeadDiv, _cslHeadFont );
			_csl.debug(
				'RunOnce: '+_cslFlag +_cslLB+
				'data.dt: ' + data.dt +_cslLB+
				'toISOString: '+ new Date(data.dt * 1000).toISOString() +_cslLB+
				'toLocaleTimeString: ' + new Date(data.dt * 1000).toLocaleTimeString(timeForm) +_cslLB+
				'timeAgo: ' + timeAgo( dtTimeRaw )
				+ _cslFooter
			);
			_csl.groupEnd();
			_csl.trace('Tracing wd_updatedTime');
		}
	};

	function wd_layerClasses() {
		if (DEVCONSOLE) {
			_csl.trace('Tracing wd_layerClasses');
		}
		var weather   = weatherdata["weather"][0];
		var weatherId = weather.id;
		//isMisty = false;

		isSnowy   ? snowlayer.className  = "s" + weatherId :  snowlayer.classList.remove();
		isDrizzle ? rainlayer.className  = "d" + weatherId :  rainlayer.classList.remove();
		isRainy   ? rainlayer.className  = "r" + weatherId :  rainlayer.classList.remove();
		isCloudy  ? cloudlayer.className = "c" + weatherId : cloudlayer.classList.remove();
		isMisty   ? mistlayer.className  = "m" + weatherId :  mistlayer.classList.remove();
	}

	function getWindDirection(deg) {
		if (DEVCONSOLE) {
			_csl.trace('Tracing getWindDirection');
		}
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
			var weatherId = weather.id;
			//var weatherId = 500; //for testing
			sunsettime = Number(weatherdata["sys"].sunset);
			sunrisetime = Number(weatherdata["sys"].sunrise);
			checkForSunset();

			isDrizzle = ( weatherId >= 300 && weatherId <= 321 );
			isRainy   = ( weatherId >= 500 && weatherId <= 531 );
				//isDrizzle = true; //for testing
				//isRainy = false; //for testing
				rainlayer.style.display = isRainy || isDrizzle ? "block" : "none";
				rainlayer.style.opacity = isDark || isDusk ? 0.75 : 1;
				rainwindow.style.display = isRainy || isDrizzle ? "block" : "none";
				rainwindow.style.opacity = isDark || isDusk ? 0.5 : 0.75;

			isSnowy = ( weatherId >= 600 && weatherId <= 622 );
				//isSnowy = true; //for testing
				snowlayer.style.display = isSnowy ? "block" : "none";
				snowlayer.style.opacity = isDark ? 0.1 : 0.75;

			isClear = ( weatherId >= 800 && weatherId <= 803  );

			isCloudy = ( weatherId >= 801 && weatherId <= 804 );
				//isCloudy = true; //for testing
				cloudlayer.style.display = isCloudy ? "block" : "none";
				cloudlayer.style.opacity = isDark ? 0.75 : 1;

			isSunny = ( weatherId == 800 || (isClear && !isDark) );
				//isSunny = false; //for testing
				sunlayer.style.display = isSunny ? "block" : "none";

			isClearNight = ( weatherId == (800 || 801) && isDark );
				//isClearNight = true; //for testing

			isMisty = ( weatherId == 701 || weatherId == 711 || weatherId == 721 || weatherId == 741 );
				//isMisty = true; //for testing
				mistlayer.style.display = isMisty ? "block" : "none";
				mistlayer.style.opacity = isDark ? 0.75 : 0.85;

			if (isDark && isMisty) {
					isClearNight = true;
				}
				clearnightlayer.style.display = isClearNight || isDusk || isDawn ? "block" : "none";
				clearnightlayer.style.opacity = isDusk || isDawn ? 0.2 : 1;
				shootinglayer.style.display = isClearNight ? "block" : "none";
				moonlayer.style.display = isDark ? "block" : "none";

			wd_layerClasses();
			if (DEVCONSOLE) {
				_csl.groupCollapsed(_cslHeadOpen+'setLayers'+_cslHeadDiv, _cslHeadFont );
				_csl.debug(
					'RunOnce: '+_cslFlag +_cslLB+
					'WeatherID: '+weatherId +_cslLB+
					'condition: ' +_cslLB+
					'  isDrizzle: ' + isDrizzle +_cslLB+
					'  isRainy: '+isRainy +_cslLB+
					'  isSnowy: '+isSnowy +_cslLB+
					'  isClear: '+isClear +_cslLB+
					'  isCloudy: '+isCloudy +_cslLB+
					'  isSunny: '+isSunny +_cslLB+
					'  isClearNight: '+isClearNight +_cslLB+
					'  isMisty: ' + isMisty +_cslLB+
					'weather.description: '+weather.description
					+ _cslFooter
				);
				_csl.groupEnd();
				_csl.trace('Tracing setLayers');
			}
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
		//isDark = true; //for testing
		//only change styles if isDark has changed
		if (isDark !== wasDark) {
			container.className = isDark ? "nightmode" : "daymode";
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
		//weather.icon = "04d"; // For testing
		icon.className = "weather i" + weather.icon;
		icon.innerHTML = svgPfx + usePfx + weather.icon + useSfx;
		if (DEVCONSOLE) {
			_csl.groupCollapsed(_cslHeadOpen+'checkForSunset'+_cslHeadDiv, _cslHeadFont );
			_csl.debug(
				'RunOnce: '+_cslFlag +_cslLB+
				'nowtime: ' + nowtime +_cslLB+
				'sunsettime: ' + sunsettime +_cslLB+
				'sunrisetime: ' + sunrisetime +_cslLB+
				'isDark: ' + isDark +_cslLB+
				'isDusk: ' + isDusk +_cslLB+
				'isDawn: ' + isDawn
				+ _cslFooter
			);
			_csl.groupEnd();
			_csl.trace('Tracing checkForSunset');
		}
	}

	//random number utility function
	function randRange(min, max) {
		if (DEVCONSOLE) {
			_csl.trace('Tracing randRange');
		}
		return Math.floor(Math.random()*(max-min+1))+min;
	}
})();
// remove unwanted nodes from inside a DOM node
(function() {
	'use strict';
	var utils = {}, doc = document, node, cleanGps, cleanForecast, cleanRain;
		cleanGps = doc.getElementById("gps");
		cleanForecast = doc.getElementById("forecast");
		cleanRain = doc.getElementById("rain");
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
		//doc.documentElement.className='cText';
		utils.clean(cleanGps);
		utils.clean(cleanForecast);
		utils.clean(cleanRain);
	}, 2000);
})();
