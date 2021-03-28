//Create Leaflet Map centered on Calgary
const map = L.map('leafletMap', {
  center: [51.0447, -114.0719],
  zoom:10.5,
});

//Add OSM Basemap
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWlra29yYW1vcyIsImEiOiJja2o4MTJicmcwNGF5MzBwN3c2eGpiajJhIn0.6u3ND0vC40NLgZfQJOvO2A'
}).addTo(map);


//Initialise the FeatureGroup to store editable layers
let editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

//Create new GeoJSON layer to store simplified lines
let processed = new L.geoJSON().addTo(map);

//Configure the toolbar options for leaflet-draw to enable only polyline drawing
const drawPluginOptions = {
  position: 'topleft',
  draw: {
    polyline: {
      shapeOptions: {
        color: '#C71585',
        weight: 5
      }
    },
    polygon : false,
    rectangle : false,
    circle : false,
    marker : false,
    circlemarker : false
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: false
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
let drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

// Create vars to hold the line data
let geoPolyLine, simplified;

//Save the map layer once the drawing is completed
map.on('draw:created', function(e) {
  let type = e.layerType, layer = e.layer;
  geoPolyLine = e.layer.toGeoJSON();
  editableLayers.addLayer(layer);
});

//When the button is clicked, simplify the line
document.getElementById('lineSimplify').addEventListener("click", function() {
  simplified = turf.simplify(geoPolyLine);
  console.log(simplified);
  processed.addData(simplified);
});

document.getElementById('lineClear').addEventListener("click", function() {
  processed.clearLayers();
  editableLayers.clearLayers();
});
