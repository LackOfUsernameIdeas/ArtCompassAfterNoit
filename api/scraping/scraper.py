# Описание на целта на скрипта:
# Този скрипт извлича информация за книга от предоставен URL. 
# Той използва библиотеките requests и BeautifulSoup за зареждане и парсиране на съдържанието на страницата, 
# като извлича различни данни като заглавие на книгата, контрибутори (автори, редактори и други), 
# рейтинг, брой оценки, описание, брой страници, форма на книгата, първа публикация и други метаинформации.
# Освен това, скриптът извлича и JSON данни от страницата, които предоставят допълнителна информация за книгата, 
# като жанрове, награди и език. Данните се форматират в удобен за анализ вид и се извеждат на екрана.

import sys
import json
import requests
import re
from bs4 import BeautifulSoup
from datetime import datetime, timezone

# Проверка дали е подаден URL като аргумент
if len(sys.argv) < 2:
    print("Error: URL is required.")
    sys.exit(1)

# Захваняне на URL от аргумента на командния ред
URL = sys.argv[1]

# Функция за скрипване на данни

def scrape_contributor():
    # Изпращане на GET заявка за получаване на съдържанието на страницата
    response = requests.get(URL)
    
    # Проверка дали заявката е успешна
    if response.status_code != 200:
        print(f"Error: Failed to fetch the page. Status code: {response.status_code}")
        sys.exit(1)

    # Парсиране на съдържанието с BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Намиране на заглавието на книгата
    title_section = soup.find('div', class_='BookPageTitleSection__title')
    book_title = "N/A"
    if title_section:
        title_element = title_section.find('h1', {'data-testid': 'bookTitle'})
        if title_element:
            book_title = title_element.get_text(strip=True)

    # Намиране на списъка с контрибутори
    contributor_list = soup.find('div', class_='ContributorLinksList')

    if not contributor_list:
        print({"contributors": ["N/A"]})
        sys.exit(0)

    # Извличане на имената и ролите на контрибуторите
    contributors = []
    for contributor_link in contributor_list.find_all('a', class_='ContributorLink'):
        name = contributor_link.find('span', class_='ContributorLink__name')
        role = contributor_link.find('span', class_='ContributorLink__role')

        if name:
            contributor_info = {"name": name.get_text(strip=True)}
            if role:
                contributor_info["role"] = role.get_text(strip=True)
            contributors.append(contributor_info)

    # Форматиране на списъка с контрибутори
    formatted_contributors = ", ".join(
        f"{contributor['name']} {contributor['role']}" if "role" in contributor else contributor["name"]
        for contributor in contributors
    )

    # Търсим div елемента с клас 'RatingStatistics__rating', който съдържа оценката
    rating_div = soup.find('div', class_='RatingStatistics__rating')
    rating = "N/A"  # Задаваме начална стойност "N/A" в случай, че не открием елемента
    if rating_div:  # Проверяваме дали елементът е намерен
        # Преобразуваме текста на елемента в число с плаваща запетая
        rating = float(rating_div.get_text(strip=True))

    # Извличане на броя на оценки и ревюта от секцията с метаинформация
    ratings_count = "N/A"  # Начална стойност за броя на оценки
    reviews_count = "N/A"  # Начална стойност за броя на ревюта
    # Търсим div елемента с клас 'RatingStatistics__meta', който съдържа допълнителна информация
    rating_stats_div = soup.find('div', class_='RatingStatistics__meta')

    if rating_stats_div:  # Ако елементът е намерен, обработваме го
        # Намираме елемента за броя на оценки с data-testid='ratingsCount'
        ratings_count_elem = rating_stats_div.find('span', {'data-testid': 'ratingsCount'})
        if ratings_count_elem:  # Ако елементът съществува, обработваме стойността му
            ratings_count = ratings_count_elem.get_text(strip=True)  # Извличаме текста
            # Премахваме запетайки и ненужни символи, след което преобразуваме в float
            ratings_count = float(ratings_count.replace(',', '').replace('ratings', '').strip())

        # Намираме елемента за броя на ревюта с data-testid='reviewsCount'
        reviews_count_elem = rating_stats_div.find('span', {'data-testid': 'reviewsCount'})
        if reviews_count_elem:  # Ако елементът съществува, обработваме стойността му
            reviews_count = reviews_count_elem.get_text(strip=True)  # Извличаме текста
            # Премахваме запетайки и ненужни символи, след което преобразуваме в float
            reviews_count = float(reviews_count.replace(',', '').replace('reviews', '').strip())

    # Извличане на описанието на книгата
    # Търсим div елемента с атрибут data-testid='description', който съдържа описанието
    description_div = soup.find('div', {'data-testid': 'description'})
    description = "N/A"  # Начална стойност за описанието
    if description_div:  # Ако елементът съществува, обработваме стойността му
        description_text = description_div.get_text(strip=True)  # Извличаме текста
        description = description_text  # Запазваме описанието

    # Извличане на информация за броя страници и формата на книгата
    # Търсим p елемента с атрибут data-testid='pagesFormat'
    pages_format_div = soup.find('p', {'data-testid': 'pagesFormat'})
    pages_count = "N/A"  # Начална стойност за броя страници
    book_format = "N/A"  # Начална стойност за формата на книгата

    if pages_format_div:  # Ако елементът е намерен
        pages_text = pages_format_div.get_text(strip=True)  # Извличаме текста
        # Използваме регулярни изрази, за да извлечем числовия брой страници и формата
        match = re.match(r"(\d+)\s+pages,\s+(.+)", pages_text)
        if match:  # Ако съвпадение е намерено
            pages_count = float(match.group(1))  # Извличаме броя страници (числово значение)
            book_format = match.group(2)  # Извличаме формата на книгата (напр. твърда корица)

    # Извличане на информация за първата публикация на книгата
    # Търсим p елемента с атрибут data-testid='publicationInfo'
    first_publication_info_div = soup.find('p', {'data-testid': 'publicationInfo'})
    first_publication_info = "N/A"  # Начална стойност за информацията за публикацията

    if first_publication_info_div:  # Ако елементът е намерен
        full_text = first_publication_info_div.get_text(strip=True)  # Извличаме пълния текст
        # Премахваме префикса "First published" и изчистваме текста
        first_publication_info = full_text.replace("First published", "").strip()

    # Търсим JSON данни в скриптовия таг с id='__NEXT_DATA__'
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', response.text, re.DOTALL)
    book_property = {}  # Празен речник за данните на книгата
    book_details = {}  # Празен речник за детайлите на книгата
    work_property = {}  # Празен речник за работни данни
    work_details = {}  # Празен речник за детайли за произведението
    series_property = {}  # Празен речник за данни за поредицата

    if match:  # Ако JSON данните са намерени
        # Парсираме JSON съдържанието от скриптовия таг
        json_data = json.loads(match.group(1))
        props = json_data.get('props', None)  # Извличаме свойствата от JSON
        page_props = props.get('pageProps', {})  # Извличаме pageProps от свойствата
        apollo_state = page_props.get('apolloState', {})  # Извличаме Apollo State

        # --- Динамично търсене на ключове за детайлите ---
        book_id = "N/A"  # Начална стойност за ID на книгата
        match = re.search(r'book/show/(\d+)', URL)  # Търсим ID на книгата в URL адреса
        if match:  # Ако ID е намерено
            book_id = match.group(1)  # Запазваме ID-то

        # Намираме ключа за детайлите на книгата
        book_details_key = next(
            (key for key, value in apollo_state.items() if value.get('webUrl', '').find(book_id) != -1 and value.get('__typename') == 'Book'),
            None
        )

        # Намираме ключа за детайлите на произведението
        work_details_key = next(
            (key for key, value in apollo_state.items() if value.get('__typename') == 'Work'),
            None
        )

        # Намираме ключа за детайлите на поредицата
        series_details_key = next(
            (key for key, value in apollo_state.items() if value.get('__typename') == 'Series'),
            None
        )

        # Извличаме данните за книгата, произведението и поредицата
        book_property = apollo_state.get(book_details_key, {})
        book_details = book_property.get('details', {})
        work_property = apollo_state.get(work_details_key, {})
        work_details = work_property.get('details', {})
        series_property = apollo_state.get(series_details_key, {})

        # --- Тестване на изходните данни ---
        # print(json.dumps({"book_details_key": book_details_key}))  
        # print(json.dumps(apollo_state, indent=2))
    else:
        print(json.dumps({"error": "Не успяхме да намерим __NEXT_DATA__ JSON данни на страницата."}))

    # Извличане на времето на публикация (в милисекунди) от 'book_details'
    publication_time = book_details.get('publicationTime', None)

    # Ако времето на публикация е дефинирано, конвертираме от милисекунди в секунди
    # и го форматираме като четлива дата (пример: 'January 01, 2000')
    if publication_time is not None:
        timestamp_sec = publication_time / 1000  # Преобразуване в секунди
        # Конвертиране на времевия маркер в UTC дата и форматиране на датата
        publication_time = datetime.fromtimestamp(timestamp_sec, tz=timezone.utc).strftime('%B %d, %Y')

    # Извличане на информация за издателя на книгата, ако е налична
    publisher = book_details.get('publisher', None)

    # Извличане на ISBN-13, ISBN-10 и ASIN, ако са налични
    isbn13 = book_details.get('isbn13', None)  # ISBN-13 (международен стандарт за книги)
    isbn10 = book_details.get('isbn', None)  # ISBN-10 (по-стара версия на стандарта)
    asin = book_details.get('asin', None)  # ASIN (Amazon идентификатор)

    # Извличане на езика на книгата от 'book_details'
    # Вложен обект 'language', от който вземаме 'name'
    language = book_details.get('language', {}).get('name', None)

    # Извличане на списъка с жанрове на книгата от 'book_property'
    genresList = book_property.get('bookGenres', [])
    # Конвертиране на списъка с жанрове в низ от жанрове, разделени със запетаи
    genres = ", ".join([genre_info['genre']['name'] for genre_info in genresList])

    # Извличане на наградите, спечелени от книгата, от 'work_details'
    literary_awards = work_details.get('awardsWon', [])
    # Форматиране на наградите като низ с име и година (пример: "Награда (2020)")
    formatted_awards = ", ".join([
        f"{award['name']} ({datetime.fromtimestamp(award['awardedAt'] / 1000, tz=timezone.utc).strftime('%Y')})"
        for award in literary_awards
    ])

    # Извличане на оригиналното заглавие на книгата от 'work_details'
    original_title = work_details.get('originalTitle', None)

    # Извличане на местата, свързани с книгата, от 'work_details'
    places = work_details.get('places', [])
    # Форматиране на списъка с места като низ с име и допълнителна информация (пример: "Лондон (Великобритания, 1888)")
    formatted_places = ", ".join([
        f"{place['name']} ({', '.join(filter(None, [place['countryName'], str(place['year'])]))})"
        if place['countryName'] or place['year'] else place['name']
        for place in places
    ])

    # Извличане на списъка с герои от 'work_details'
    characters = work_details.get('characters', [])
    # Форматиране на списъка с герои като низ с имената им, разделени със запетаи
    formatted_characters = ", ".join([character['name'] for character in characters])

    # Извличане на URL адреса на изображението на книгата от 'book_property'
    image_url = book_property.get('imageUrl', None)

    # Извличане на заглавието на поредицата (ако книгата е част от поредица) от 'series_property'
    series_title = series_property.get('title', None)

    # Принтиране на резултата
    result = {
        "title": book_title,
        "original_title": original_title,
        "contributors": formatted_contributors,
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

# Ако този скрипт е изпълнен директно (не е импортиран), ще се извика scrape_contributor
if __name__ == "__main__":
    scrape_contributor()