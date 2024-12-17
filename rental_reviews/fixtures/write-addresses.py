import json

# Read the rentals data from the JSON file
with open('/Users/andrewn/Code/bad-rentals/rental_reviews/static/rental_reviews/rentals-data.json', 'r') as file:
  rentals_data = json.load(file)

# Extract addresses and prepare fixture format
addresses = []
for idx, rental in enumerate(rentals_data, start=1):
  addresses.append({
    "model": "rental_reviews.address",
    "pk": idx,
    "fields": {
      "street": rental.get("address"),
      "suburb": rental.get("suburb"),
      "state": rental.get("state"),
      "country": rental.get("country"),
      "lat": rental.get("lat"),
      "lon": rental.get("lon")
    }
  })

# Write the addresses to a new JSON file in fixture format
with open('/Users/andrewn/Code/bad-rentals/rental_reviews/fixtures/addresses-fixture.json', 'w') as file:
  json.dump(addresses, file, indent=2)