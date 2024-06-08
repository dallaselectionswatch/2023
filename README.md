# Dallas Campaign Finance Oversight

## Users
***
### Purpose
This repo will serve as a reliable source of campaign finance data for the Dallas city council.

### Data Sources
1. https://campfin.dallascityhall.com/
2. https://egis.dallascityhall.com/resources/shapefileDownload.aspx

### What have we done to this data?
This data has been taken from the records provided by the City of Dallas and has been validated and collected into datasets for each city council-person.
- Duplicate records have been removed
- Addresses have been geocoded into lat/long coordinates
- Donors who make multiple financial contributions have been identified and their donations have been summed per election year.


## Developers
***
This site currently uses vanilla JS, HTML, and CSS.

However, this project is in the process of being modernized toward a MERN framework

### How to get a local system running
1. git clone the repo
2. navigate to the root directory of this git project
3. set up a python simple http server with `python3 -m http.server 8000`
4. open a browser to localhost:8000

### Next Features
1. Aggregate contributions by name
2. Compare the aggregated dataset to the contribution limit per election cycle
3. Publish a total sum of above-limit contributions in the highlights section of each candidate
4. (Spike) District Map Shapefiles: Figure out how to differentiate between districts
5. Determine the ratio of in-district vs out-of-district contributions
6. (Spike) District Map Shapefile Visuals: Figure out the best way to display the ratios
7. Import the expenses datasets for each council member
8. Display a sum of all expenses in the highlights section of each council member
9. Display the expenses data alongside contributions data in timeline graph


### Idea: Aggregation by Address
- Consider aggregating by address first
- Determine the unique names present in each address bucket
- Intra-bucket comparison to consolidate names and identify aliases
- Inter-bucket comparison to match aliases used by different addresses to aliases used in other buckets
  - AKA: consolidate records of donors who use different addresses