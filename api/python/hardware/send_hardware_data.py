import socketio
import platform
import time

# Create a Socket.IO client instance
sio = socketio.Client()

# Connect to the WebSocket server
@sio.event
def connect():
    print("Connected to the WebSocket server")

# Handle the acknowledgment from the server
@sio.event
def hardwareDataResponse(data):
    print("Received response from server:", data)

# Handle disconnection
@sio.event
def disconnect():
    print("Disconnected from the server")

# Function to collect hardware data
def get_hardware_data():
    return {
        "cpu": platform.processor(),
        "os": platform.system() + " " + platform.release()
    }

# Function to send data over WebSocket
def send_data():
    sio.connect('ws://localhost:5000')  # Connect to the WebSocket server
    
    while True:
        data = {"data": get_hardware_data()}
        
        # Emit the 'hardwareData' event to the server
        sio.emit('hardwareData', data)
        
        # Wait for 10 seconds before sending the next request
        time.sleep(10)

if __name__ == "__main__":
    send_data()
