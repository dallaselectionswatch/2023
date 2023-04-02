/*
    This file renders and manages the interactive elements of a mapbox fill-extrusion display
    The map corresponds to donations made to candidates for council positions in Dallas for the May 2023 election
*/



// define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1lcmNhZG8iLCJhIjoiY2xlcm1mZmxkMGNpMjN0cXRhOG5jNGxwaiJ9.rh22X-B5Eazk2f8AH11LLg';

// property key that stores zipcode in GeoJSON
ZIPCODE_PROPERTY_KEY = "ZCTA5CE10"

FILL_OPACITY = 0.85
MAX_ZIPCODE_CONTRIBUTION = 85000

// corresponds to layer ID found on MapboxGL
/*
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
*/
const toggleableLayerIds = [
    "ChadWest",
    "MonicaRAlonzo",
    "AlbertMata",
    "MarianaGriggs",
]

candidateToMaxContribution = {
    "Chad West" : 36228,
    "Tennell Atkins" : 2000,
    "Adam Bazaldua" : 5300,
    "Paula Blackmon" : 23225,
    "Eric Johnson" : 75400,
    "Kathy Stewart" : 16700,
    "Jesus Moreno" : 4000,
    "Cara Mendelsohn" : 8000,
    "Omar Narvaez" : 4000,
    "Gay Willis" : 5930,
    "Jaynie Schultz" : 3880,
    "Brian Hasenbauer": 602,
    "Jaime Resendez" : 2000,
    "Paul Ridley" : 3500,
    "Okema Thomas" : 6000,
    "Monica R Alonzo" : 6000,
    "Carolyn Arnold" : 1000,
    "Albert Mata" : 2000
}

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
var defaultPrompt = "Candidate"
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
    option.text = layerIdToCandidateName[toggleableLayerIds[x]]
    option.id = toggleableLayerIds[x]
    option.value = toggleableLayerIds[x]
    menuElement.add(option);
}

// clear the map of all layers
function vanishAllLayers() {
    for (x in toggleableLayerIds) {
        if(x != "MarianaGriggs"){
            map.setLayoutProperty(toggleableLayerIds[x], 'visibility', 'none')
        }
    }
}

// make selected candidate layer visible
function renderLayer() {
    const layer = document.getElementById('layer');
    vanishAllLayers()
    map.setLayoutProperty(layer.value, 'visibility', 'visible')
    candidateName = layerIdToCandidateName[layer.value]

    /*
        R = G = 255 - 200 * contribution / maxContribution
        B = 255
        A = Opacity
    */
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
        "rgba",
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
            candidateToMaxContribution[candidateName]
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
            candidateToMaxContribution[candidateName]
          ]
        ],
        255,
        0.9
      ],
      "#ffd2c1"
    ]
    map.setPaintProperty(layer.value, 'fill-extrusion-color', color_gradient)
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
          if (layerIdToCandidateName[layerId] == "Mariana Griggs") {
            console.log(layerIdToCandidateName[layerId])
            document.getElementById('pd').innerHTML =`<p>This candidate has not submitted campaign finance records to
             <a href="https://campfin.dallascityhall.com/">Dallas City Hall CampFin</a></p></p>`;
          }
          else {
            document.getElementById('pd').innerHTML = zipcodes.length
              ? `<h3> </h3>
                  <p>
                    ${zipcodes[0].properties[ZIPCODE_PROPERTY_KEY]} donated
                    <strong>
                        $${zipcodes[0].properties[layerIdToCandidateName[layerId]]}
                    </strong>to ${layerIdToCandidateName[layerId]}'s campaign
                  </p>`
              : `<p>Hover over a zipcode!</p>`;
          }

        }
    });
});
