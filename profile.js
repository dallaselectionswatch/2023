
let originalData = [];


document.addEventListener("DOMContentLoaded", function() {
    fetch('Candidates/Atkins/Data/atkins_contributions.json')
        .then(response => response.json())
        .then(data => {
            originalData = data;
            // Initialize Tabulator table with fetched data
            var table = new Tabulator("#top-contributors-table", {
                data: data,
                layout: "fitColumns",
                columns: [
                    { title: "Contributor", field: "Name" },
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
