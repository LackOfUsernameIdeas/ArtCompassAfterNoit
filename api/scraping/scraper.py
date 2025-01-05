import sys
import json
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

# Check if a URL argument is passed
if len(sys.argv) < 2:
    print("Error: URL is required.")
    sys.exit(1)

# Get the URL from command-line argument
URL = sys.argv[1]

# Function to handle scraping
def scrape_contributor():
    with sync_playwright() as p:
        # Launch a browser (chromium is similar to Chrome)
        browser = p.chromium.launch(headless=True)  # Set headless=False to see the browser
        page = browser.new_page()

        # Open the target URL
        page.goto(URL)

        # Wait for the contributor element to load (adjust selector if necessary)
        page.wait_for_selector("span.ContributorLink__name")

        # Fetch the page content after rendering
        page_source = page.content()

        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')

        # Find the specific <span> element that contains the contributor's name
        contributor_name = soup.find('span', class_='ContributorLink__name')

        if contributor_name:
            result = contributor_name.get_text(strip=True)  # Extract the text and strip any extra whitespace
        else:
            result = "Contributor not found"

        # Print the result
        print(result)

        # Close the browser
        browser.close()

if __name__ == "__main__":
    scrape_contributor()
