"""
Part 1 - Price Transformation Script
Reduces all Cameras & Camcorders prices by 20% and uploads to Algolia.
"""

import json
import math
import os
from dotenv import load_dotenv
from algoliasearch.search.client import SearchClientSync

# Load credentials from .env file
load_dotenv('../.env')

app_id = os.getenv("ALGOLIA_APP_ID")
admin_api_key = os.getenv("ALGOLIA_ADMIN_API_KEY")
index_name = os.getenv("ALGOLIA_INDEX")

# Validate credentials
if not all([app_id, admin_api_key, index_name]):
    raise ValueError("Missing Algolia credentials in .env file")

# Open and read the products file
with open("products.json", "r") as file:
    products = json.load(file)

# Loop through every product and reduce camera prices by 20%
for product in products:
    top_category = product.get("hierarchicalCategories", {}).get("lvl0", "")
    if "Cameras" in top_category:
        original_price = product["price"]
        discounted_price = original_price * 0.8
        product["price"] = math.floor(discounted_price)
        
# Connect to Algolia and upload the updated products
client = SearchClientSync(app_id, admin_api_key)
client.save_objects(index_name=index_name, objects=products)

print("Done! Camera prices updated and uploaded.")