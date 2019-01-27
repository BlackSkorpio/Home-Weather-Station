<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Access Denied</title>
	</head>
	<body>
		<?php
			error_reporting(0);
			$latitude = "80";
			$longitude = "-85";

			if (isset($_GET["lat"]) && isset($_GET["lon"])) {
				$latitude = $_GET["lat"];
				$longitude = $_GET["lon"];
			}
			if (isset($_GET['lang']) && isset($_GET['units'])) {
				$langCode = $_GET['lang'];
				$unitsFormat = $_GET['units'];
			}
			/*if ( isset($_GET['apikey']) ) {
				$apikey = $_GET['apikey'];
			}*/

			$endpoint = "http://api.openweathermap.org/data/2.5/weather?";
			$apikey = "9aa352a903101d13f7be396a2414e280";
			$weatherurl = $endpoint . "lat=" . $latitude . "&lon=" . $longitude . "&lang=" . $langCode . "&units=" . $unitsFormat . "&APPID=" . $apikey;
			$jsonfile = file_get_contents($weatherurl);

			if ($jsonfile !== false){
				echo "$jsonfile";
			} else {
				echo '{"weather":[{"description":"Weather Unavailable","icon":"01n"}],"main":{"temp":255.372278}}';
			}
		?>
	</body>
</html>
