import json
from datetime import datetime
import pytz

# Read the rentals data from the JSON file
with open('/Users/andrewn/Code/bad-rentals/rental_reviews/static/rental_reviews/rentals-data.json', 'r') as file:
  rentals_data = json.load(file)

# Extract reviews and prepare fixture format
reviews = []
for idx, rental in enumerate(rentals_data, start=1):
  local_tz = pytz.timezone('Australia/Adelaide')  # Replace with your local timezone
  local_time = datetime.now(local_tz).isoformat()
  reviews.append({
    "model": "rental_reviews.review",
    "pk": idx,
    "fields": {
      "address": idx,
      "rating": rental.get("rating"),
      "review": rental.get("review"),
      "created_time": local_time,
      "agency_or_private_landlord": "",
      "agency_name": ""
    }
  })

# Write the reviews to a new JSON file in fixture format
with open('/Users/andrewn/Code/bad-rentals/rental_reviews/fixtures/reviews-fixture.json', 'w') as file:
  json.dump(reviews, file, indent=2)