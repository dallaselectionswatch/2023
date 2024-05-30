# Dallas Campaign Finance Oversight

## Purpose
This repo will serve as a reliable source of campaign finance data for the Dallas city council and mayor's office.

## Data Sources
1. https://campfin.dallascityhall.com/
2. https://egis.dallascityhall.com/resources/shapefileDownload.aspx

## What have we done to this data?
This data has been taken from the aforementioned authoritative source and has been validated, verified, and aggregated into collections for each city council-person.
- Duplicate records have been removed
- Addresses have been geocoded into lat/long coordinates
- Donors who make multiple financial contributions have been identified and their donations have been summed per election year.

## Developers
This site currently uses vanilla JS, HTML, and CSS.

However, this project is in the process of being modernized toward a MERN framework

