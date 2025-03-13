import socketio
import time
import threading
import tkinter as tk
from tkinter import ttk, messagebox
import tkinter.font as tkFont
import random
import math

# Create a Socket.IO client instance
sio = socketio.Client()

# Global flag to control data sending
is_connected = False
is_dark_mode = True  # Default to dark mode

# Color schemes based on your provided values
COLORS = {
    "light": {
        "bg": "#ffffff",
        "text": "#333333",
        "primary": "#9a110a",  # RGB 154 17 10
        "secondary": "#f5f5f5",
        "hover": "#e8e8e8",
        "border": "#dddddd"
    },
    "dark": {
        "bg": "#1a1a1a",  # Dark background
        "text": "#ffffff",
        "primary": "#af0b48",  # RGB 175 11 72
        "secondary": "#2a2a2a",
        "hover": "#333333",
        "border": "#444444"
    }
}

# Function to generate random brain wave data
def generate_brain_data():
    # Generate random values within realistic ranges
    raw_value = random.randint(-100, 100)
    attention = random.randint(0, 100)
    meditation = random.randint(0, 100)
    
    # Generate wave data with different scales
    waves = {
        "delta": random.randint(500000, 1500000),
        "theta": random.randint(50000, 150000),
        "low-alpha": random.randint(5000, 15000),
        "high-alpha": random.randint(5000, 20000),
        "low-beta": random.randint(5000, 15000),
        "high-beta": random.randint(5000, 10000),
        "low-gamma": random.randint(2000, 5000),
        "mid-gamma": random.randint(2000, 5000)
    }
    
    return {
        "Raw value": raw_value,
        "Attention": attention,
        "Meditation": meditation,
        "Waves": waves
    }

# Function to send data over WebSocket
def send_data():
    global is_connected
    while is_connected:
        data = {"data": generate_brain_data()}
        sio.emit("brainData", data)
        time.sleep(1)  # Send data every second for more dynamic updates

# Function to handle connection
def connect():
    global is_connected
    try:
        status_label.config(text="Connecting...", fg=current_theme["primary"])
        sio.connect("ws://localhost:5000")  # Connect to WebSocket server
        is_connected = True
        connect_button.config(state=tk.DISABLED)
        disconnect_button.config(state=tk.NORMAL)
        threading.Thread(target=send_data, daemon=True).start()
        status_label.config(text="Connected", fg=current_theme["primary"])
        update_brain_info()  # Show brain data immediately
        
        # Start periodic updates of the display
        start_periodic_updates()
    except Exception as e:
        status_label.config(text=f"Connection failed: {str(e)[:40]}...", fg="red")
        messagebox.showerror("Error", f"Connection failed: {e}")

# Function to handle disconnection
def disconnect():
    global is_connected
    if is_connected:
        is_connected = False
        sio.disconnect()
        connect_button.config(state=tk.NORMAL)
        disconnect_button.config(state=tk.DISABLED)
        status_label.config(text="Disconnected", fg=current_theme["text"])
        stop_periodic_updates()

# Handle server acknowledgment
@sio.event
def brainDataResponse(data):
    print("Received response from server:", data)
    # Update UI with response if needed
    if "message" in data:
        status_label.config(text=f"Server: {data['message']}")

# Handle disconnection event
@sio.event
def disconnect_event():
    print("Disconnected from the server")
    status_label.config(text="Server disconnected", fg="red")

# Periodic updates
update_job = None

def start_periodic_updates():
    global update_job
    update_brain_info()
    # Schedule next update in 1 second
    update_job = root.after(1000, start_periodic_updates)

def stop_periodic_updates():
    global update_job
    if update_job:
        root.after_cancel(update_job)
        update_job = None

# Create progress bar for attention and meditation
def create_meter(parent, value, row, label_text, color=None):
    if color is None:
        # Use a color based on the value (green for high, red for low)
        if value > 75:
            color = "#4CAF50"  # Green
        elif value > 50:
            color = "#FFC107"  # Amber
        elif value > 25:
            color = "#FF9800"  # Orange
        else:
            color = "#F44336"  # Red
    
    # Create label
    tk.Label(parent, text=f"{label_text}:", font=("Helvetica", 10, "bold"),
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(
            row=row, column=0, sticky="w", padx=10, pady=5)
    
    # Create frame for progress bar
    meter_frame = tk.Frame(parent, bg=current_theme["secondary"], height=20, width=200)
    meter_frame.grid(row=row, column=1, sticky="w", padx=10, pady=5)
    
    # Create canvas for custom progress bar
    canvas = tk.Canvas(meter_frame, width=200, height=20, bg=current_theme["bg"],
                     highlightthickness=1, highlightbackground=current_theme["border"])
    canvas.pack()
    
    # Draw progress bar
    bar_width = int(value * 2)  # Scale to 200px max width
    canvas.create_rectangle(0, 0, bar_width, 20, fill=color, outline="")
    
    # Add text showing percentage
    canvas.create_text(100, 10, text=f"{value}%", fill=current_theme["text"],
                     font=("Helvetica", 9, "bold"))

# Toggle between dark and light mode
def toggle_theme():
    global is_dark_mode, current_theme
    is_dark_mode = not is_dark_mode
    current_theme = COLORS["dark"] if is_dark_mode else COLORS["light"]
    
    # Update UI elements with new theme
    root.config(bg=current_theme["bg"])
    main_frame.config(bg=current_theme["bg"])
    title_label.config(bg=current_theme["bg"], fg=current_theme["primary"])
    status_label.config(bg=current_theme["bg"], fg=current_theme["text"])
    theme_button.config(text="☀️ Light Mode" if is_dark_mode else "🌙 Dark Mode",
                       bg=current_theme["secondary"], fg=current_theme["text"])
    
    # Update brain info frame
    brain_frame.config(bg=current_theme["secondary"])
    waves_frame.config(bg=current_theme["secondary"])
    for widget in brain_frame.winfo_children():
        if isinstance(widget, tk.Label):
            widget.config(bg=current_theme["secondary"], fg=current_theme["text"])
    
    for widget in waves_frame.winfo_children():
        if isinstance(widget, tk.Label):
            widget.config(bg=current_theme["secondary"], fg=current_theme["text"])
    
    # Recreate buttons with new theme
    create_buttons()

# Update brain info display
def update_brain_info():
    # Clear previous info
    for widget in brain_frame.winfo_children():
        widget.destroy()
    
    for widget in waves_frame.winfo_children():
        widget.destroy()
    
    # Get current brain data
    brain_data = generate_brain_data()
    
    # Display raw value
    tk.Label(brain_frame, text="📊 Raw Value:", font=("Helvetica", 10, "bold"), 
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(
            row=0, column=0, sticky="w", padx=10, pady=5)
    
    raw_value = brain_data["Raw value"]
    raw_color = current_theme["primary"] if raw_value > 0 else "#4CAF50"
    tk.Label(brain_frame, text=str(raw_value), font=("Helvetica", 10, "bold"),
            bg=current_theme["secondary"], fg=raw_color).grid(
            row=0, column=1, sticky="w", padx=10, pady=5)
    
    # Create meters for attention and meditation
    create_meter(brain_frame, brain_data["Attention"], 1, "🧠 Attention", 
                color=current_theme["primary"])
    create_meter(brain_frame, brain_data["Meditation"], 2, "🧘 Meditation", 
                color="#4CAF50")
    
    # Display wave data
    tk.Label(waves_frame, text="Brain Waves", font=("Helvetica", 12, "bold"),
            bg=current_theme["secondary"], fg=current_theme["primary"]).grid(
            row=0, column=0, columnspan=2, sticky="w", padx=10, pady=(10, 5))
    
    # Display each wave type
    row = 1
    wave_icons = {
        "delta": "🌊",
        "theta": "🌀",
        "low-alpha": "📉",
        "high-alpha": "📈",
        "low-beta": "⚡",
        "high-beta": "⚡⚡",
        "low-gamma": "✨",
        "mid-gamma": "✨✨"
    }
    
    for wave, value in brain_data["Waves"].items():
        icon = wave_icons.get(wave, "📶")
        tk.Label(waves_frame, text=f"{icon} {wave.capitalize()}:", 
                font=("Helvetica", 9, "bold"),
                bg=current_theme["secondary"], fg=current_theme["text"]).grid(
                row=row, column=0, sticky="w", padx=10, pady=3)
        
        tk.Label(waves_frame, text=f"{value:,}", font=("Helvetica", 9),
                bg=current_theme["secondary"], fg=current_theme["text"]).grid(
                row=row, column=1, sticky="w", padx=10, pady=3)
        
        row += 1

# Create buttons
def create_buttons():
    global connect_button, disconnect_button
    
    # Remove old buttons if they exist
    if 'connect_button' in globals():
        connect_button.destroy()
    if 'disconnect_button' in globals():
        disconnect_button.destroy()
    
    # Create new styled buttons
    connect_button = tk.Button(button_frame, text="Connect", command=connect, width=15,
                             bg=current_theme["primary"], fg="white",
                             font=("Helvetica", 10, "bold"), relief="flat",
                             state=tk.NORMAL if not is_connected else tk.DISABLED)
    connect_button.grid(row=0, column=0, padx=10, pady=10)
    
    disconnect_button = tk.Button(button_frame, text="Disconnect", command=disconnect, width=15,
                                bg=current_theme["secondary"], fg=current_theme["text"],
                                font=("Helvetica", 10, "bold"), relief="flat",
                                state=tk.DISABLED if not is_connected else tk.NORMAL)
    disconnect_button.grid(row=0, column=1, padx=10, pady=10)

# Set initial theme
current_theme = COLORS["dark"] if is_dark_mode else COLORS["light"]

# GUI Setup
root = tk.Tk()
root.title("Brain Wave Monitor")
root.geometry("400x600")
root.configure(bg=current_theme["bg"])
root.resizable(True, True)

# Main container with padding (similar to p-4)
main_frame = tk.Frame(root, bg=current_theme["bg"], padx=15, pady=15)
main_frame.pack(fill="both", expand=True)

# Title with custom font
title_label = tk.Label(main_frame, text="Brain Wave Monitor", 
                     font=("Helvetica", 18, "bold"), 
                     bg=current_theme["bg"], fg=current_theme["primary"])
title_label.pack(pady=(0, 10))

# Theme toggle button
theme_button = tk.Button(main_frame, text="☀️ Light Mode" if is_dark_mode else "🌙 Dark Mode", 
                       command=toggle_theme, bg=current_theme["secondary"], 
                       fg=current_theme["text"], relief="flat")
theme_button.pack(pady=(0, 15), anchor="e")

# Brain info frame (like a card)
brain_frame = tk.Frame(main_frame, bg=current_theme["secondary"], 
                     padx=10, pady=10, relief="flat", bd=1)
brain_frame.pack(fill="x", pady=10)

# Waves info frame (like a card)
waves_frame = tk.Frame(main_frame, bg=current_theme["secondary"], 
                     padx=10, pady=10, relief="flat", bd=1)
waves_frame.pack(fill="x", pady=10)

# Status label
status_label = tk.Label(main_frame, text="Not connected", 
                      font=("Helvetica", 10), 
                      bg=current_theme["bg"], fg=current_theme["text"])
status_label.pack(pady=10)

# Button frame
button_frame = tk.Frame(main_frame, bg=current_theme["bg"])
button_frame.pack(pady=10)

# Create initial buttons
create_buttons()

# Initialize brain info display
update_brain_info()

# Start the GUI
root.mainloop()