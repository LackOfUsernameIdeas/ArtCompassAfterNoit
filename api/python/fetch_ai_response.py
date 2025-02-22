# Описание на целта на скрипта:
# Този скрипт използва OpenAI и Google Gemini API, за да обработи входни съобщения, предоставени от потребителя, и да генерира отговори от съответния модел. 
# Той първо извлича необходимите API ключове от .env файла, а след това на база избора на доставчик (OpenAI или Gemini) избира правилния модел и форматира съобщенията правилно. 
# Резултатът от всеки модел се връща като JSON отговор и се отпечатва в стандартния изход.

import json
import sys
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

# Пренастройваме кодировката на стандартния изход (stdout) на UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Зареждаме променливите на околната среда от .env файла
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
load_dotenv(env_path)

# Извличаме API ключовете от .env файла
api_openai_key = os.getenv("VITE_OPENAI_API_KEY")
api_gemini_key = os.getenv("VITE_GEMINI_API_KEY")

def fetch_openai_response(messages, provider, modelOpenAI):
    
    # Инициализиране на OpenAI и Gemini модели с предоставените API ключове
    llmOpenAI = ChatOpenAI(model=modelOpenAI, api_key=api_openai_key)
    llmGemini = ChatGoogleGenerativeAI(model="gemini-1.5-pro", api_key=api_gemini_key)

    try:
        # Проверка дали съобщенията са в правилния формат (списък)
        if not isinstance(messages, list):
            return {"error": "Invalid input. Expected a list of messages."}

        # Ако доставчикът е Gemini, извикваме Gemini
        if provider == "gemini":
            response = llmGemini.invoke(messages)

        # Ако доставчикът е OpenAI, извикваме OpenAI
        elif provider == "openai" and llmOpenAI:
            response = llmOpenAI.invoke(messages)

        else:
            return {"error": f"Invalid provider '{provider}' or missing API key."}

        # Връщаме съдържанието на отговора
        return response.content

    except Exception as e:
        return {"error": f"Error fetching OpenAI response: {str(e)}"}

if __name__ == "__main__":
    try:
        # Четене на JSON входни данни от stdin (пратени от Node.js или друг процес)
        input_data = sys.stdin.read().strip()
        parsed_data = json.loads(input_data)

        # Извличаме съобщенията и доставчика от входните данни
        messages = parsed_data.get("messages", [])
        provider = parsed_data.get("provider", "openai").lower()  # По подразбиране използваме OpenAI
        modelOpenAI = parsed_data.get("modelOpenAI", "gpt-4o").lower()  # Моделът може да бъде променен чрез параметъра

        # Извличаме отговор от избрания доставчик (OpenAI или Gemini)
        response = fetch_openai_response(messages, provider, modelOpenAI)

        # Подготвяме отговора с условие за включване на модела само ако доставчикът е OpenAI
        response_data = {"provider": provider, "response": response}
        if provider == "openai":
            response_data["modelOpenAI"] = modelOpenAI

        # Отпечатваме отговора като JSON в стандартния изход, като използваме UTF-8 кодиране
        print(json.dumps(response_data, ensure_ascii=False))

    except Exception as e:
        # Ако има грешка, отпечатваме грешка в JSON формат
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
