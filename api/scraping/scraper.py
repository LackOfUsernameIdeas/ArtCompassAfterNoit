import sys
import json
import requests
import re
from bs4 import BeautifulSoup
from datetime import datetime, timezone

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


    # Find the book title
    title_section = soup.find('div', class_='BookPageTitleSection__title')
    book_title = "N/A"
    if title_section:
        title_element = title_section.find('h1', {'data-testid': 'bookTitle'})
        if title_element:
            book_title = title_element.get_text(strip=True)

    # Find the <div> containing contributor links
    contributor_list = soup.find('div', class_='ContributorLinksList')

    if not contributor_list:
        print({"contributors": ["N/A"]})
        sys.exit(0)

    # Extract all contributor names and roles
    contributors = []
    for contributor_link in contributor_list.find_all('a', class_='ContributorLink'):
        name = contributor_link.find('span', class_='ContributorLink__name')
        role = contributor_link.find('span', class_='ContributorLink__role')

        if name:
            contributor_info = {"name": name.get_text(strip=True)}
            if role:
                contributor_info["role"] = role.get_text(strip=True)
            contributors.append(contributor_info)


    # Extract the exact rating value
    rating_div = soup.find('div', class_='RatingStatistics__rating')
    rating = "N/A"
    if rating_div:
        rating = rating_div.get_text(strip=True)
        rating = f"{rating} от 5"

    # Extract the rating count and reviews count
    ratings_count = "N/A"
    reviews_count = "N/A"

    # Find the div that contains both ratings and reviews information
    rating_stats_div = soup.find('div', class_='RatingStatistics__meta')

    if rating_stats_div:
        # Extract ratings count
        ratings_count_elem = rating_stats_div.find('span', {'data-testid': 'ratingsCount'})
        if ratings_count_elem:
            ratings_count = ratings_count_elem.get_text(strip=True)
            # Remove any unwanted text like "ratings"
            ratings_count = ratings_count.replace('ratings', '').strip()

        # Extract reviews count
        reviews_count_elem = rating_stats_div.find('span', {'data-testid': 'reviewsCount'})
        if reviews_count_elem:
            reviews_count = reviews_count_elem.get_text(strip=True)
            # Remove any unwanted text like "reviews"
            reviews_count = reviews_count.replace('reviews', '').strip()

    # Extract the description
    description_div = soup.find('div', {'data-testid': 'description'})
    description = "N/A"
    if description_div:
        description_text = description_div.get_text(strip=True)
        description = description_text

    # Extract Pages count and format
    pages_format_div = soup.find('p', {'data-testid': 'pagesFormat'})
    pages_count = "N/A"
    book_format = "N/A"

    if pages_format_div:
        pages_text = pages_format_div.get_text(strip=True)
        match = re.match(r"(\d+)\s+pages,\s+(.+)", pages_text)
        if match:
            pages_count = match.group(1)  # Numeric pages count
            book_format = match.group(2)  # Format (e.g., Hardcover, Paperback)

    # Extract publication info
    first_publication_info_div = soup.find('p', {'data-testid': 'publicationInfo'})
    first_publication_info = "N/A"

    if first_publication_info_div:
        full_text = first_publication_info_div.get_text(strip=True)
        # Remove "First published" prefix
        first_publication_info = full_text.replace("First published", "").strip()

    # Look for the <script id="__NEXT_DATA__" tag
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', response.text, re.DOTALL)
    book_property = {};
    book_details = {};
    work_property = {};
    work_details = {};
    series_property = {};
    if match:
        # Extract the JSON string from the script tag
        json_data = json.loads(match.group(1))
        props = json_data.get('props', None)
        page_props = props.get('pageProps', {})
        apollo_state = page_props.get('apolloState', {})

        # Dynamic search for the book details key based on a condition
        book_id = "N/A"

        match = re.search(r'book/show/(\d+)', URL)
        if match:
            book_id = match.group(1)  # Extracted book ID

        book_details_key = next(
            (key for key, value in apollo_state.items() if value.get('webUrl', '').find(book_id) != -1 and value.get('__typename') == 'Book'),
            None
        )

        work_details_key = next(
            (key for key, value in apollo_state.items() if value.get('__typename') == 'Work'),
            None
        )

        series_details_key = next(
            (key for key, value in apollo_state.items() if value.get('__typename') == 'Series'),
            None
        )

        book_property = apollo_state.get(book_details_key, {})
        book_details = book_property.get('details', {})

        work_property = apollo_state.get(work_details_key, {})
        work_details = work_property.get('details', {})

        series_property = apollo_state.get(series_details_key, {})

        genresList = book_property.get('bookGenres', [])
        genres = [genre_info['genre']['name'] for genre_info in genresList]
        # --- Testing the output ---
        # print(json.dumps({"book_details_key": book_details_key}))  
        # print(json.dumps(apollo_state, indent=2))
    else:
        print(json.dumps({"error": "Failed to find the __NEXT_DATA__ JSON data in the page."}))


    # Extract relevant information from the details object

    # Given timestamp in milliseconds
    publication_time = book_details.get('publicationTime', None)

    # Convert to seconds (divide by 1000) if publication_time is not defined
    if publication_time != None:
        timestamp_sec = publication_time / 1000
        publication_time = datetime.fromtimestamp(timestamp_sec, tz=timezone.utc).strftime('%B %d, %Y')

    publisher = book_details.get('publisher', None)
    isbn13 = book_details.get('isbn13', None)
    isbn10 = book_details.get('isbn', None)
    asin = book_details.get('asin', None)
    language = book_details.get('language', {}).get('name', None)
    
    genresList = book_property.get('bookGenres', [])
    genres = [genre_info['genre']['name'] for genre_info in genresList]

    literary_awards = work_details.get('awardsWon', [])
    formatted_awards = [
        f"{award['name']} ({datetime.fromtimestamp(award['awardedAt'] / 1000, tz=timezone.utc).strftime('%Y')})"
        for award in literary_awards
    ]

    original_title = work_details.get('originalTitle', None)

    places = work_details.get('places', [])
    formatted_places = [
        f"{place['name']} ({', '.join(filter(None, [place['countryName'], str(place['year'])]))})"
        if place['countryName'] or place['year'] else place['name']
        for place in places
    ]

    characters = work_details.get('characters', [])
    formatted_characters = [character['name'] for character in characters]

    image_url = book_property.get('imageUrl', None)

    series_title = series_property.get('title', None)

    # Print the result
    result = {
        "title": book_title,
        "original_title": original_title,
        "contributors": contributors,
        "rating": rating,
        "ratings_count": ratings_count,
        "reviews_count": reviews_count,
        "description": description,
        "genres": genres,
        "pages_count": pages_count,
        "book_format": book_format,
        "first_publication_info": first_publication_info,
        "publisher": publisher,
        "publication_time": publication_time,
        "literary_awards": formatted_awards,
        "setting": formatted_places,
        "characters": formatted_characters,
        "image_url": image_url,
        "series": series_title,
        "isbn13": isbn13,
        "isbn10": isbn10,
        "asin": asin,
        "language": language,
    }
    print(json.dumps(result))

if __name__ == "__main__":
    scrape_contributor()
