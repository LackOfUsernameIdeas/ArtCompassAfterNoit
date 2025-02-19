import json
import sys
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

sys.stdout.reconfigure(encoding='utf-8')

# Load environment variables from .env file
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
load_dotenv(env_path)

# Get API key from .env
api_openai_key = os.getenv("VITE_OPENAI_API_KEY")
api_gemini_key = os.getenv("VITE_GEMINI_API_KEY")

# Initialize OpenAI model with GPT-4o chat endpoint
llmOpenAI = ChatOpenAI(model="gpt-4o", api_key=api_openai_key)
llmGemini = ChatGoogleGenerativeAI(model="gemini-1.5-pro", api_key=api_gemini_key)

def fetch_openai_response(messages, provider):    
    try:       
        # Ensure messages are properly structured
        if not isinstance(messages, list):
            return {"error": "Invalid input. Expected a list of messages."}

        if provider == "gemini":

            gemini_messages = [] # Convert OpenAI-style messages to Gemini format

            for msg in messages:
                if msg["role"] == "system":
                    gemini_messages.append(("system", msg["content"]))
                elif msg["role"] == "user":
                    gemini_messages.append(("human", msg["content"]))
            
            # Call Gemini with system instruction + messages
            response = llmGemini.invoke(gemini_messages)
        # Use the correct method to make a chat-based completion request
        elif provider == "openai" and llmOpenAI:
            response = llmOpenAI.invoke(messages) # Keep standard OpenAI format
        else:
            return {"error": f"Invalid provider '{provider}' or missing API key."}

        return response.content
    
    except Exception as e:
        return {"error": f"Error fetching OpenAI response: {str(e)}"}

if __name__ == "__main__":    
    try:
        # Read JSON input from stdin (sent by Node.js)
        input_data = sys.stdin.read().strip()
        parsed_data = json.loads(input_data)

        messages = parsed_data.get("messages", [])
        provider = parsed_data.get("provider", "openai").lower()  # Default to OpenAI

        # Fetch response from OpenAI model
        response = fetch_openai_response(messages, provider)
        
        # Print the response as JSON (stdout)
        print(json.dumps({"provider": provider, "response": response}, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
