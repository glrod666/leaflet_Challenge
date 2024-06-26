// Create the map
var map = L.map('map').setView([20, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch the earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Function to determine marker size based on magnitude
        function markerSize(magnitude) {
            return magnitude * 4;
        }

        // Function to determine marker color based on depth
        function markerColor(depth) {
            return depth > 90 ? '#800026' :
                   depth > 70 ? '#BD0026' :
                   depth > 50 ? '#E31A1C' :
                   depth > 30 ? '#FC4E2A' :
                   depth > 10 ? '#FD8D3C' :
                                '#FEB24C';
        }

        // Loop through the earthquake data and create a marker for each earthquake
        data.features.forEach(feature => {
            var coordinates = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coordinates[2];

            var marker = L.circleMarker([coordinates[1], coordinates[0]], {
                radius: markerSize(magnitude),
                fillColor: markerColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // Add a popup to each marker
            marker.bindPopup(`<h3>${feature.properties.place}</h3>
                              <hr>
                              <p>Magnitude: ${magnitude}</p>
                              <p>Depth: ${depth} km</p>
                              <p>${new Date(feature.properties.time)}</p>`);
        });

        // Add a legend to the map
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend'),
                depths = [0, 10, 30, 50, 70, 90],
                labels = [];

            // Loop through depth intervals and generate a label with a colored square for each interval
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);
    })
    .catch(error => console.log(error));
