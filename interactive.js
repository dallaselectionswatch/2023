/*
    This file renders and manages the interactive elements of a mapbox fill-extrusion display
    The map corresponds to donations made to candidates for council positions in Dallas for the May 2023 election
*/



// define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1lcmNhZG8iLCJhIjoiY2xlcm1mZmxkMGNpMjN0cXRhOG5jNGxwaiJ9.rh22X-B5Eazk2f8AH11LLg';

// property key that stores zipcode in GeoJSON
ZIPCODE_PROPERTY_KEY = "ZCTA5CE10"

var FILL_OPACITY = 0.85
var MAX_ZIPCODE_CONTRIBUTION = 85000
var CENTER_OF_MAP = [-96.823081, 32.728088]
var ZOOM_LEVEL = 8.3;

// create map
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/imercado/clex4ooxe001201o2205su3eg/draft',
    pitch: 20,
    bearing: 0,
    center: CENTER_OF_MAP,
    zoom: ZOOM_LEVEL
});
map.addControl(new mapboxgl.NavigationControl());
/*
    candidate names must match those of labelIDs in mapbox
    candidates who do not have campFin data render an info box instead of campFin data
*/
var district_ballot = new Map([
 ["Mayor", ["EricJohnson"]],
 ['All Candidates' , ["JosephF.Miller", "AmandaSchulz", "PaulRidley","GayWillis", "PriscillaShacklett","CaraMendelsohn","JaynieSchultz", "CandyEvans","KathyStewart", "BrianHasenbauer", "SirranoKeithBaldeo", "ChrisCarter","KendraMadison", "PaulaBlackmon","SubrinaLynnBrenham", "Davante\"Shawt\"Peters", "TennellAtkins","TracyDotieHill", "AdamBazaldua", "MarvinECrenshaw", "OkemaThomas","TonyCarrillo", "OmarNarvaez", "SidneyRoblesMartinez", "MonicaRAlonzo","TerryPerkins", "JaimeResendez", "YolandaWilliams","CarolynArnold", "JamieSmith","JohnSims", "JoeTave", "ZarinGracey", "AugustDoyle", "DeniseBenavides","ChadWest", "AlbertMata", "FelixGriggs", "JesusMoreno", "SukhbirKaur"]],
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
var toggleableLayerIds = [
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

candidateInExcess = [
    {
        "Name" : "Chad West",
        "Amount" : 14498
    },
    {
        "Name" : "Okema Thomas",
        "Amount" : 2000
    },
    {
        "Name" : "Paula Blackmon",
        "Amount" : 10000
    },
    {
        "Name" : "Gay Willis",
        "Amount" : 1500
    }
]
committee_member_donor_dict = [
  {
    "Committee Member": "JONATHAN D SAXER",
    "Amount": 100,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "SHELBY L BOBOSKY",
    "Amount": 1000,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "ELIZABETH SCHRUPP",
    "Amount": 1000,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "SANA SYED",
    "Amount": 100,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "ROBERT F AGNICH",
    "Amount": 1000,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "PHILIP J SAHUC",
    "Amount": 200,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "MICKIE S BRAGALONE",
    "Amount": 1000,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "KRISTA FARBER WEINSTEIN",
    "Amount": 100,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "JIM NUGENT",
    "Amount": 1250,
    "Campaign": "WILLIS",
  },
  {
    "Committee Member": "MACEY DAVIS",
    "Amount": 2000,
    "Campaign": "WILLIS",
  },
  {
    "Committee Member": "BRIAN GRADY MCGAHAN",
    "Amount": 100,
    "Campaign": "RESENDEZ",
  },
  {
    "Committee Member": "MICHAEL PRZEKWAS",
    "Amount": 100,
    "Campaign": "MORENO",
  },
  {
    "Committee Member": "TODD C HOWARD",
    "Amount": 250,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "ROSANNE MILLS",
    "Amount": 103.48,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "WESLEY D KEYES",
    "Amount": 500,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "RAY A SMITH",
    "Amount": 200,
    "Campaign": "WILLIS",
  },
  {
    "Committee Member": "GAILYA SILHAN",
    "Amount": 200,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "GAY REVI",
    "Amount": 50,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "JOANNA L HAMPTON",
    "Amount": 250,
    "Campaign": "MORENO",
  },
  {
    "Committee Member": "LORIE BLAIR",
    "Amount": 150,
    "Campaign": "ATKINS",
  },
  {
    "Committee Member": "MELISSA RUSS KINGSTON",
    "Amount": 1000,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "BRENT RUBIN",
    "Amount": 1250,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "DERRIC PEGRAM",
    "Amount": 50,
    "Campaign": "NARVAEZ",
  },
  {
    "Committee Member": "BRANDON FRIEDMAN",
    "Amount": 201.99,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "JOHN MARK DAVIDSON",
    "Amount": 100,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "ANGELA KAYE KUTAC",
    "Amount": 100,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "ANJULIE PONCE",
    "Amount": 100,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "JOHN S HAZELTON",
    "Amount": 500,
    "Campaign": "WILLIS",
  },
  {
    "Committee Member": "LUCILO A PENA",
    "Amount": 500,
    "Campaign": "NARVAEZ",
  },
  {
    "Committee Member": "RODNEY SCHLOSSER",
    "Amount": 100,
    "Campaign": "MORENO",
  },
  {
    "Committee Member": "CARMEN R GARCIA",
    "Amount": 200,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "GLORIA M TARPLEY",
    "Amount": 1500,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "BETTY J CULBREATH",
    "Amount": 200,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "LINDSAY BILLINGSLEY",
    "Amount": 2500,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "KEN MONTGOMERY",
    "Amount": 100,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "MARY POSS",
    "Amount": 1000,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "STEVE IDOUX",
    "Amount": 5000,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "MARK MALVEAUX",
    "Amount": 5000,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "SUSAN C BOWMAN",
    "Amount": 50,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "DUPREE SCOVELL",
    "Amount": 750,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "KATHRYN BAZAN",
    "Amount": 350,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "PAULA DAY",
    "Amount": 257.94,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "PATTY COLLINS",
    "Amount": 200,
    "Campaign": "BAZALDUA",
  },
  {
    "Committee Member": "RYAN GARCIA",
    "Amount": 100,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "MARCY C HELFAND",
    "Amount": 1000,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "ANNE B HAGAN",
    "Amount": 500,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "BARBARA CLAY",
    "Amount": 450,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "THOMAS MILLS",
    "Amount": 250,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "CARL GINSBERG",
    "Amount": 1000,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "MATTHEW MCDOUGAL",
    "Amount": 350,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "DIANE SHERMAN",
    "Amount": 500,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "LARRY OFFUTT",
    "Amount": 500,
    "Campaign": "RESENDEZ",
  },
  {
    "Committee Member": "COURTNEY EMICH SPELLICY",
    "Amount": 100,
    "Campaign": "ATKINS",
  },
  {
    "Committee Member": "ELAINE VELVIN",
    "Amount": 50,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "AMY SCHAFFNER",
    "Amount": 75,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "HEATHER HORNOR",
    "Amount": 50,
    "Campaign": "BAZALDUA",
  },
  {
    "Committee Member": "ANNE HARDING",
    "Amount": 500,
    "Campaign": "WILLIS",
  },
  {
    "Committee Member": "DONNA DENISON",
    "Amount": 155.47,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "THOMAS RAY PERRYMAN",
    "Amount": 100,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "BETTY HOOEY",
    "Amount": 100,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "CHUCK NORCROSS",
    "Amount": 500,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "CALVERT S COLLINS-BRATTON",
    "Amount": 1000,
    "Campaign": "WILLIS",
  },
  {
    "Committee Member": "ARUN AGARWAL",
    "Amount": 15000,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "STEPHEN JEFFUS",
    "Amount": 50,
    "Campaign": "MCGOUGH",
  },
  {
    "Committee Member": "BENJAMIN SETNICK",
    "Amount": 500,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "JOE RYAN URBY",
    "Amount": 350,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "JOSEPH F PITCHFORD",
    "Amount": 1000,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "PETER HAN",
    "Amount": 1000,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "SHONCY RASPBERRY",
    "Amount": 500,
    "Campaign": "NARVAEZ",
  },
  {
    "Committee Member": "ANNETTE ANDERSON",
    "Amount": 600,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "MICHAEL QUEZADA",
    "Amount": 250,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "JASON L BROWN",
    "Amount": 500,
    "Campaign": "BAZALDUA",
  },
  {
    "Committee Member": "MICHAEL R HUBBARD",
    "Amount": 50,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "WILLIAM ZIMMERMAN",
    "Amount": 47.2,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "KYLE P WICK",
    "Amount": 332.2,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "KEVIN RACHEL",
    "Amount": 250,
    "Campaign": "WEST",
  },
  {
    "Committee Member": "JARED K. BURNETT",
    "Amount": 100,
    "Campaign": "MORENO",
  },
  {
    "Committee Member": "STACI F. REZNIK",
    "Amount": 625,
    "Campaign": "NARVAEZ",
  },
  {
    "Committee Member": "DEREK J SANDLER",
    "Amount": 100,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "OSCAR JOYNER",
    "Amount": 500,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "MIKE SIMS",
    "Amount": 1000,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "AMY W MONIER",
    "Amount": 500,
    "Campaign": "SCHULTZ",
  },
  {
    "Committee Member": "KAREN ROBERTS",
    "Amount": 51.99,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "ERIN PEAVEY",
    "Amount": 51.99,
    "Campaign": "RIDLEY",
  },
  {
    "Committee Member": "LEANDER T JOHNSON",
    "Amount": 350,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "SARAH P JACKSON",
    "Amount": 350,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "GARY KUTAC",
    "Amount": 100,
    "Campaign": "JOHNSON",
  },
  {
    "Committee Member": "STEVEN T RAMOS",
    "Amount": 250,
    "Campaign": "BLACKMON",
  },
  {
    "Committee Member": "SCOTT CHASE",
    "Amount": 100,
    "Campaign": "SCHULTZ",
  }
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

faq_dict = {
"What should I look for in the map?" : "Look for the dark blue parts of a candidate's funding map.The darker the blue, the more money that area donated to the campaign.",
"How do you gather the information on campaign finance?" : "Our primary data source is https://campfin.dallascityhall.com which is where records of campaign finance reports are stored by the City of Dallas.",
"How do you ensure the accuracy of the information you provide?" : "We drew data from the authoritative source, straight from Dallas' records. Dallas makes this data difficult to analyze, but we employed professional developers who have experience working at the top companies in the software industry. We reviewed our code consistently and persistently, which gives each team member the confidence to present our analysis to the public.",
"Are there any future plans or expansions for your project?" : "After the votes are counted and the city council members are placed in office, they will begin voting on key ordinances that affect more than just their respective district. We'll do our part to report any potential quid-pro-quo relationships between council-members and their out-of-district donors. We will also review who each council member nominates to voting positions throughout the many committees that decide on key funding, oversight, and urban planning for Dallas.",
}

document.addEventListener("DOMContentLoaded", function() {
  renderFAQ();
});

var table = new Tabulator("#excess-donations-table", {
    data:candidateInExcess,
    layout:"fitColumns",
    columns:[
        {title:"Council Member", field:"Name"},
        {title:"Amount ($)", field:"Amount"},
    ],
});

var table = new Tabulator("#committee-member-donors-table", {
    data: committee_member_donor_dict,
    layout:"fitColumns",
    columns:[
        {title:"Committee Member", field:"Committee Member"},
        {title:"Amount ($)", field:"Amount"},
        {title:"Council Member", field:"Campaign"},
    ],
});

function splitByCapitalLetter(name) {
    return name.split(/(?=[A-Z])/).join(" ")
}

function toggleMinimap(){
    var minimap = document.getElementById("minimap")
    var map = document.getElementById("map")
    var footer = document.getElementById("footer")

    if (minimap.style.display === "none") {
        minimap.style.display = "block";
        map.style.display = "none";
        footer.style.display = "none";

    } else {
        minimap.style.display = "none";
        map.style.display = "block";
        footer.style.display ="block";
    }
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
var defaultDistrictPrompt = "Select a District"
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
    var district = document.getElementById('district');
    var candidates = district_ballot.get(district.value)
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
    defaultOption.text = "Select a Candidate"
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
    var layer = document.getElementById('layer');
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
        ["case",["==",["get", candidateName],0],"#f5f1f0",["has", candidateName],["rgba",["-",200,["/",["*",200,["get",
         candidateName]],candidateToMaxContribution[candidateName]]],["-",255,["/",["*",200,["get", candidateName]],
         candidateToMaxContribution[candidateName]]],255,0.9],"#ffd2c1"]
        map.setPaintProperty(layer.value, 'fill-extrusion-color', color_gradient)
    }
}


function renderFAQ() {
    var faq_list = document.getElementById("faq")
    for (var q in faq_dict) {
        var question = document.createElement("h3");
        var answer = document.createElement("p");
        var faq_container = document.createElement("div");

        question.innerText = q;
        answer.innerText = faq_dict[q]
        faq_container.append(question)
        faq_container.append(answer)
        faq_list.append(faq_container)
    }
}

function toggle() {
  // Declare variable menu
  var menu = document.getElementById("side-menu");

  // toggle code
  if (menu.style.display === "block") {
    menu.style.display = "none";
  }
  else {
    menu.style.display = "block";
  }
}

function centerMap() {
    map.flyTo({center:CENTER_OF_MAP, zoom: ZOOM_LEVEL});
}

map.on('load', () => {
    map.getCanvas().style.cursor = 'default';

    // if mouse hovers over a zipcode, display their total contributions for the selected candidate
    map.on('mousemove', (event) => {
        layer = document.getElementById('layer')
        if (layer) {
            layerId = layer.value
            if (toggleableLayerIds.includes(layerId)){

              var zipcodes = map.queryRenderedFeatures(event.point, {
                  layers: [layerId]
              });

              document.getElementById('pd').innerHTML = zipcodes.length ?
                `
                    <p>
                        ${zipcodes[0].properties[ZIPCODE_PROPERTY_KEY]} donated a total of
                        $${zipcodes[0].properties[splitByCapitalLetter(layerId)]}
                        to ${splitByCapitalLetter(layerId)}'s campaign
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
