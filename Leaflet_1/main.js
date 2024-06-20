// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5); // Centered on San Francisco

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the GeoJSON object
var earthquakeData = {
  "type": "FeatureCollection",
  "metadata": {
    "generated": 1718918907000,
    "url": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson",
    "title": "USGS Significant Earthquakes, Past Day",
    "status": 200,
    "api": "1.10.3",
    "count": 0
  },
  "features": []
};

// Directly call createFeatures with the static data
createFeatures(earthquakeData.features);

// Create features for the earthquake data
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

// Function to get color based on depth
function getColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' :
                        '#1a9850';
}

// Add a legend to the map
var legend = L.control({ position: 'bottomright' });

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

{
    type: "FeatureCollection",
    metadata: {
      generated: Long Integer,
      url: String,
      title: String,
      api: String,
      count: Integer,
      status: Integer
    },
    bbox: [
      minimum longitude,
      minimum latitude,
      minimum depth,
      maximum longitude,
      maximum latitude,
      maximum depth
    ],
    features: [
      {
        type: "Feature",
        properties: {
          mag: Decimal,
          place: String,
          time: Long Integer,
          updated: Long Integer,
          tz: Integer,
          url: String,
          detail: String,
          felt:Integer,
          cdi: Decimal,
          mmi: Decimal,
          alert: String,
          status: String,
          tsunami: Integer,
          sig:Integer,
          net: String,
          code: String,
          ids: String,
          sources: String,
          types: String,
          nst: Integer,
          dmin: Decimal,
          rms: Decimal,
          gap: Decimal,
          magType: String,
          type: String
        },
        geometry: {
          type: "Point",
          coordinates: [
            longitude,
            latitude,
            depth
          ]
        },
        id: String
      },
      …
    ]
  }