//globals
let placeNameNode = document.getElementById("placename");
let latlngNode = document.getElementById("ltlng");
let windNode = document.getElementById("wind");
let humidityNode = document.getElementById("humidity");
let tempratureNode = document.getElementById("temp")

let mainWeatherNode = document.getElementById("im")
let mainWeatherClimateNameNode = document.getElementById("default_climate_name")

let climates = {
    "clear sky": "./svg/wi-cloud.svg",
    "few clouds": "./svg/wi-cloudy.svg",
    "scattered clouds": "./svg/wi-cloudy-gusts.svg",
    "broken clouds": "./svg/wi-smog.svg",
    "shower rain": ".svg/wi-showers.svg",
    "rain": ".svg/wi-rain.svg",
    "thunderstorm": ".svg/wi-thunderstorm.svg",
    "snow": "./svg/wi-snow-wind.svg",
    "mist": "./svg/wi-fog.svg"
}

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
    })
});

map.on('singleclick', function (evt) {
    let latlng = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    // placeMarker(latlng)
    main(latlng);
})

function main(latlng) {
    let urlToFetch = `https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=d1dd19772a6142d9c438357ee4f10cd5`

    fetch(urlToFetch)
        .then(res => res.json())
        .then(ParsetheResponse)
        .then(visuvalizeData)
        .catch(e => {
            alert("No data Found!")
        })
}

function ParsetheResponse(res) {
    let placename = res.name ? res.name : "No Data Found";
    let coords = [res.coord.lat, res.coord.lng] ? res.coord : "No Data Found"
    let windSpeed = res.wind.speed ? res.wind.speed : "0"
    let humidity = res.main.humidity ? res.main.humidity : "0"
    let tempratue = res.main.temp ? res.main.temp : "0"

    let mainWeatherImgPath = climates[res.weather[0].description] ? climates[res.weather[0].description] : "./svg/wi-cloud.svg"
    let mainWeatherDescription = res.weather[0].description ? res.weather[0].description : "No Data"

    return {
        placename: placename,
        coords: coords,
        windSpeed: windSpeed,
        humidity: humidity,
        tempratue: tempratue,
        mainWeatherImgPath: mainWeatherImgPath,
        mainWeatherDescription: mainWeatherDescription
    };
}

function visuvalizeData(dataObj) {
    placeNameNode.innerText = "Place Name :" + dataObj.placename;
    latlngNode.innerText = "Lat Lng :" + dataObj.coords.lon + " " + dataObj.coords.lat
    windNode.innerText = dataObj.windSpeed
    humidityNode.innerText = dataObj.humidity
    tempratureNode.innerText = dataObj.tempratue
    mainWeatherNode.setAttribute("src", dataObj.mainWeatherImgPath)
    mainWeatherClimateNameNode.innerText = dataObj.mainWeatherDescription
}

var markers;
var icon;
function init() {
    markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var size = new OpenLayers.Size(21, 25);
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);

    icon = new OpenLayers.Icon('http://dev.openlayers.org/img/marker.png', size, offset);

    map.addLayer(new OpenLayers.Layer.OSM());
    map.zoomToMaxExtent();

    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();

}
