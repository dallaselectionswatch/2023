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

const district_ballot = {
 "District 1" : ["Chad West", "Albert Mata", "Felix Mariana Griggs"],
 "District 2" : ["Jesus Moreno", "Sukhbir Kaur"],
 "District 3" : ["John Sims", "Joe Tave", "Zarin Gracey", "August Doyle", "Denise Benavides"],
 "District 4" : ["Carolyn King Arnold", "Jamie Smith"],
 "District 5" : ["Terry Perkins", "Jaime Resendez", "Yolanda Faye Williams"],
 "District 6" : ["Tony Carrillo", "Omar Narvaez", "Sidney Robles Martinez", "Monica R Alonzo"],
 "District 7" : ["Tracy Dotie Hill", "Adam Bazaldua", "Marvin E Crenshaw", "Okema Thomas"],
 "District 8" : ["Subrina Lynn Brenham", "Davante \"Shawt\" Peters", "Tennell Atkins"],
 "District 9" : ["Kendra Denise Madison", "Paula Blackmon"],
 "District 10" : ["Kathy Stewart", "Brian Hasenbauer", "Sirrano Keith Baldeo", "Chris Carter"],
 "District 11" : ["Jaynie Schultz", "Candace Evans"],
 "District 12" : ["Cara Mendelsohn"],
 "District 13" : ["Gay Donnell Willis", "Priscilla Shacklett"],
 "District 14" : ["Joseph F. Miller", "Amanda Schulz", "Paul E. Ridley"]
}

// corresponds to layer ID found on MapboxGL
const toggleableLayerIds = [
    "ChadWest",
    "AlbertMata",
    "FelixGriggs",

    "JesusMoreno",

    "JoeTave",
    "JohnSims",
    "ZarinGracey",
    "AugustDoyle",

    "CarolynArnold",
    "JamieSmith",

    "YolandaWilliams",

    "OmarNarvaez",
    "MonicaRAlonzo",
    "SidneyRoblesMartinez",

    "AdamBazaldua",
    "OkemaThomas",

    "EricJohnson",

    "TennellAtkins",

    "KendraMadison",
    "PaulaBlackmon",

    "KathyStewart",
    "BrianHasenbauer",
    "ChrisCarter",

    "CandyEvans",
    "JaynieSchultz",

    "CaraMendelsohn",

    "GayWillis",
    "PriscillaShacklett",

    "PaulRidley",
    "KendalRichardson",
    "AmandaSchulz"
]

candidateToMaxContribution = {
    "Chad West" : 44425,
    "Tennell Atkins" : 7750,
    "Adam Bazaldua" : 5800,
    "Paula Blackmon" : 28675,
    "Eric Johnson" : 84150,
    "Kathy Stewart" : 20200,
    "Jesus Moreno" : 5075,
    "Cara Mendelsohn" : 6000,
    "Omar Narvaez" : 8450,
    "Gay Willis" : 15205,
    "Jaynie Schultz" : 52383,
    "Brian Hasenbauer": 2504,
    "Jaime Resendez" : 2000,
    "Paul Ridley" : 14145,
    "Okema Thomas" : 4000,
    "Monica R Alonzo" : 8000,
    "Carolyn Arnold" : 1800,
    "Albert Mata" : 7140,
    "Candy Evans" : 5216,
    "Zarin Gracey" : 7750,
    "John Sims" : 2000,
    "Joe Tave" : 1000,
    "Kendra Madison" : 750,
    "August Doyle" : 400,
    "Yolanda Williams" : 4000,
    "Priscilla Shacklett" : 3000,
    "Chris Carter" : 4000,
    "Felix Griggs" : 2200,
    "Amanda Schulz" : 3450,
    "david allen" : 100,
    "Sidney Robles Martinez" : 250,
    "Jamie Smith" : 4000,
    "Kendal Richardson" : 20
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

// create dropdown element to display the candidates
var candidateMenu = document.createElement("select");
candidateMenu.onchange = "renderLayer()"
candidateMenu.id = "layer"

// set a default prompt for dropdown
var defaultOption = document.createElement("option");
var defaultPrompt = "Candidate"
defaultOption.text = defaultPrompt
candidateMenu.appendChild(defaultOption)

var promptLabel = document.createElement("label")
promptLabel.for = "menu"
promptLabel.innerHTML = "Select a Candidate"
document.getElementById("menuContainer").appendChild(candidateMenu)
candidateMenu.appendChild(promptLabel)

// add each candidate to dropdown element
for (x in toggleableLayerIds) {
    var option = document.createElement("option");
    option.text = layerIdToCandidateName[toggleableLayerIds[x]]
    option.id = toggleableLayerIds[x]
    option.value = toggleableLayerIds[x]
    candidateMenu.add(option);
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

          document.getElementById('pd').innerHTML = zipcodes.length ?
            `<h3> </h3>
                  <p>
                    ${zipcodes[0].properties[ZIPCODE_PROPERTY_KEY]} donated
                    <strong>
                        $${zipcodes[0].properties[layerIdToCandidateName[layerId]]}
                    </strong>to ${layerIdToCandidateName[layerId]}'s campaign
                  </p>`:
            `<p>Hover over a zipcode!</p>`;


        }
    });
});
