import socketio
import platform
import time
import threading
import tkinter as tk
from tkinter import messagebox

# Create a Socket.IO client instance
sio = socketio.Client()

# Global flag to control data sending
is_connected = False

# Function to collect hardware data
def get_hardware_data():
    return {
        "cpu": platform.processor(),
        "os": platform.system() + " " + platform.release()
    }

# Function to send data over WebSocket
def send_data():
    global is_connected
    while is_connected:
        data = {"data": get_hardware_data()}
        sio.emit("hardwareData", data)
        time.sleep(10)  # Send data every 10 seconds

# Function to handle connection
def connect():
    global is_connected
    try:
        sio.connect("ws://localhost:5000")  # Connect to WebSocket server
        is_connected = True
        connect_button.config(state=tk.DISABLED)
        disconnect_button.config(state=tk.NORMAL)
        threading.Thread(target=send_data, daemon=True).start()
        messagebox.showinfo("Connection", "Connected to WebSocket server!")
    except Exception as e:
        messagebox.showerror("Error", f"Connection failed: {e}")

# Function to handle disconnection
def disconnect():
    global is_connected
    if is_connected:
        is_connected = False
        sio.disconnect()
        connect_button.config(state=tk.NORMAL)
        disconnect_button.config(state=tk.DISABLED)
        messagebox.showinfo("Disconnection", "Disconnected from WebSocket server!")

# Handle server acknowledgment
@sio.event
def hardwareDataResponse(data):
    print("Received response from server:", data)

# Handle disconnection event
@sio.event
def disconnect_event():
    print("Disconnected from the server")

# GUI Setup
root = tk.Tk()
root.title("WebSocket Client")

connect_button = tk.Button(root, text="Connect", command=connect, width=20)
connect_button.pack(pady=10)

disconnect_button = tk.Button(root, text="Disconnect", command=disconnect, width=20, state=tk.DISABLED)
disconnect_button.pack(pady=10)

root.mainloop()
