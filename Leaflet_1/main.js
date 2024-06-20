// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5); // Centered on San Francisco

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

fetch(earthquakeUrl)
    .then(response => response.json())
    .then(data => {
        createFeatures(data.features);
    });

    function createFeatures(earthquakeData) {
        function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
    
        function pointToLayer(feature, latlng) {
            var geojsonMarkerOptions = {
                radius: feature.properties.mag * 3,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    
        var earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature,
            pointToLayer: pointToLayer
        });
    
        earthquakes.addTo(map);
    }
    
    function getColor(depth) {
        return depth > 90 ? '#d73027' :
               depth > 70 ? '#fc8d59' :
               depth > 50 ? '#fee08b' :
               depth > 30 ? '#d9ef8b' :
               depth > 10 ? '#91cf60' :
                            '#1a9850';
    }


    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];

        div.innerHTML += '<strong>Depth</strong><br>';
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(map);

    