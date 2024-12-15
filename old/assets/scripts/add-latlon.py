import json
import requests
import urllib
import time
from tqdm import tqdm

def read_json(file_path):
  with open(file_path, 'r') as file:
    data = json.load(file)
  return data

# Example usage
file_path = 'transformed.json'
json_data = read_json(file_path)

print(len(json_data))

def get_lat_lon_opencage(address):
  api_key = ENV["OSM_API_KEY"]
  url = "https://api.opencagedata.com/geocode/v1/json"
  params = {"q": address, "key": api_key}
  try:
      response = requests.get(url, params=params)
      response.raise_for_status()
      data = response.json()
      
      if data["results"]:
          location = data["results"][0]["geometry"]
          return location["lat"], location["lng"]
      else:
          print("Address not found.")
          return None
  except requests.exceptions.RequestException as e:
      print(f"Request error: {e}")
      return None

for r in tqdm(json_data, desc="Processing addresses"):
  address = r['address'] + ", " + r['suburb'] + ", " + r['state'] + ", Australia"
  lat, lon = get_lat_lon_opencage(address)
  r["lat"] = lat
  r["lon"] = lon
  time.sleep(1)

def write_json(data, file_path):
  with open(file_path, 'w') as file:
    json.dump(data, file, indent=2)

# Example usage
output_file_path = 'transformed.json'
write_json(json_data, output_file_path)