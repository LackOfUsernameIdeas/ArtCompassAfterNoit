import json
import sys
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# Load environment variables from .env file
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
load_dotenv(env_path)

# Get API key from .env
api_key = os.getenv("VITE_OPENAI_API_KEY")

if not api_key:
    raise ValueError("Missing VITE_OPENAI_API_KEY in .env file")

# Initialize OpenAI model with GPT-4o chat endpoint
llm = ChatOpenAI(model="gpt-4o", api_key=api_key)

def fetch_openai_response(messages):    
    try:       
        # Ensure messages are properly structured
        if not isinstance(messages, list):
            return {"error": "Invalid input. Expected a list of messages."}
        
        # Use the correct method to make a chat-based completion request
        response = llm.invoke(messages)
        
        return response.content
    
    except Exception as e:
        return {"error": f"Error fetching OpenAI response: {str(e)}"}

if __name__ == "__main__":    
    try:
        # Read JSON input from stdin (sent by Node.js)
        input_data = sys.stdin.read().strip()
        parsed_data = json.loads(input_data)
        messages = parsed_data.get("messages", [])

        # Fetch response from OpenAI model
        response = fetch_openai_response(messages)
        
        # Print the response as JSON (stdout)
        print(json.dumps(response, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
