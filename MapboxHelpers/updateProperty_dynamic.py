"""
 Mapbox GL requires a geoJSON file to support the per-zipcode rendering.

 This file serves as a helper tool to generate that formatted file format.
"""
# hold this
import json
import pandas as pd
import numpy as np

zips_candContributions_filename = '../Data/HelperCleanedContributions.xlsx'
geoJSON_filename = '../Data/texas-zip-codes-_1613.geojson'
column_index_where_data_begins = 5

"""
rows ~ zipcodes that made contributions
cols ~ candidate who received contributions + total contributions from that zip
"""
zips_contributions_df = pd.read_excel(zips_candContributions_filename, sheet_name = 'Zipcode Analysis per Candidate', na_values=['NA'], usecols="F:AA")

zips_contributions_df = zips_contributions_df.set_index('Unique Zipcodes')

zips_contributions_df = zips_contributions_df.dropna()
zips_contributions_df.index = zips_contributions_df.index.astype(int)

zip_contributions_json = json.loads(zips_contributions_df.to_json(orient='index'))
"""
list that keeps track of the zips that are left untouched bc they aren't found in the .xlsx file
"""
skipped_zips = []

"""
list that keeps track of the zips that had errors when processing
"""
error_zips = []

with open(geoJSON_filename, 'r') as f:
    all_zips_data = json.load(f)

"""
dict that builds GeoJSON that only has zips in our contributions dataset
initialize as a copy of the existing GeoJSON except for the contents of "features"
"""
zips_contributions_data = {}
for key in all_zips_data.keys():
    if key != "features":
        zips_contributions_data[key] = all_zips_data[key]
zips_contributions_data["features"] = []

zip_df_indices = zips_contributions_df.index.values.tolist()

for feat in all_zips_data["features"]:
    properties = feat["properties"]
    if "ZCTA5CE10" in properties:
        zipcode = int(properties["ZCTA5CE10"])

        if zipcode in zip_df_indices:
            # create working copy of feature and add zip contribution data to properties
            feat_copy = feat
            feat_copy["properties"].update(zip_contributions_json[str(zipcode)])

            # save working copy of feature to new GeoJSON
            zips_contributions_data["features"].append(feat_copy)
        else:
            skipped_zips.append(zipcode)
    else:
        continue

#Write result to a new file
with open('../Data/zipcodes_contributions.geojson', 'w') as f:
    json.dump(zips_contributions_data, f)

# Print Zips where an error occurred
print("error zips")
print(error_zips)

print("skipped zips")
print(skipped_zips)