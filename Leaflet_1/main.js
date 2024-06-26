var map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

3. **Fetch and Process the Earthquake Data**:
   - Use D3 to fetch the GeoJSON data.
   - Create functions to determine marker size and color based on magnitude and depth.

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function(data) {
  
  function getColor(depth) {
    return depth > 100 ? '#800026' :
           depth > 50  ? '#BD0026' :
           depth > 20  ? '#E31A1C' :
           depth > 10  ? '#FC4E2A' :
           depth > 0   ? '#FD8D3C' :
                         '#FEB24C';
  }

  function getRadius(magnitude) {
    return magnitude * 4;
  }

  function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.place && feature.properties.mag) {
      layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");
    }
  }

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  }).addTo(map);

  // Add legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 10, 20, 50, 100],
        labels = [];

    div.innerHTML += '<strong>Depth (km)</strong><br>';

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
});