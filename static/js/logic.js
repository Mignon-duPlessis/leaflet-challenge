var map = L.map("map").setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=G18kR4B5cKkYaH1F1cW3',
    {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }
    
).addTo(map);


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    function styleInfo(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    function getColor(magnitude) {
        return magnitude > 5 ? '#016c59' :
               magnitude > 4  ? '#1c9099' :
               magnitude > 3 ? '#67a9cf' :
               magnitude > 2  ? '#a6bddb' :
               magnitude > 1   ? '#d0d1e6' :
                                '#f6eff7';
    }

    function getRadius(magnitude) {
        return magnitude * 4;
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<br/><b>Magnitude:<b>   ' + feature.properties.mag +
                '<br/><b>Location:<b>  ' + feature.properties.place);

        }
    }).addTo(map)

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            color = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < color.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(color[i] + 1) + '"></i> ' +
                color[i] + (color[i + 1] ? '&ndash;' + color[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});
















