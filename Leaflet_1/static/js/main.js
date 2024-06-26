// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data and add to the map
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            }
        }).addTo(map);
    });

// Function to determine color based on depth
function getColor(depth) {
    return depth > 90 ? '#FF0000' :
           depth > 70 ? '#FF4500' :
           depth > 50 ? '#FF8C00' :
           depth > 30 ? '#FFA500' :
           depth > 10 ? '#FFD700' :
                        '#FFFF00';
}

// Function to calculate radius based on magnitude
function getRadius(magnitude) {
    return magnitude * 4;
}

// Add legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 10, 30, 50, 70, 90],
        labels = [];
        
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map)