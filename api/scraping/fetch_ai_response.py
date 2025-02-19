import sys
import json
from langchain_openai import OpenAI

# Initialize OpenAI model
llm = OpenAI(model="gpt-3.5-turbo-instruct", api_key="key")

def fetch_openai_response(user_message):    
    try:       
        # Use the model to generate a response based on the user message
        response = llm.invoke(user_message)

        return response.strip()
    
    except Exception as e:
        print(f"Error in fetch_openai_response: {str(e)}")  # Log error
        return {"error": f"Error fetching OpenAI response: {str(e)}"}

if __name__ == "__main__":    
    try:
        # Hard-coded example response for testing
        user_message = "Hello! How are you?"
    
        # Fetch response from OpenAI model
        response = fetch_openai_response(user_message)
        
        # Print the response as JSON (stdout)
        print(json.dumps(response, ensure_ascii=False))
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
