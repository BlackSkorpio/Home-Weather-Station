/* minifyOnSave, checkOutputFileAlreadyExists: false, checkAlreadyMinifiedFile: false, filenamePattern: $1.min.$2 */
/*! Home Weather Station weather.js
 *  Copyright  (c) 2015-2019 Bjarne Varoystrand - bjarne ○ kokensupport • com
 *  License: MIT
 *  @author Bjarne Varoystrand (@black_skorpio)
 *  @version 1.5.0
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

		var appVersion	= "1.5.0";
		var appName		= "Home Weahter Station";
		var _cslFlag	= false;
		var _cslHash	= 'CSL';
		var _cslState	= 0;
		var _cslTrace	= 0;
		var devHost		= (location.hostname == 'oxygen.local' || location.hostname == 'varoystrand.se');
		var DEVCONSOLE	= (_cslState == 1 && devHost) || location.hash == '#'+_cslHash;
		var TRACE		= (_cslTrace == 1);

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
		var svgStyle, sunPosition, Fragments, svgIcon, sunCalcHead, minMaxDesc, highTempTxt, lowTempTxt, precipionTxt, precipion1Txt, precipion3Txt, notificationTxt, weatherDescTxt, updateNowTxt, updateSecTxt, updateMinTxt, updateHourTxt, updateDayTxt, updateMonthTxt, updateYearTxt, updateAgoTxt, updatePluralTxt, updatePlural2Txt, galeTxt, updatedTimeTxt, detailsTxt, bfsTxt, locationTxt, windDirTxt, gettingTxt, locErrorTxt, gpsTxt, minMaxTxt, visibilityTxt, visibilityDesc, cloudinessTxt, cloudinessDesc, pressureTxt, humidityTxt, windTxt, sunRiseTxt, sunSetTxt, goldenTxt, goldMorTxt, goldEveTxt, moonRiseTxt, moonSetsTxt, clearTxt, cloudTxt, cloudTxt2, rainTxt, snowTxt, sunTxt, mistTxt, moonsetDesc, moonriseDesc, locationDesc, sunsetDesc, sunriseDesc, humidityDesc, pressureDesc, winddirDesc, windSpeedDesc, bftDesc, modalDescTxt, modalTitleTxt, wd_bfTxt, bfsHeadTxt, bfs00Txt, bfs01Txt, bfs02Txt, bfs03Txt, bfs04Txt, bfs05Txt, bfs06Txt, bfs07Txt, bfs08Txt, bfs09Txt, bfs10Txt, bfs11Txt, bfs12Txt, bfs13Txt, bfs14Txt, bfs15Txt, bfs16Txt, bfs17Txt, bfs21Txt, bfs22Txt, bfs23Txt, bfs24Txt, bfs25Txt, bfs26Txt, buttonOpen, months, days, directionsTxt, beaufortScale, ws_bft, wd_ws, wd_windspeed, wd_bf, bfSvgId, ws_s, ws_m, ws_f, wd_stormFlag, miles, km, visibleLength, localtemperature, tempForm, overcastForm, visibilityForm, windSpeed, beaufortForm, pressureForm, humidityForm, timeForm, timeOptions, tempClr, overCastLayer;

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
			highTempTxt = 'Högsta temperatur idag: ';
			lowTempTxt = 'Lägsta temperatur idag: ';
			minMaxDesc = 'Minsta och högsta temperatur för tillfället. <br /> Detta är avvikelse från nuvarande temp som är möjligt för stora städer och megalopoliserar geografiskt expanderade.';
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
			sunCalcHead = "Tidsplan";
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
			highTempTxt = 'Maximum temperature today: ';
			lowTempTxt = 'Minimum temperature today: ';
			minMaxDesc = 'Minimum and Maximum temperature at the moment.<br />This is deviation from current temp that is possible for large cities and megalopolises geographically expanded.';
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
			sunCalcHead = "Schedule";
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
			pressureForm = "hPa";
			humidityForm = "%";
			timeForm	= "eu";
			timeOptions = {
				hour:"numeric",
				minute:"2-digit"
			};
		break;
		case "imperial":
			tempForm	= "°F";
			windSpeed	= "mph";
			visibilityForm = "mi";
			overcastForm = "%";
			beaufortForm = "bft";
			pressureForm = "hPa";
			humidityForm = "%";
			timeForm	= "en";
			timeOptions = {
				hour:"numeric",
				minute:"2-digit"
			};
		break;
		default:
			tempForm	= "°K";
			windSpeed	= "mph";
			visibilityForm = "m";
			overcastForm = "%";
			beaufortForm = "bft";
			pressureForm = "hPa";
			humidityForm = "%";
			timeForm	= "en";
			timeOptions = {
				hour:"numeric",
				minute:"2-digit"
			};
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
	var liPfx = Fragments['liPfx'], idPfx = Fragments['idPfx'], timePfx = Fragments['timePfx'],
		PfxEnd = Fragments['PfxEnd'], timeSfx = Fragments['timeSfx'], dataDiv = Fragments['dataDiv'],
		wd_LB = Fragments['wd_LB'], sumPfx = Fragments['sumPfx'], sumSfx = Fragments['sumSfx'],
		spanPfx = Fragments['spanPfx'], spanTxt = Fragments['spanTxt'], spanSfx = Fragments['spanSfx'],
		svgPfx = Fragments['svgPfx'], titlePfx = Fragments['titlePfx'], titleSfx = Fragments['titleSfx'],
		usePfx = Fragments['usePfx'], useSfx = Fragments['useSfx'];
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
		useLowTemp:		svgPfx + titlePfx + lowTempTxt + titleSfx + usePfx + "hilowtemp" + useSfx,
		useHighTemp:	svgPfx + titlePfx + highTempTxt + titleSfx + usePfx + "hilowtemp" + useSfx,
		useWindRose:	svgPfx + titlePfx + windDirTxt + titleSfx + usePfx + "windirection" + useSfx,
		useWeatherDude:	'<svg class="getting" role="img">' + titlePfx + gettingTxt + titleSfx + usePfx + "weatherDude" + useSfx,
		useBeaufort:	svgPfx + usePfx + "bf0" + useSfx,
		useVisibility:	svgPfx + titlePfx + visibilityTxt + titleSfx + usePfx + "visibility" + useSfx,
		useOvercast:	svgPfx + titlePfx + cloudinessTxt + titleSfx + usePfx,
		useUpdated:		svgPfx + titlePfx + updatedTimeTxt + titleSfx + usePfx + "clock" + useSfx,
		useLogosmall:	svgPfx + titlePfx + appName + titleSfx + usePfx + "logosmall" + useSfx
	};
	var useLocation = svgIcon['useLocation'], useSunRise = svgIcon['useSunRise'], useSunSet = svgIcon['useSunSet'],
		useGoldenHour = svgIcon['useGoldenHour'], useMoonRise = svgIcon['useMoonRise'], useMoonSet = svgIcon['useMoonSet'],
		useHumidity = svgIcon['useHumidity'], useWindspeed = svgIcon['useWindspeed'], usePressure = svgIcon['usePressure'],
		useTemprature = svgIcon['useTemprature'], useLowTemp = svgIcon['useLowTemp'], useHighTemp = svgIcon['useHighTemp'],
		useWindRose = svgIcon['useWindRose'], useWeatherDude = svgIcon['useWeatherDude'], useBeaufort = svgIcon['useBeaufort'],
		useVisibility = svgIcon['useVisibility'], useOvercast = svgIcon['useOvercast'], useUpdated = svgIcon['useUpdated'],
		useLogosmall = svgIcon['useLogosmall'];

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
		if (TRACE) {
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
			var stateClr, BUILD_ELEMENTS, bundle, buildlink, wd_windowOpen, wd_rel, forkmewrapp, wd_forkTitle, wd_forkStyle, wd_buildurl, wd_buildIcon, wd_forkmeIcon;

			BUILD_ELEMENTS	= '#buildlink';
			buildlink		= doc.getElementById("buildlink");
			forkmewrapp		= doc.getElementById("ribbonwrapp");
			bundle			= doc.querySelectorAll( BUILD_ELEMENTS );

			//dayState		= isDark ? 'Night' : 'Day';
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
			wd_forkmeIcon	= svgPfx + wd_forkTitle +  usePfx + "ribbon" + useSfx;

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
					//'dayState: ' + dayState +_cslLB+
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
		//(TRACE) _csl.trace('Tracing updateTime');
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
		//if (TRACE) _csl.trace('Tracing getClockStrings');
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
		if (TRACE) {
			_csl.trace('Tracing getLocation');
		}
		if (useip) {
			getIPLocation();
		} else {
			getGPSLocation();
		}
	}

	function getGPSLocation() {
		if (TRACE) {
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
		if (TRACE) {
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
		if (TRACE) {
			_csl.trace('Tracing geoError');
		}
		gd.innerHTML = locErrorTxt;
	}

	function gpsPosition(json) {
		if (TRACE) {
			_csl.trace('Tracing gpsPosition');
		}
		gpsbutton.style.display = "none";
		lat = json.coords.latitude;
		lon = json.coords.longitude;
		gd.innerHTML = city + " (" + lat.toFixed(2) + " | " + lon.toFixed(2) + ")";
		showPosition();
	}

	function showPosition() {
		if (TRACE) {
			_csl.trace('Tracing showPosition');
		}
		var location = "lat=" + lat + "&lon=" + lon;
		//var location = "lat=55.6053&lon=13.0002";
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
		if (TRACE) {
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
		var minMaxTemp;

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

		// NOTE Convert the visibility data to metric or imperial
		var km = data.visibility / 1000;
		var miles = data.visibility * 0.0006213712;
		switch ( unitsFormat ) {
			case "metric":
				visibleLength = km.toFixed(1);
				localtemperature = +data["main"].temp.toFixed(1);
			break;
			case "imperial":
				visibleLength = miles.toFixed(2);
				localtemperature = +data["main"].temp.toFixed(2);
			break;
			default:
				visibleLength = data.visibility;
				localtemperature = data["main"].temp;
		};

		var overCastLayer		= isDark ? "overcastNight" : "overcastDay";

		detailsHeader.innerHTML = detailsTxt;

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
				windirdata += "°";
				windirdata += getWindDirection(data.wind.deg);
			} else {
				windirdata += "No data";
			}
			windirdata += spanSfx;
		var windirection = liPfx + idPfx + 'wd_windir' + PfxEnd;
			windirection += useWindRose;
			windirection += windirdata;

		var timeSunRise = new Date(data.sys.sunrise * 1000);
		var timeSunSet = new Date(data.sys.sunset * 1000);
		var sunriseline = liPfx + idPfx + 'wd_sunrise' + PfxEnd;
			sunriseline += useSunRise;
			sunriseline += timePfx;
			sunriseline += timeSunRise.toString();
			sunriseline += PfxEnd
			sunriseline += timeSunRise.toLocaleTimeString(timeForm, timeOptions);
			sunriseline += timeSfx;

		var sunsetline = liPfx + idPfx + 'wd_sunset' + PfxEnd;
			sunsetline += useSunSet;
			sunsetline += timePfx;
			sunsetline += timeSunSet.toString();
			sunsetline += PfxEnd
			sunsetline += timeSunSet.toLocaleTimeString(timeForm, timeOptions);
			sunsetline += timeSfx;

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

		wd_beaufort(data);
		wd_tempScale(data,tempClr);
		wd_CSSstyles(data);
		wd_precipion(data);
		wd_hilowtemp(data);
		setLayers();
		wd_modal(data);
		wd_visible();
		wd_updatedTime(data);
		wd_sunCalc();
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
		}
	}

	function wd_sunCalc() {
		// NOTE SunCalc
		//var SunCalc;
		if (TRACE) _csl.trace('Tracing wd_sunCalc');
		var SunCalcNow		= new Date();
			var SunCalLat		= lat.toFixed(2);
			var SunCalLon		= lon.toFixed(2);
			var getMoonTimes, moonRisesDate, moonSetsDate, moonRisesTime, moonSetsTime, getSunTimes, gMorningDate, gEveningDate, gMorningTime, gEveningTime, moonRises, moonSets, goldenMorningHour, goldenEveningHour, goldenMorningTime, goldenEveningTime, goldenHourSvgPfx, goldenHourSvgSfx, sunCalcline;

		getMoonTimes	= SunCalc.getMoonTimes( SunCalcNow, SunCalLat, SunCalLon );
		getSunTimes		= SunCalc.getTimes( SunCalcNow, SunCalLat, SunCalLon );

		// NOTE Create time and datestrings
		moonRisesDate	= new Date(getMoonTimes['rise']).toISOString();
			moonSetsDate	= new Date(getMoonTimes['set']).toISOString();
			moonRisesTime	= getMoonTimes['rise'].toLocaleTimeString(timeForm, timeOptions);
			moonSetsTime	= getMoonTimes['set'].toLocaleTimeString(timeForm, timeOptions);
		gMorningDate	= new Date(getSunTimes['goldenHourEnd']).toISOString();
			gEveningDate	= new Date(getSunTimes['goldenHour']).toISOString();
			gMorningTime	= getSunTimes['goldenHourEnd'].toLocaleTimeString(timeForm, timeOptions);
			gEveningTime	= getSunTimes['goldenHour'].toLocaleTimeString(timeForm, timeOptions);

		// NOTE Moon up & Down
		moonRises = useMoonSet;
			moonRises += timePfx;
			moonRises += moonRisesDate;
			moonRises += PfxEnd;
			moonRises += moonRisesTime;
			moonRises += timeSfx;

		moonSets = useMoonRise;
			moonSets += timePfx;
			moonSets += moonSetsDate;
			moonSets += PfxEnd;
			moonSets += moonSetsTime;
			moonSets += timeSfx;

		// NOTE Golden hours
		goldenMorningTime = timePfx;
			goldenMorningTime += gMorningDate;
			goldenMorningTime += PfxEnd;
			goldenMorningTime += gMorningTime;
			goldenMorningTime += timeSfx;

		goldenEveningTime = timePfx;
			goldenEveningTime += gEveningDate;
			goldenEveningTime += PfxEnd;
			goldenEveningTime += gEveningTime;
			goldenEveningTime += timeSfx;

		goldenHourSvgPfx = svgPfx;
			goldenHourSvgPfx += titlePfx;

		goldenHourSvgSfx = titleSfx;
			goldenHourSvgSfx += usePfx;
			goldenHourSvgSfx += "goldenhour";
			goldenHourSvgSfx += useSfx;

		goldenMorningHour = goldenHourSvgPfx;
			goldenMorningHour += goldenTxt + goldMorTxt;
			goldenMorningHour += goldenHourSvgSfx;
			goldenMorningHour += goldenMorningTime;

		goldenEveningHour = goldenHourSvgPfx;
			goldenEveningHour += goldenTxt + goldEveTxt;
			goldenEveningHour += goldenHourSvgSfx;
			goldenEveningHour += goldenEveningTime;

		sunCalcline = '<li id="wd_spacer">' + sunCalcHead;
			sunCalcline += '<li id="wd_morning">' + goldenMorningHour;
			sunCalcline += '<li id="wd_evening">' + goldenEveningHour;
			sunCalcline += '<li id="wd_moonrise">' + moonRises;
			sunCalcline += '<li id="wd_moonset">' + moonSets;

		//return sunCalcline;
		details.innerHTML += sunCalcline;

		if (DEVCONSOLE) {
			_csl.groupCollapsed(_cslHeadOpen+'wd_sunCalc'+_cslHeadDiv, _cslHeadFont );
				_csl.group('getMoonTimes');
					Object.keys(getMoonTimes).forEach(function(key) {
						_csl.debug(key + ': ' + getMoonTimes[key]);
					});
				_csl.groupEnd();

				_csl.group('getSunTimes');
					Object.keys(getSunTimes).forEach(function(key) {
						_csl.debug(key + ': ' + getSunTimes[key]);
					});
				_csl.groupEnd();
			_csl.groupEnd();
		}
	}

	function wd_precipion(data) {
		var rain = data.rain;
			snow = data.snow;
		if ( rain || snow !=null ) {
			if (TRACE) _csl.trace('Tracing wd_precipion');
			var rain1, snow1, rain3, snow3, precipitation, precipionSvg, precipionId, rainData, snowData, precipionTime, precipitationTxt;

			// NOTE check if we have some rain data
			if ( rain !=null ) {
				rain1 = rain['1h'], rain3 = rain['3h'];
				precipionId = 'precipion_rain';
				if (rain1 !=null) precipitation = rain1, precipionTime = precipion1Txt;
				if (rain3 !=null) precipitation = rain3, precipionTime = precipion3Txt;
			}
			// NOTE check if we have some snow data
			if ( snow !=null ) {
				snow1 = snow['1h'], snow3 = snow['3h'];
				precipionId = 'precipion_snow';
				if (snow1 !=null) precipitation = snow1, precipionTime = precipion1Txt;
				if (snow3 !=null) precipitation = snow3, precipionTime = precipion3Txt;
			}

			precipionSvg = svgPfx;
				precipionSvg += titlePfx;
				precipionSvg += precipionTxt;
				precipionSvg += titleSfx;
				precipionSvg += usePfx;
				precipionSvg += precipionId;
				precipionSvg += useSfx;

			precipitationTxt = spanTxt;
				precipitationTxt += precipitation.toFixed(1);
				precipitationTxt += "mm ";
				precipitationTxt += precipionTime;
				precipitationTxt += spanSfx;

			precipion_wrap.innerHTML = precipionSvg + precipitationTxt;

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
	}

	function wd_hilowtemp(data) {
		var minTemp, maxTemp, minMaxTemp, hitempdata, lowtempdata, minmaxline;

		switch ( unitsFormat ) {
			case "metric":
				minTemp = +data.main.temp_min.toFixed(1);
				maxTemp = +data.main.temp_max.toFixed(1);
			break;
			case "imperial":
				minTemp = +data.main.temp_min.toFixed(2);
				maxTemp = +data.main.temp_max.toFixed(2);
			break;
			default:
				minTemp = data.main.temp_min;
				maxTemp = data.main.temp_max;
		};
		// NOTE Check that minTemp and maxTemp is not empty and is not equal
		minMaxTemp = ( ( minTemp !=null || maxTemp !=null ) && maxTemp != minTemp );

		hitempdata = liPfx + idPfx + 'wd_hightemp' + PfxEnd;
			hitempdata += useHighTemp;
			hitempdata += spanTxt;
			hitempdata += maxTemp;
			hitempdata += tempForm;
			hitempdata += spanSfx;
		lowtempdata = liPfx + idPfx + 'wd_lowtemp' + PfxEnd;
			lowtempdata += useLowTemp;
			lowtempdata += spanTxt;
			lowtempdata += minTemp;
			lowtempdata += tempForm;
			lowtempdata += spanSfx;

		minmaxline = hitempdata + lowtempdata;

		if ( minMaxTemp ) details.innerHTML += minmaxline;
		if (DEVCONSOLE && minMaxTemp) {
			_csl.groupCollapsed(_cslHeadOpen+'processWeather'+_cslHeadDiv, _cslHeadFont );
				_csl.debug(
					'RunOnce: '+_cslFlag +_cslLB+
					'TempMin: ' + minTemp +_cslLB+
					'TempMax: ' + maxTemp +_cslLB+_cslLB
					+ _cslFooter
				);
			_csl.groupEnd();
		}
	}

	function wd_beaufort(data) {
		if (TRACE) _csl.trace('Tracing wd_beaufort');
		// NOTE Convert m/s to beaufort scale
		// Skalan kan beräknas med formeln V = k · B3/2, där k = 0,8365, B = Beauforttalet, och V = vindhastighet i m/s
		// 2.9 = 0.8365 * 3/2
		var wd_windspeed = data.wind.speed.toFixed(2);
		//var wd_windspeed = 33; // For testing
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
		var windSpeeds = new Object();
		windSpeeds = {
			ws00: ( wd_ws >=     0 && wd_ws <=  0.29 ),
			ws01: ( wd_ws >=  0.30 && wd_ws <=  1.59 ),
			ws02: ( wd_ws >=  1.60 && wd_ws <=  3.33 ),
			ws03: ( wd_ws >=  3.40 && wd_ws <=  5.49 ),
			ws04: ( wd_ws >=  5.50 && wd_ws <=  7.99 ),
			ws05: ( wd_ws >=  8.00 && wd_ws <= 10.79 ),
			ws06: ( wd_ws >= 10.80 && wd_ws <= 13.89 ),
			ws07: ( wd_ws >= 13.90 && wd_ws <= 17.19 ),
			ws08: ( wd_ws >= 17.20 && wd_ws <= 20.79 ),
			ws09: ( wd_ws >= 20.80 && wd_ws <= 24.49 ),
			ws10: ( wd_ws >= 24.50 && wd_ws <= 28.49 ),
			ws11: ( wd_ws >= 28.50 && wd_ws <= 32.69 ),
			ws12: ( wd_ws >= 32.70 && wd_ws <= 36.99 ),
			ws13: ( wd_ws >= 37.00 && wd_ws <= 41.49 ),
			ws14: ( wd_ws >= 41.50 && wd_ws <= 46.19 ),
			ws15: ( wd_ws >= 46.20 && wd_ws <= 50.99 ),
			ws16: ( wd_ws >= 51.00 && wd_ws <= 56.09 ),
			ws17: ( wd_ws >= 56.10 && wd_ws <= 61.20 )
		};
		var wsRange00 = windSpeeds['ws00'], wsRange01 = windSpeeds['ws01'], wsRange02 = windSpeeds['ws02'],
			wsRange03 = windSpeeds['ws03'], wsRange04 = windSpeeds['ws04'], wsRange05 = windSpeeds['ws05'],
			wsRange06 = windSpeeds['ws06'], wsRange07 = windSpeeds['ws07'], wsRange08 = windSpeeds['ws08'],
			wsRange09 = windSpeeds['ws09'], wsRange10 = windSpeeds['ws10'], wsRange11 = windSpeeds['ws11'],
			wsRange12 = windSpeeds['ws12'], wsRange13 = windSpeeds['ws13'], wsRange14 = windSpeeds['ws14'],
			wsRange15 = windSpeeds['ws15'], wsRange16 = windSpeeds['ws16'], wsRange17 = windSpeeds['ws17'];
		if (wsRange00) {
			wd_bf =  0;
			wd_bfTxt = bfs21Txt + wd_LB + bfs00Txt;
		}
		if (wsRange01) {
			wd_bf =  1;
			wd_bfTxt = bfs01Txt + wd_LB + bfs21Txt;
		}
		if (wsRange02) {
			wd_bf =  2;
			wd_bfTxt = bfs02Txt + wd_LB + bfs21Txt;
		}
		if (wsRange03) {
			wd_bf =  3;
			wd_bfTxt = bfs03Txt + wd_LB + bfs21Txt;
		}
		if (wsRange04) {
			wd_bf =  4;
			wd_bfTxt = bfs04Txt + wd_LB + bfs21Txt;
		}
		if (wsRange05) {
			wd_bf =  5;
			wd_bfTxt = bfs05Txt + wd_LB + bfs23Txt;
		}
		if (wsRange06) {
			wd_bf =  6;
			wd_bfTxt = bfs06Txt + wd_LB + bfs23Txt;
		}
		if (wsRange07) {
			wd_bf =  7;
			wd_bfTxt = bfs07Txt + wd_LB + bfs23Txt;
		}
		if (wsRange08) {
			wd_bf =  8;
			wd_bfTxt = bfs08Txt + wd_LB + bfs23Txt;
		}
		if (wsRange09) {
			wd_bf =  9;
			wd_bfTxt = bfs09Txt + wd_LB + bfs23Txt;
		}
		if (wsRange10) {
			wd_bf = 10;
			wd_bfTxt = bfs10Txt + wd_LB + bfs24Txt;
		}
		if (wsRange11) {
			wd_bf = 11;
			wd_bfTxt = bfs11Txt + wd_LB + bfs25Txt;
		}
		if (wsRange12) {
			wd_bf = 12;
			wd_bfTxt = bfs12Txt + wd_LB + bfs26Txt;
		}
		if (wsRange13) {
			wd_bf = 13;
			wd_bfTxt = bfs13Txt + wd_LB + bfs26Txt;
		}
		if (wsRange14) {
			wd_bf = 14;
			wd_bfTxt = bfs14Txt + wd_LB + bfs26Txt;
		}
		if (wsRange15) {
			wd_bf = 15;
			wd_bfTxt = bfs15Txt + wd_LB + bfs26Txt;
		}
		if (wsRange16) {
			wd_bf = 16;
			wd_bfTxt = bfs16Txt + wd_LB + bfs26Txt;
		}
		if (wsRange17) {
			wd_bf = 17;
			wd_bfTxt = bfs17Txt + wd_LB + bfs26Txt;
		}

		var beauforts = new Object();
		beauforts = {
			bft00: ( wd_bf >=    0 && wd_bf <=    2 ),
			bft01: ( wd_bf >=    3 && wd_bf <=    4 ),
			bft02: ( wd_bf >=    5 && wd_bf <=    6 ),
			bft03: ( wd_bf >=    7 && wd_bf <=    8 ),
			bft04: ( wd_bf >=    9 && wd_bf <=   10 ),
			bft05: ( wd_bf >=   11 && wd_bf <=   17 )
		};
		var bftRange00 = beauforts['bft00'], bftRange01 = beauforts['bft01'], bftRange02 = beauforts['bft02'],
			bftRange03 = beauforts['bft03'], bftRange04 = beauforts['bft04'], bftRange05 = beauforts['bft05'];
		if (bftRange00) bfSvgId = 0, ws_s = 75, ws_m = 55, ws_f = 35, ws_bft = 10;
		if (bftRange01) bfSvgId = 1, ws_s = 65, ws_m = 45, ws_f = 35, ws_bft =  5;
		if (bftRange02) bfSvgId = 2, ws_s = 60, ws_m = 40, ws_f = 30, ws_bft =  4;
		if (bftRange03) bfSvgId = 3, ws_s = 55, ws_m = 35, ws_f = 25, ws_bft =  3;
		if (bftRange04) bfSvgId = 4, ws_s = 45, ws_m = 25, ws_f = 15, ws_bft =  2;
		if (bftRange05) bfSvgId = 5, ws_s = 35, ws_m = 15, ws_f =  5, ws_bft =  1;

		//if ( wd_bf >=  0 && wd_bf <= 5 ) wd_flag = 0;
		var flags = new Object();
		flags = {
			wfl01: ( wd_ws >= 10.80 && wd_ws <= 17.19 ),
			wfl02: ( wd_ws >= 17.20 && wd_ws <= 24.49 ),
			wfl03: ( wd_ws >= 24.50 && wd_ws <= 32.69 ),
			wfl04: ( wd_ws >= 32.70 && wd_ws <= 61.20 ),
			wfl05: ( wd_ws >= 10.80 && wd_ws <= 61.20 )
		};
		var wflRange01 = flags['wfl01'], wflRange02 = flags['wfl02'], wflRange03 = flags['wfl03'],
			wflRange04 = flags['wfl04'], wflRange05 = flags['wfl05'];
		if (wflRange01) wd_stormFlag = 'gale1';
		if (wflRange02) wd_stormFlag = 'gale2';
		if (wflRange03) wd_stormFlag = 'storm1';
		if (wflRange04) wd_stormFlag = 'storm2';
		if (wflRange05) {
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
		}
	}

	function wd_modal(data) {
		if (TRACE) _csl.trace('Tracing wd_modal');
		// Modal https://codepen.io/chriscoyier/pen/MeJWoM
		// And https://codepen.io/noahblon/pen/yJpXka
		var modal, modalOverlay, buttonClose, classClosed, aHidden, tabindex, FOCUSABLE_SELECTORS, modalTitle, modalDescription, modalMinMaxTemp, modalMinMaxTxt, modalBeaufort, modalWspeed, modalWdirection, modalPressure, modalHumidity, modalCloudiness, modalVisibility, modalSunrise, modalSunset, modalLocation, modalMoonrise, modalMonnset, modalMorningold, modalEveningold, modalBuiltBy;

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
		var modalMinMaxTemp		= doc.getElementById("db_minmaxtemp");
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

		var modalMinMaxTxt		= sumPfx;
			modalMinMaxTxt		+= useHighTemp + minMaxTxt;
			modalMinMaxTxt		+= sumSfx;
			modalMinMaxTxt		+= spanPfx;
			modalMinMaxTxt		+= minMaxDesc;
			modalMinMaxTxt		+= spanSfx;
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
		modalMinMaxTemp.innerHTML	= modalMinMaxTxt;
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
		if (TRACE) _csl.trace('Tracing setLayers');
		var HIDDEN_ELEMENTS	= '#details, #beaufort, #open-button';
		var showElements	= main.querySelectorAll( HIDDEN_ELEMENTS );
		var classVisible	= "visible";
		var modal			= doc.querySelector("#modal");
		//var HIDE_ELEMENTS	= '#dt_moonset, #dt_morningold, #dt_eveningold, #dt_moonrise';
		//var hideElements	= modal.querySelectorAll( HIDE_ELEMENTS );
		//var classHidden		= 'hidden';
		//hideElements.forEach(function(elements) {
		//	return elements.classList.add( classHidden );
		//});
		showElements.forEach(function(elements) {
			return elements.classList.add( classVisible );
		});
	}

	function wd_tempScale(data) {
		if (TRACE) _csl.trace('Tracing wd_tempScale');
		var tempNow, wd_temp, fromCelsius, fromFarenheit, fromKelvin;
			tempNow			= Number(data.main.temp.toFixed(1));
			//tempNow			= 55;
			fromCelsius		= tempNow;
			fromFarenheit	= (tempNow - 32) * 5/9;
			fromKelvin		= tempNow - 273.15;
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
		var tempRange = new Object();
		tempRange = {
			range00: ( wd_temp >=  40.1 ),
			range01: ( wd_temp >=  30.1 && wd_temp <=  40.0 ),
			range02: ( wd_temp >=  25.1 && wd_temp <=  30.0 ),
			range03: ( wd_temp >=  20.1 && wd_temp <=  25.0 ),
			range04: ( wd_temp >=  15.1 && wd_temp <=  20.0 ),
			range05: ( wd_temp >=  10.1 && wd_temp <=  15.0 ),
			range06: ( wd_temp >=   5.1 && wd_temp <=  10.0 ),
			range07: ( wd_temp >=   0.0 && wd_temp <=   5.0 ),
			range08: ( wd_temp >=  -5.0 && wd_temp <=  -0.1 ),
			range09: ( wd_temp >= -10.0 && wd_temp <=  -5.1 ),
			range10: ( wd_temp >= -15.0 && wd_temp <= -10.1 ),
			range11: ( wd_temp >= -20.0 && wd_temp <= -15.1 ),
			range12: ( wd_temp >= -30.0 && wd_temp <= -20.1 ),
			range13: ( wd_temp >= -40.0 && wd_temp <= -30.1 ),
			range14: ( wd_temp <= -40.1 )
		};
		var tempRange00 = tempRange['range00'], tempRange01 = tempRange['range01'], tempRange02 = tempRange['range02'],
			tempRange03 = tempRange['range03'], tempRange04 = tempRange['range04'], tempRange05 = tempRange['range05'],
			tempRange06 = tempRange['range06'], tempRange07 = tempRange['range07'], tempRange08 = tempRange['range08'],
			tempRange09 = tempRange['range09'], tempRange10 = tempRange['range10'], tempRange11 = tempRange['range11'],
			tempRange12 = tempRange['range12'], tempRange13 = tempRange['range13'], tempRange14 = tempRange['range14'];
		/*  40.1 -  50.0 */
		if (tempRange00) tempClr = "rgb(43, 0, 1)";
		/*  30.1 -  40.0 */
		if (tempRange01) tempClr = "rgb(107,  21,  39)";
		/*  25.1 -  30.0 */
		if (tempRange02) tempClr = "rgb(195,  65, 114)";
		/*  20.1 -  25.0 */
		if (tempRange03) tempClr = "rgb(231, 121,  97)";
		/*  15.1 -  20.0 */
		if (tempRange04) tempClr = "rgb(236, 171,  77)";
		/*  10.1 -  15.0 */
		if (tempRange05) tempClr = "rgb(237, 218,  69)";
		/*   5.1 -  10.0 */
		if (tempRange06) tempClr = "rgb(195, 230,  77)";
		/*   5.0 -   0.0 */
		if (tempRange07) tempClr = "rgb( 89, 188, 160)";
		/*  -0.1 -  -5.0 */
		if (tempRange08) tempClr = "rgb( 77, 132, 203)";
		/*  -5.1 - -10.0 */
		if (tempRange09) tempClr = "rgb( 99,  92, 183)";
		/* -10.1 - -15.0 */
		if (tempRange10) tempClr = "rgb( 54,  42, 118)";
		/* -15.1 - -20.0 */
		if (tempRange11) tempClr = "rgb(154,  29, 154)";
		/* -20.1 - -30.0 */
		if (tempRange12) tempClr = "rgb(255, 177, 255)";
		/* -30.1 - -40.0 */
		if (tempRange13) tempClr = "rgb(239, 239, 239)";
		/* -40.1 - -60.0 */
		if (tempRange14) tempClr = "rgb(0, 8, 101)";
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
		}
	}

	function wd_CSSstyles(data) {
		if (TRACE) _csl.trace('Tracing wd_sunPosition');
		var sunUpRaw, sunDownRaw, sunNowRaw, sunUpHour, sunUpMin, sunUpMinute,
			sunNowHour, sunNowMin, sunNowMinute, sunDownHour, sunDownMin,
			sunDownMinute, sunUp, sunNow, sunDown, sunLeft, sunHours,
			sunLeftCalc, sunPos, sunPosition, moonHours, moonBrightnes, isDay,
			hPaData, kPaOut, svgStyle;

		// NOTE Calculate sun position
		// https://stackoverflow.com/a/18358056/6820262
		sunUpRaw	= new Date(data.sys.sunrise * 1000);
			sunNowRaw	= new Date();
			sunDownRaw	= new Date(data.sys.sunset * 1000);
			sunUpHour	= sunUpRaw.getHours();
			sunNowHour	= sunNowRaw.getHours();
			sunDownHour	= sunDownRaw.getHours();
			sunUpMin	= sunUpRaw.getMinutes();
			sunUpMinute = sunUpMin < 10 ? "0" + sunUpMin   : sunUpMin;
			sunNowMin	= sunNowRaw.getMinutes();
			sunNowMinute = sunNowMin < 10 ? "0" + sunNowMin  : sunNowMin;
			sunDownMin	= sunDownRaw.getMinutes();
			sunDownMinute = sunDownMin < 10 ? "0" + sunDownMin : sunDownMin;

			sunUp		= sunUpHour + '.' + sunUpMinute;	// A
			sunNow		= sunNowHour + '.' + sunNowMinute;	// B
			//sunNow		= 08.05; // For testing
		sunDown		= sunDownHour + '.' + sunDownMinute;// C
			sunLeft		= sunDown - sunNow;	// X = C - B
			sunHours	= sunDown - sunUp;	// Y = C - A
		// Z = X / Y * 100
		sunPos	= sunLeft.toFixed(2) / sunHours.toFixed(2) * 100;
			sunPosition = sunPos > 100.00 ? 99.99 : sunPos;
			moonHours = (24 - sunHours) * 60;
			moonBrightnes = 100 - Number(data.clouds.all);
			isDay = sunLeft >=0;

			// NOTE Convert hPA to kPa for display in gauge
			hPaData = data.main.pressure;
			kPaOut = hPaData/10;

		svgStyle = ':root{';
			svgStyle += '--hPa:' + kPaOut + 'deg;';
			svgStyle += '--windeg:' + data.wind.deg + 'deg;';
			svgStyle += '--sunPosition:' + sunPosition.toFixed(2) + '%;';
			svgStyle += '--moontime:' + moonHours + 's;';
			svgStyle += '--tempClr:' + tempClr + ';';
			svgStyle += '--bftclr:var(--bf' + bfSvgId + ');';
			svgStyle += '--bftSpeed:' + ws_bft + 's;';
			svgStyle += '--windspeed-s:' + ws_s + 's;';
			svgStyle += '--windspeed-m:' + ws_m + 's;';
			svgStyle += '--windspeed-f:' + ws_f + 's;';
			svgStyle += '--moonBright:'+ moonBrightnes + '%;'
			svgStyle += '}';
		sStyles.innerHTML = svgStyle;

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
				'sunLeft: '+sunDown+' - '+sunNow+' = '+sunLeft.toFixed(2) +_cslLB+
				'sunHours: '+sunDown+' - '+sunUp +' = '+sunHours.toFixed(2) +_cslLB+
				'sunPosition: '+sunLeft.toFixed(2)+' / '+sunHours.toFixed(2)+' * 100 = '+sunPosition.toFixed(2) +_cslLB+
				'moonHours: ' + '(24 - ' + sunHours +')  * 60 = ' + moonHours
				+ _cslFooter
			);
			_csl.groupEnd();
		}
	};

	function wd_updatedTime(data) {
		if (TRACE) _csl.trace('Tracing wd_updatedTime');
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
		}
	};

	function wd_docClasses() {
		if (TRACE) _csl.trace('Tracing wd_docClasses');

		var weather   = weatherdata["weather"][0];
		var weatherId = weather.id;
		var docBody = doc.querySelector("body");
		//isMisty = false;
		sunsettime = Number(weatherdata["sys"].sunset);
		sunrisetime = Number(weatherdata["sys"].sunrise);
		checkForSunset();

		// NOTE Loop over each selector and add `modeClass` to each
		var modeTarget = [docBody, container, rainwindow];
		var modeClass = isDark ? "nightmode" : "daymode";
		modeTarget.forEach(function(element) {
			return element.className = modeClass;
		});

		isSnowy   ? snowlayer.className  = "s" + weatherId :  snowlayer.classList.remove();
		isDrizzle ? rainlayer.className  = "d" + weatherId :  rainlayer.classList.remove();
		isRainy   ? rainlayer.className  = "r" + weatherId :  rainlayer.classList.remove();
		isCloudy  ? cloudlayer.className = "c" + weatherId : cloudlayer.classList.remove();
		isMisty   ? mistlayer.className  = "m" + weatherId :  mistlayer.classList.remove();
	}

	function getWindDirection(deg) {
		if (TRACE) _csl.trace('Tracing getWindDirection');

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
			if (TRACE) _csl.trace('Tracing setLayers');

			var weather = weatherdata["weather"][0];
			var weatherId = weather.id;
			//var weatherId = 531; //for testing
			sunsettime = Number(weatherdata["sys"].sunset);
			sunrisetime = Number(weatherdata["sys"].sunrise);
			checkForSunset();
			var dBlock			= "block";
			var dNone			= "none";
			var drizzleRange	= ( weatherId >= 300 && weatherId <= 321 );
			var rainRange		= ( weatherId >= 500 && weatherId <= 531 );
			var snowRange		= ( weatherId >= 600 && weatherId <= 622 );
			var clearRange		= ( weatherId >= 800 && weatherId <= 803  );
			var cloudyRange		= ( weatherId >= 801 && weatherId <= 804 );
			var sunnyRange		= ( weatherId == 800 || (isClear && !isDark) );
			var clearNightRange	= ( weatherId == (800 || 801) && isDark );
			var mistyRange		= ( weatherId == 701 || weatherId == 711 || weatherId == 721 || weatherId == 741 );

			isDrizzle = drizzleRange;
			isRainy   = rainRange;
				//isDrizzle = true; //for testing
				//isRainy = false; //for testing
				rainlayer.style.display = isRainy || isDrizzle ? dBlock : dNone;
				rainlayer.style.opacity = isDark || isDusk ? 0.75 : 1;
				rainwindow.style.display = isRainy || isDrizzle ? dBlock : dNone;
				rainwindow.style.opacity = isDark || isDusk ? 0.5 : 0.75;

			isSnowy = snowRange;
				//isSnowy = true; //for testing
				snowlayer.style.display = isSnowy ? dBlock : dNone;
				snowlayer.style.opacity = isDark ? 0.1 : 0.75;

			isClear = clearRange;

			isCloudy = cloudyRange;
				//isCloudy = true; //for testing
				cloudlayer.style.display = isCloudy ? dBlock : dNone;
				cloudlayer.style.opacity = isDark ? 0.75 : 1;

			isSunny = sunnyRange;
				//isSunny = false; //for testing
				sunlayer.style.display = isSunny ? dBlock : dNone;

			isClearNight = clearNightRange;
				//isClearNight = true; //for testing

			isMisty = mistyRange;
				//isMisty = true; //for testing
				mistlayer.style.display = isMisty ? dBlock : dNone;
				mistlayer.style.opacity = isDark ? 0.75 : 0.85;

			if (isDark && isMisty) {
					isClearNight = true;
				}
				clearnightlayer.style.display = isClearNight || isDusk || isDawn ? dBlock : dNone;
				clearnightlayer.style.opacity = isDusk || isDawn ? 0.2 : 1;
				shootinglayer.style.display = isClearNight ? dBlock : dNone;
				moonlayer.style.display = isDark ? dBlock : dNone;

			wd_docClasses();
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
			}
		}
	}

	function checkForSunset() {
		if (TRACE) _csl.trace('Tracing checkForSunset');

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
		//weather.icon = "01n"; // For testing
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
		}
	}

	//random number utility function
	function randRange(min, max) {
		if (TRACE) _csl.trace('Tracing randRange');

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
