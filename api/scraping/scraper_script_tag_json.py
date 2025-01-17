import requests
import sys
import re
import json

# Check if a URL argument is passed
if len(sys.argv) < 2:
    print(json.dumps({"error": "Error: URL is required."}))
    sys.exit(1)

# Get the URL from command-line argument
URL = sys.argv[1]

# Send a GET request to fetch the page content
try:
    response = requests.get(URL)

    # Check if the request was successful
    if response.status_code == 200:
        # Look for the <script id="__NEXT_DATA__" tag
        match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', response.text, re.DOTALL)

        if match:
            # Extract the JSON string from the script tag
            json_data = json.loads(match.group(1))

            # Print the parsed JSON data in a readable format
            print(json.dumps(json_data, indent=2))  # This will print the parsed JSON as a formatted string

        else:
            print(json.dumps({"error": "Failed to find the __NEXT_DATA__ JSON data in the page."}))

    else:
        print(json.dumps({"error": f"Failed to retrieve the page, status code: {response.status_code}"}))

except Exception as e:
    print(json.dumps({"error": f"An error occurred: {str(e)}"}))
