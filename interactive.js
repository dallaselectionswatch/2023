// corresponds to layer ID found on MapboxGL

// define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1lcmNhZG8iLCJhIjoiY2xlcm1mZmxkMGNpMjN0cXRhOG5jNGxwaiJ9.rh22X-B5Eazk2f8AH11LLg';

// property key that stores zipcode in GeoJSON
zipcode_property_key = "ZCTA5CE10"

const toggleableLayerIds = [
    "ChadWest",
    "EricJohnson",
    "TennellAtkins",
    "PaulRidley",
    "AlbertMata",
    "GayWillis",
    "JaynieSchultz",
    "CaraMendelsohn",
    "PaulaBlackmon",
    "OmarNarvaez",
    "OkemaThomas",
    "KathyStewart",
    "MonicaRAlonzo",
    "JesusMoreno",
    "AndreTurner",
    "AdamBazaldua",
    "CarolynArnold",
    "BrianHasenbauer"]

/*
key - layerID
value - candidate name
*/
const layerIdToCandidateName = {}
for (id in toggleableLayerIds) {
    key = toggleableLayerIds[id]
    // Put a space between every capital letter
    value = key.split(/(?=[A-Z])/).join(" ")
    layerIdToCandidateName[key] = value
}

// create dropdown element
var menuElement = document.createElement("select");
menuElement.onchange = "renderLayer()"
menuElement.id = "layer"

// set a default prompt for dropdown
var defaultOption = document.createElement("option");
var defaultPrompt = "---Select a Candidate---"
defaultOption.style = "display:none"
defaultOption.text = defaultPrompt
menuElement.appendChild(defaultOption)

var promptLabel = document.createElement("label")
promptLabel.for = "menu"
promptLabel.innerHTML = "Select a Candidate"
document.getElementById("menuContainer").appendChild(menuElement)
menuElement.appendChild(promptLabel)

// add each candidate to dropdown element
for (x in toggleableLayerIds) {
var option = document.createElement("option");
option.text = toggleableLayerIds[x]
option.id = toggleableLayerIds[x]
option.value = toggleableLayerIds[x]
menuElement.add(option);
}

// clear the map of all layers
function vanishAllLayers() {
    for (x in toggleableLayerIds) {
      map.setLayoutProperty(toggleableLayerIds[x], 'visibility', 'none')
    }
}


// make selected candidate layer visible
function renderLayer() {
    const layer = document.getElementById('layer');
    vanishAllLayers()
    map.setLayoutProperty(layer.value, 'visibility', 'visible')
    candidateName = layerIdToCandidateName[layer.value]
    color_gradient =
    [
      "case",
      [
        "==",
        ["get", candidateName],
        0
      ],
      "#f5f1f0",
      ["has", candidateName],
      [
        "rgb",
        [
          "-",
          200,
          [
            "/",
            [
              "*",
              200,
              ["get", candidateName]
            ],
            24000
          ]
        ],
        [
          "-",
          255,
          [
            "/",
            [
              "*",
              200,
              ["get", candidateName]
            ],
            24000
          ]
        ],
        255
      ],
      "#ffd2c1"
    ]
    map.setPaintProperty(layer.value, 'fill-extrusion-color', color_gradient)
    map.setPaintProperty(layer.value, 'raster-opacity', 0.8)
}


// create map
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/imercado/clex4ooxe001201o2205su3eg/draft',
    pitch: 70,
    bearing: 0,
    center: [-97.010, 32.800],
    zoom: 9.7
});

// wait for map to load before adjusting it
map.on('load', () => {
    // make a pointer cursor
    map.getCanvas().style.cursor = 'default';

    // if mouse hovers over a zipcode, display their total contributions for the selected candidate
    map.on('mousemove', (event) => {
        layerId = document.getElementById('layer').value
        if (layerId != defaultPrompt){
          const zipcodes = map.queryRenderedFeatures(event.point, {
              layers: [layerId]
          });

          /*
          ZCTA5CE10 - property in GeoJSON object that stores the corresponding zipcode
          candidate name - property in GeoJSON object that stores the total contributions from that zipcode
          */
          document.getElementById('pd').innerHTML = zipcodes.length
          ? `<h3> </h3>
              <p>
                ${zipcodes[0].properties[zipcode_property_key]} donated
                <strong>
                <em>
                    $${zipcodes[0].properties[layerIdToCandidateName[layerId]]}
                </strong>to ${layerIdToCandidateName[layerId]}'s campaign
                </em>
              </p>`
          : `<p>Hover over a zipcode!</p>`;
        }
    });
});
