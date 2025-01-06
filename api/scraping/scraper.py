import sys
import requests
from bs4 import BeautifulSoup

# Check if a URL argument is passed
if len(sys.argv) < 2:
    print("Error: URL is required.")
    sys.exit(1)

# Get the URL from command-line argument
URL = sys.argv[1]

# Function to handle scraping
def scrape_contributor():
    # Send a GET request to fetch the page content
    response = requests.get(URL)
    
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Error: Failed to fetch the page. Status code: {response.status_code}")
        sys.exit(1)

    # Parse the page content with BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the specific <span> element that contains the contributor's name
    contributor_name = soup.find('span', class_='ContributorLink__name')

    if contributor_name:
        result = contributor_name.get_text(strip=True)  # Extract the text and strip any extra whitespace
    else:
        result = "Contributor not found"

    # Print the result
    print(result)

if __name__ == "__main__":
    scrape_contributor()
