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

/*
    candidate names must match those of labelIDs in mapbox
    candidates who do not have campFin data render an info box instead of campFin data
*/
const district_ballot = new Map([
 ["Mayor", ["EricJohnson"]],
 ["District 1" , ["ChadWest", "AlbertMata", "FelixGriggs"]],
 ["District 2" , ["JesusMoreno", "SukhbirKaur"]],
 ["District 3" , ["JohnSims", "JoeTave", "ZarinGracey", "AugustDoyle", "DeniseBenavides"]],
 ["District 4" , ["CarolynArnold", "JamieSmith"]],
 ["District 5" , ["TerryPerkins", "JaimeResendez", "YolandaWilliams"]],
 ["District 6" , ["TonyCarrillo", "OmarNarvaez", "SidneyRoblesMartinez", "MonicaRAlonzo"]],
 ["District 7" , ["TracyDotieHill", "AdamBazaldua", "MarvinECrenshaw", "OkemaThomas"]],
 ["District 8" , ["SubrinaLynnBrenham", "Davante\"Shawt\"Peters", "TennellAtkins"]],
 ["District 9" , ["KendraMadison", "PaulaBlackmon"]],
 ["District 10" , ["KathyStewart", "BrianHasenbauer", "SirranoKeithBaldeo", "ChrisCarter"]],
 ["District 11" , ["JaynieSchultz", "CandyEvans"]],
 ["District 12" , ["CaraMendelsohn"]],
 ["District 13" , ["GayWillis", "PriscillaShacklett"]],
 ["District 14" , ["JosephF.Miller", "AmandaSchulz", "PaulRidley"]]
])

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

function splitByCapitalLetter(name) {
    return name.split(/(?=[A-Z])/).join(" ")
}

function toggleMenu(){
    var menu = document.getElementById("features")
    if (menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

// create dropdown element to display the candidates
var district_menu = document.createElement("select");
district_menu.onchange = "renderCandidateMenu()"
district_menu.id = "district"

// set a default prompt for dropdown
var defaultDistrict = document.createElement("option");
var defaultDistrictPrompt = "District"
defaultDistrict.text = defaultDistrictPrompt
district_menu.appendChild(defaultDistrict)
document.getElementById("districtContainer").appendChild(district_menu)

district_ballot.forEach((_value, key) => {
    var option = document.createElement("option");
    option.text = key
    option.id = key
    option.value = key
    district_menu.add(option);
})

function renderCandidateMenu(){
    const district = document.getElementById('district');
    const candidates = district_ballot.get(district.value)
    // create dropdown element to display the candidates
    var candidateMenu
    if (document.getElementById("layer")) {
        candidateMenu = document.getElementById("layer")
        document.getElementById('layer').options.length = 0;
    } else{
        candidateMenu = document.createElement("select");
        candidateMenu.onchange = "renderLayer()"
        candidateMenu.id = "layer"
    }


    // set a default prompt for dropdown
    var defaultOption = document.createElement("option");
    defaultOption.text = "Candidate"
    candidateMenu.appendChild(defaultOption)

    var promptLabel = document.createElement("label")
    promptLabel.for = "menu"
    document.getElementById("candidateContainer").appendChild(candidateMenu)
    candidateMenu.appendChild(promptLabel)

    // add each candidate to dropdown element
    for (x in candidates) {
        var option = document.createElement("option");
        option.text = splitByCapitalLetter(candidates[x])
        option.id = candidates[x]
        option.value = candidates[x]
        candidateMenu.add(option);
    }
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
    // check if selected candidate has an existing layer
    if (toggleableLayerIds.includes(layer.value)) {
        map.setLayoutProperty(layer.value, 'visibility', 'visible')
        candidateName = splitByCapitalLetter(layer.value)

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
}


// create map
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/imercado/clex4ooxe001201o2205su3eg/draft',
    pitch: 20,
    bearing: 0,
    center: [-97.197796, 32.767012],
    zoom: 8.5
});

// wait for map to load before adjusting it
map.on('load', () => {
    // make a pointer cursor
    map.getCanvas().style.cursor = 'default';

    // if mouse hovers over a zipcode, display their total contributions for the selected candidate
    map.on('mousemove', (event) => {
        layer = document.getElementById('layer')
        if (layer) {
            layerId = layer.value
            if (toggleableLayerIds.includes(layerId)){

              const zipcodes = map.queryRenderedFeatures(event.point, {
                  layers: [layerId]
              });

              document.getElementById('pd').innerHTML = zipcodes.length ?
                `<h3> </h3>
                      <p>
                        ${zipcodes[0].properties[ZIPCODE_PROPERTY_KEY]} donated
                        <strong>
                            $${zipcodes[0].properties[splitByCapitalLetter(layerId)]}
                        </strong>to ${splitByCapitalLetter(layerId)}'s campaign
                      </p>`:
                `<p>Hover over a zipcode!</p>`;
            } else {
                document.getElementById('pd').innerHTML = `<p>This candidate did not submit campaign finance records to
                    <a href="https://campfin.dallascityhall.com/">Dallas City Hall</a>
                </p>`
            }
        }

    });
});
