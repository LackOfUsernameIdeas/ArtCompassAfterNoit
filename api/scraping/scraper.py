import requests
from bs4 import BeautifulSoup

# Function to fetch the page content
def fetch_goodreads_page(book_id):
    url = f'https://www.goodreads.com/book/show/{book_id}'
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    return response.text

# Function to extract the necessary details from the page
def extract_book_details(page_html):
    soup = BeautifulSoup(page_html, 'html.parser')
    details = {}

    # Test for a simpler element, like the book's author
    author_element = soup.find('span', itemprop='author')
    if author_element:
        details['Автор'] = author_element.get_text(strip=True)
    else:
        details['Автор'] = 'Not available'

    return details

# Main function to scrape the book information
def main():
    book_id = '18721932'  # Example Goodreads book ID
    page_html = fetch_goodreads_page(book_id)
    book_details = extract_book_details(page_html)
    
    # Print the scraped data
    for key, value in book_details.items():
        print(f'{key}: {value}')

# Run the script
if __name__ == '__main__':
    main()
