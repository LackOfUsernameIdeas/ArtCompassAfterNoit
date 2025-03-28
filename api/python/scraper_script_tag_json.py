# Описание на целта на скрипта:
# Този скрипт приема URL като аргумент от командния ред и прави GET заявка към страницата.
# След това търси JSON данни, които се намират в таг <script id="__NEXT_DATA__"> на страницата.
# Ако бъдат открити, тези данни се парсират и показват в четим формат. В противен случай се извежда грешка.

import requests
import sys
import re
import json

# Проверка дали е подаден URL като аргумент
if len(sys.argv) < 2:
    print(json.dumps({"error": "Грешка: Не е предоставен URL."}))
    sys.exit(1)

# Вземане на URL от аргумента на командния ред
URL = sys.argv[1]

# Изпращане на GET заявка за получаване на съдържанието на страницата
try:
    response = requests.get(URL)

    # Проверка дали заявката е успешна (статус код 200)
    if response.status_code == 200:
        # Търсене на таг <script id="__NEXT_DATA__" с помощта на регулярни изрази
        match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', response.text, re.DOTALL)

        if match:
            # Извличане на JSON данните от таг-а
            json_data = json.loads(match.group(1))

            # Печатане на парсираните JSON данни във формат, който е лесен за четене
            print(json.dumps(json_data, indent=2))  # Това ще отпечата парсирания JSON като форматиран низ

        else:
            print(json.dumps({"error": "Не успяхме да намерим JSON данни в таг <script id='__NEXT_DATA__'>."}))

    else:
        print(json.dumps({"error": f"Не успяхме да извлечем страницата, статус код: {response.status_code}"}))

except Exception as e:
    print(json.dumps({"error": f"Възникна грешка: {str(e)}"}))