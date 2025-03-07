import requests
import platform
import json

def get_hardware_data():
    return {
        "cpu": platform.processor(),
        "os": platform.system() + " " + platform.release()
    }

def send_data():
    url = "http://localhost:5000/save-hardware-data"
    data = {"data": get_hardware_data()}
    
    try:
        response = requests.post(url, json=data)
        print("Response:", response.json())
    except requests.exceptions.RequestException as e:
        print("Error sending data:", e)

if __name__ == "__main__":
    send_data()
