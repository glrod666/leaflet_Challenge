// Check if Leaflet and D3 libraries are loaded
if (typeof L === 'undefined' || typeof d3 === 'undefined') {
    console.error('Leaflet or D3 libraries not loaded.');
} else {
    // Set up the map
    var map = L.map('map').setView([20, 0], 2);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fetch the earthquake data
    d3.json("static/data/all_week.geojson").then(function(data) {
        // Define a function to style each feature
        function style(feature) {
            return {
                fillColor: getColor(feature.geometry.coordinates[2]),
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7,
                radius: getRadius(feature.properties.mag)
            };
        }

        // Define a function to get color based on depth
        function getColor(depth) {
            return depth > 90 ? '#800026' :
                   depth > 70 ? '#BD0026' :
                   depth > 50 ? '#E31A1C' :
                   depth > 30 ? '#FC4E2A' :
                   depth > 10 ? '#FD8D3C' :
                                '#FEB24C';
        }

        // Define a function to get radius based on magnitude
        function getRadius(magnitude) {
            return magnitude ? magnitude * 4 : 1;
        }

        // Define a function for onEachFeature
        function onEachFeature(feature, layer) {
            if (feature.properties && feature.properties.place) {
                layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");
            }
        }

        // Create a GeoJSON layer with the data
        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        // Add a legend to the map
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                depths = [0, 10, 30, 50, 70, 90],
                labels = [];

            // loop through our depth intervals and generate a label with a colored square for each interval
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);
    }).catch(function(error) {
        console.error('Error fetching data:', error);
    });
}