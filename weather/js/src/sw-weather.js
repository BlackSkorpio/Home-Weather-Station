/* minifyOnSave, checkOutputFileAlreadyExists: false, checkAlreadyMinifiedFile: false, filenamePattern: ../../$1.min.$2 */
/*! Home Weather Station serviceWorker sw-weather.js
 *  Copyright  (c) 2015-2019 Bjarne Varoystrand - bjarne ○ kokensupport • com
 *  License: MIT
 *  @author Bjarne Varoystrand (@black_skorpio)
 *  @version 1.0.0
 *  @description Forked from the ShearSpire Media Weather Clock by Steven Estrella (https://www.shearspiremedia.com)
 *               First introduced here: https://css-tricks.com/how-i-built-a-gps-powered-weather-clock-with-my-old-iphone-4/
 *  http://varoystrand.se | http://kokensupport.com
**/
// https://serviceworke.rs/offline-status.html
// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://medium.com/@onejohi/offline-web-apps-using-local-storage-and-service-workers-5d40467117b9
var sw_version = '1.0.0';
console.info(sw_version+'-hws-weather');
var DEVCONSOLE = location.hostname == 'oxygen.local';
/*if('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('sw-weather.min.js')
		.then(function(registration) {
			if (DEVCONSOLE) console.log("[register] Service Worker registration successful", registration);
		}, function(err) {
			if (DEVCONSOLE) console.log("[register] Registration failed", registration)
		})
	})

	// Listen for claiming of our ServiceWorker
	navigator.serviceWorker.addEventListener('controllerchange', function(event) {
		if (DEVCONSOLE) console.log('[controllerchange] A "controllerchange" event has happened within navigator.serviceWorker: ', event);

		// Listen for changes in the state of our ServiceWorker
		navigator.serviceWorker.controller.addEventListener('statechange', function() {
			if (DEVCONSOLE) console.log('[controllerchange][statechange] A "statechange" has occured: ', this.state);

			// If the ServiceWorker becomes "activated", let the user know they can go offline!
			if (this.state === 'activated') {
				if (DEVCONSOLE) console.log('[controllerchange][statechange][activated] WHS is ready to go offline');
				// Show the "You may now use offline" notification
				document.getElementById('offlineNotification').classList.add('ready');
			}
		});
	});
};*/

var CACHE_NAME = sw_version+'-hws-weather';

var urls_to_cache = [
	'/weather/',
	'css/weather.min.css',
	'img/sprite.svg',
	'img/window-day.jpg',
	'img/window-night.jpg'
	//'js/weather.min.js'
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			if (DEVCONSOLE) console.log('[install] Caches opened, adding all core components to cache');
			return cache.addAll(urls_to_cache)
		})
		.then(function() {
			if (DEVCONSOLE) console.log('[install] All required resources have been cached, we\'re good!');
			return self.skipWaiting();
		})
	)
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			// Cache hit - return response
			if (response) {
				if (DEVCONSOLE) console.log('[fetch] Returning from ServiceWorker cache: ', event.request.url);
				return response;
			}

			return fetch(event.request).then(
				function(response) {
					if (DEVCONSOLE) console.log('[fetch] Returning from server: ', event.request.url);
					// Check if we received a valid response
					if(!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					// IMPORTANT: Clone the response. A response is a stream
					// and because we want the browser to consume the response
					// as well as the cache consuming the response, we need
					// to clone it so we have two streams.
					var responseToCache = response.clone();

					caches.open(CACHE_NAME)
					.then(function(cache) {
						cache.put(event.request, responseToCache);
					});

					return response;
				}
			);
		})
	);
});

/*var clearOldCaches = function() {
	return caches.keys().then(function(keys)  {
		return Promise.all(keys.filter(
			function(key) {
				!key.startsWith(sw_version)
			}
		)
		.map(function(key) {
			caches.delete(key)
		}));
	});
};*/
self.addEventListener('activate', function(event) {
	if (DEVCONSOLE) console.log('[activate] Activating ServiceWorker!');

	if (DEVCONSOLE) console.log('[activate] Claiming this ServiceWorker!');
	/*event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (CACHE_NAME !== cacheName &&  cacheName.startsWith("gih-cache")) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);*/
	event.waitUntil(self.clients.claim());
});
