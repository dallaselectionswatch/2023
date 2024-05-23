
let originalData = [];


document.addEventListener("DOMContentLoaded", function() {
    fetch('Candidates/Atkins/Data/atkins_contributions.json')
        .then(response => response.json())
        .then(data => {
            originalData = data;
            // Initialize Tabulator table with fetched data
            var table = new Tabulator("#all-contributors-table", {
                data: data,
                layout: "fitColumns",
                columns: [
                    { title: "Contributor", field: "Name", headerFilter: "input"},
                    { title: "Amount ($)", field: "Amount:" },
                    { title: "Candidate", field: "Cand/Committee:" },
                    { title: "Transaction Date", field: "Transaction Date:" },
                ],
            });
            // Store the table instance globally for later use in filterTable
            window.table = table;
        })
});

function filterTable() {
    const cycleFilter = document.getElementById('cycleFilter').value;
    let filteredData = [];

    if (cycleFilter === 'all') {
        filteredData = originalData;
    } else {
        const [startYear, endYear] = cycleFilter.split('-').map(year => parseInt(year.trim()));

        const startDate = new Date(startYear, 4, 5); // May 5 of start year
        const endDate = new Date(endYear, 4, 4, 23, 59, 59, 999); // May 4 of end year, end of the day

        filteredData = originalData.filter(item => {
            const transactionDate = new Date(item["Transaction Date:"]);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }

    // Update the table data
    window.table.setData(filteredData);
}

// Download button event listener
document.getElementById('download-csv').addEventListener('click', function() {
    window.table.download("csv", "filtered_data.csv");
});

// Function to show the image corresponding to the selected election cycle
function filterImages() {
    var selectedCycle = document.getElementById("mapCycleFilter").value;
    var images = document.querySelectorAll("#image-container img");
    images.forEach(function(img) {
        img.classList.remove("active");
        if (img.id === "img-" + selectedCycle) {
            img.classList.add("active");
        }
    });
}

// Show the default image on page load
document.addEventListener("DOMContentLoaded", function() {
    filterImages();
});

document.addEventListener("DOMContentLoaded", function() {
    fetch('Candidates/Atkins/Data/atkins_contributions.json')
        .then(response => response.json())
        .then(data => {
            contributions = data;
            // Initialize Tabulator table with fetched data

    // Normalize names and aggregate amounts
    const aggregatedData = contributions.reduce((acc, contribution) => {
        const normalizedName = contribution.Name.toLowerCase();
        if (!acc[normalizedName]) {
            acc[normalizedName] = {
                Amount: 0,
                Campaign: contribution["Cand/Committee:"],
                Name: contribution.Name, // Keep the original name for display
                Address: contribution.Address,
                children: [] // Initialize the children array for transactions
            };
        }
        acc[normalizedName].Amount += contribution["Amount:"];
        acc[normalizedName].children.push({
                ContactType: contribution["Contact Type"],
                ReportId: contribution["ReportId"],
                Amount: contribution["Amount:"],
                Campaign: contribution["Cand/Committee:"],
                TransactionDate: contribution["Transaction Date:"],
                Latitude: contribution.Latitude,
                Longitude: contribution.Longitude,
                Name: contribution.Name, // Keep the original name for display
                Address: contribution.Address
        });
        return acc;
    }, {});

    const tableData = Object.values(aggregatedData);

    // Initialize Tabulator table with tree structure
    const table = new Tabulator("#aggregated-contributions-table", {
        data: tableData,
        layout: "fitColumns",
        columns: [
            { title: "Contributor", field: "Name", headerFilter: "input" },
            { title: "Amount ($)", field: "Amount" },
            { title: "Candidate", field: "Campaign" },
            { title: "Transaction Date", field: "TransactionDate" },
        ],
        // Enable tree structure
        dataTree: true,
        dataTreeStartExpanded: false, // Start with tree collapsed
        dataTreeChildField: "children", // Specify the field that contains the children array
        dataTreeBranchElement: "<span style='color:blue;'>&#x25B6;</span>" // Custom branch element for expanded rows
    });
});

});
