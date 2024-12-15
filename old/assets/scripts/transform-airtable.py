#   {"id":"recsCbhFg1o1sq2YX",
#   "createdTime":"2023-09-25T15:00:44.000Z",
#   "cellValuesByColumnId":
#  0 {"fldKuPB47BSDAXcxo":" 14/10 Acland Street",
#  1 "fldfCIxaji9auiwxv":1,
#  2 "fldBQ1DlmGwmJXKRH":"The apartment has a serious mould and damp issue that runs deeply throughout the whole place. The mould ruined a majority of my furniture and personal possession including a sofa, drawers, a bookshelf and countless bags, shoes belts not to mention my partners amp he had since he was 15. We also experienced health issues, from irritated eyes to rashes and for myself my asthma became unmanageable from breathing in the mould particles. The apartment needs serious work before it can be rented out again and I would hope that this happens so no one else experiences this.",
#  3 "fldz8ZqlFhpXr8XQL":"2023-09-25T14:53:38.000Z",
#  4 "fldkJ039SmzLxTDsj":"selluXJfEaklYgIBd",
#  5 "fldVRvrZn7OgbtSmn":"St Kilda",
#  6 "fldpWuDivt92t0lL9":"selllBUNYe3Jv4PdL", -> state
#  7 "fldanIBzJiXajPYrc":"selLeUOm6oOnm51ms", -> country
#  8 "fldJbPfhgPucqvp6Y":"Longview"}
#   ,"externalResourceInfo":{"externalTableSyncId":"etsUfVCXwuQ724Dpt","isExternalResourceAvailable":true}}



states = {
  "selT14g2eGpBjjHfr":{"id":"selT14g2eGpBjjHfr","name":"ACT","color":"blueMedium"},
"selktsk2wRXgD6LjJ":{"id":"selktsk2wRXgD6LjJ","name":"NSW","color":"cyanMedium"},
"selPpbOc57wZ64WRa":{"id":"selPpbOc57wZ64WRa","name":"NT","color":"greenMedium"},
"sel1ry02VnkVR59ug":{"id":"sel1ry02VnkVR59ug","name":"QLD","color":"yellowMedium"},
"selK25uXEYLKD18cN":{"id":"selK25uXEYLKD18cN","name":"SA","color":"orangeMedium"},
"selyciTdZSIRjCwVS":{"id":"selyciTdZSIRjCwVS","name":"TAS","color":"pinkMedium"},
"selllBUNYe3Jv4PdL":{"id":"selllBUNYe3Jv4PdL","name":"VIC","color":"purpleMedium"},
"selPfxVA9Aj0dyoFq":{"id":"selPfxVA9Aj0dyoFq","name":"WA","color":"grayMedium"}}

countries = {"selLeUOm6oOnm51ms":{"id":"selLeUOm6oOnm51ms","color":"blue","name":"Australia"},"selyUosvI5W3d8j4H":{"id":"selyUosvI5W3d8j4H","color":"green","name":"Aotearoa/New Zealand"}}

import json
import requests

def read_json(file_path):
  with open(file_path, 'r') as file:
    data = json.load(file)
  return data

# Example usage
file_path = 'airtable.data'
json_data = read_json(file_path)

rows = json_data["data"]["rows"]

def transform(row):
  if len(row) != 9:
    return None

  try:
    return {
      "address": row[0],
      "rating": row[1],
      "review": row[2],
      "suburb": row[5],
      "state": row[6],
      "country": row[7],
    }
  except:
    return None

transformed = [ transform(list(row["cellValuesByColumnId"].values())) for row in rows]
transformed = [row for row in transformed if row is not None]

# change state and country to actual values
def enrich_state_country(row):
  if row is None:
    return None

  try:
    print("NEW ROW")
    print(row)
    state_id = row["state"]
    country_id = row["country"]
    row["state"] = states[state_id]["name"]
    row["country"] = countries[country_id]["name"]
    return row
  except:
    return None

transformed = [ enrich_state_country(row) for row in transformed]

# filter out none values and nz data
transformed = [row for row in transformed if row is not None and row["country"] == "Australia"]

# convert /u2018 and /u2019 to '
def convert_unicode(str):
  return str.replace("\u2018", "'").replace("\u2019", "'")

for row in transformed:
  for k in row.keys():
    if (isinstance(row[k], str)):
      row[k] = convert_unicode(row[k])

# kvmap = {0: 'address', 1: 'rating', 2: 'review', 5: 'suburb'}

# add lat lon enrichment to transformed data
# def get_lat_lon(address):
#   url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json"
#   response = requests.get(url)
#   if response.status_code == 200 and response.json():
#     location = response.json()[0]
#     return float(location['lat']), float(location['lon'])
#   return None, None

# for item in transformed:
#   lat, lon = get_lat_lon(item["address"] + " " + item["suburb"])
#   item["lat"] = lat
#   item["lon"] = lon




def write_json(data, file_path):
  with open(file_path, 'w') as file:
    json.dump(data, file, indent=2)

# Example usage
output_file_path = 'transformed.json'
write_json(transformed, output_file_path)