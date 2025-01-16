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

    # # Extract genres
    # genres_list = soup.find('div', {'data-testid': 'genresList'})
    # genres = []
    # # If the genresList div exists, extract the genres from it
    # if genres_list:
    #     # Find all the genre buttons (both visible and hidden)
    #     genre_buttons = genres_list.find_all('a', class_='Button--tag')
        
    #     # Iterate through each genre button and get the genre name
    #     for genre_button in genre_buttons:
    #         genre_name = genre_button.get_text(strip=True)
    #         if genre_name:
    #             genres.append(genre_name)

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
    details = {};
    book_information = {};
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
            (key for key, value in apollo_state.items() if value.get('webUrl', '').find(book_id) != -1),
            None
        )

        book_information = apollo_state.get(book_details_key, {})
        details = book_information.get('details', {})

        # print(json.dumps({"book_details_key": details}))  
        # print(json.dumps(apollo_state, indent=2))
    else:
        print(json.dumps({"error": "Failed to find the __NEXT_DATA__ JSON data in the page."}))


    # Extract relevant information from the details object

    # Given timestamp in milliseconds
    publication_time = details.get('publicationTime', None)

    # Convert to seconds (divide by 1000) if publication_time is not "N/A"
    if publication_time != "N/A":
        timestamp_sec = publication_time / 1000
        publication_time = datetime.fromtimestamp(timestamp_sec, tz=timezone.utc).strftime('%B %d, %Y')

    publisher = details.get('publisher', None)
    isbn13 = details.get('isbn13', None)
    isbn10 = details.get('isbn', None)
    asin = details.get('asin', None)
    language = details.get('language', {}).get('name', None)
    
    genresList = book_information.get('bookGenres', [])
    genres = [genre_info['genre']['name'] for genre_info in genresList]


    # # Extract Literary Awards
    # literary_awards_div = soup.find('div', class_='TruncatedContent')
    # literary_awards = []
    # if literary_awards_div:
    #     awards = literary_awards_div.find_all('a', {'data-testid': 'award'})
    #     for award in awards:
    #         literary_awards.append(award.get_text(strip=True))

    # # Extract Original Title
    # original_title_div = soup.find('div', {'data-testid': 'originalTitle'})
    # original_title = "N/A"
    # if original_title_div:
    #     original_title = original_title_div.get_text(strip=True)

    # # Extract Series Information
    # series_div = soup.find('div', {'data-testid': 'series'})
    # series = "N/A"
    # if series_div:
    #     series = series_div.get_text(strip=True)

    # # Extract Setting
    # setting_div = soup.find('div', {'data-testid': 'setting'})
    # setting = "N/A"
    # if setting_div:
    #     setting = setting_div.get_text(strip=True)

    # # Extract Characters
    # characters_div = soup.find('div', {'data-testid': 'characters'})
    # characters = []
    # if characters_div:
    #     character_links = characters_div.find_all('a')
    #     for character in character_links:
    #         characters.append(character.get_text(strip=True))

    # # Extract ISBNs (both ISBN10 and ISBN13)
    # isbn13 = "N/A"
    # isbn10 = "N/A"
    
    # isbn_section = soup.find('div', class_='DescListItem')
    # if isbn_section:
    #     isbn13_tag = isbn_section.find('span', class_='Text Text__subdued')
    #     if isbn13_tag:
    #         isbn13 = isbn13_tag.get_text(strip=True)

    #     isbn10_tag = isbn_section.find('div', {'data-testid': 'contentContainer'})
    #     if isbn10_tag:
    #         isbn10 = isbn10_tag.get_text(strip=True)

    # # Extract Language
    # language_div = soup.find('div', {'data-testid': 'contentContainer'})
    # language = "N/A"
    # if language_div:
    #     language = language_div.get_text(strip=True)

    # Print the result
    result = {
        "title": book_title,
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
        # "literary_awards": literary_awards,
        # "original_title": original_title,
        # "series": series,
        # "setting": setting,
        # "characters": characters,
        "isbn13": isbn13,
        "isbn10": isbn10,
        "asin": asin,
        "language": language,
    }
    print(json.dumps(result))

if __name__ == "__main__":
    scrape_contributor()
