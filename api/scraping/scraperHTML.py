import requests
import sys
from bs4 import BeautifulSoup
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
        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Get the entire HTML DOM
        html_content = soup.prettify()

        # In case you want to extract specific data, you can modify this to return only the necessary content
        json_response = {"html": html_content}  # Example, you can modify as needed
        print(json.dumps(json_response))

    else:
        print(json.dumps({"error": f"Failed to retrieve the page, status code: {response.status_code}"}))

except Exception as e:
    print(json.dumps({"error": f"An error occurred: {str(e)}"}))
