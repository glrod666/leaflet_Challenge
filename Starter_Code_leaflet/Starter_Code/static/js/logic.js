//  map centered on a specific location and zoom level
var map = L.map('map').setView([37.7749, -122.4194], 5);  // Centered on San Francisco, CA

//  tile layer to the map (This is the base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
  // Define a function to set the style of each marker
  function styleInfo(feature) {
    return {
      radius: getRadius(feature.properties.mag),
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.7
    };
  }

  // Define a function to determine the radius of the earthquake marker based on its magnitude
  function getRadius(magnitude) {
    return magnitude ? magnitude * 4 : 1;
  }

  // Define a function to determine the color of the marker based on the earthquake's depth
  function getColor(depth) {
    return depth > 90 ? "#ea2c2c" :
           depth > 70 ? "#ea822c" :
           depth > 50 ? "#ee9c00" :
           depth > 30 ? "#eecc00" :
           depth > 10 ? "#d4ee00" :
                        "#98ee00";
  }

  // Add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2] + " km");
    }
  }).addTo(map);

  // Create a legend and add it to the map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 10, 30, 50, 70, 90],
        colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    div.innerHTML += "<h4>Depth Legend</h4>";

    for (var i = 0; i < depths.length; i++) {
      var depthLabel = depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km');
      div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + depthLabel + '<br>';
    }

    return div;
  };

  legend.addTo(map);
});
