
let originalData = [];
let aggregatedData = [];

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

function filterRawTable() {
    const cycleFilter = document.getElementById('raw-cycleFilter').value;
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

document.addEventListener("DOMContentLoaded", function() {
    fetch('Candidates/Atkins/Data/atkins_contributions.json')
        .then(response => response.json())
        .then(data => {
            // Store raw data globally
            window.rawData = data;

            // Function to aggregate data
            const aggregateData = (data) => {
                return data.reduce((acc, contribution) => {
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
                        ContactType: contribution["Contact Type:"],
                        ReportId: contribution.ReportId,
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
            };

            // Aggregate initial data
            let aggregatedData = aggregateData(data);
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

            // Store the table instance globally for later use in filterTable
            window.aggTable = table;

            // Filter data by election year
            window.filterAggTable = function() {
                const selectedYearRange = document.getElementById("agg-cycleFilter").value;
                if (selectedYearRange === "all") {
                    aggTable.setData(Object.values(aggregateData(window.rawData))); // Show all data
                    return;
                }

                const [startYear, endYear] = selectedYearRange.split('-').map(Number);
                const filteredData = window.rawData.filter(contribution => {
                    const transactionDate = new Date(contribution["Transaction Date:"]);
                    const startDate = new Date(`${startYear}-05-04`);
                    const endDate = new Date(`${endYear}-05-05`);
                    return transactionDate >= startDate && transactionDate < endDate;
                });

                aggTable.setData(Object.values(aggregateData(filteredData)));
            };
        });
});


// Function to show the image corresponding to the selected election cycle
function filterImages() {
    var selectedCycle = document.getElementById("map-cycleFilter").value;
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