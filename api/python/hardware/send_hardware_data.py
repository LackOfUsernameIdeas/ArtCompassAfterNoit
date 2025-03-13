import socketio
import platform
import time
import threading
import tkinter as tk
from tkinter import ttk, messagebox
import tkinter.font as tkFont

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

# Function to collect hardware data
def get_hardware_data():
    return {
        "cpu": platform.processor(),
        "os": platform.system() + " " + platform.release(),
        "python": platform.python_version(),
        "machine": platform.machine()
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
        status_label.config(text="Connecting...", fg=current_theme["primary"])
        sio.connect("ws://localhost:5000")  # Connect to WebSocket server
        is_connected = True
        connect_button.config(state=tk.DISABLED)
        disconnect_button.config(state=tk.NORMAL)
        threading.Thread(target=send_data, daemon=True).start()
        status_label.config(text="Connected", fg=current_theme["primary"])
        update_hardware_info()  # Show hardware info immediately
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

# Handle server acknowledgment
@sio.event
def hardwareDataResponse(data):
    print("Received response from server:", data)
    # Update UI with response if needed
    if "message" in data:
        status_label.config(text=f"Server: {data['message']}")

# Handle disconnection event
@sio.event
def disconnect_event():
    print("Disconnected from the server")
    status_label.config(text="Server disconnected", fg="red")

# Create rounded rectangle button
def create_rounded_button(parent, text, command, width=200, height=40):
    button_frame = tk.Frame(parent, bg=current_theme["bg"], width=width, height=height)
    
    # Create canvas for the button
    canvas = tk.Canvas(button_frame, width=width, height=height, 
                      bg=current_theme["bg"], highlightthickness=0)
    canvas.pack()
    
    # Draw rounded rectangle
    canvas.create_rectangle(0, 0, width, height, fill=current_theme["secondary"], 
                           outline=current_theme["border"], width=1, radius=10)
    
    # Add text
    canvas.create_text(width/2, height/2, text=text, fill=current_theme["text"], 
                      font=("Helvetica", 10, "bold"))
    
    # Bind events
    def on_enter(e):
        canvas.delete("all")
        canvas.create_rectangle(0, 0, width, height, fill=current_theme["hover"], 
                               outline=current_theme["primary"], width=1, radius=10)
        canvas.create_text(width/2, height/2, text=text, fill=current_theme["primary"], 
                          font=("Helvetica", 10, "bold"))
    
    def on_leave(e):
        canvas.delete("all")
        canvas.create_rectangle(0, 0, width, height, fill=current_theme["secondary"], 
                               outline=current_theme["border"], width=1, radius=10)
        canvas.create_text(width/2, height/2, text=text, fill=current_theme["text"], 
                          font=("Helvetica", 10, "bold"))
    
    def on_click(e):
        command()
    
    canvas.bind("<Enter>", on_enter)
    canvas.bind("<Leave>", on_leave)
    canvas.bind("<Button-1>", on_click)
    
    return button_frame

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
    
    # Update hardware info frame
    hardware_frame.config(bg=current_theme["secondary"])
    for widget in hardware_frame.winfo_children():
        widget.config(bg=current_theme["secondary"], fg=current_theme["text"])
    
    # Recreate buttons with new theme
    create_buttons()
    update_hardware_info()

# Update hardware info display
def update_hardware_info():
    # Clear previous info
    for widget in hardware_frame.winfo_children():
        widget.destroy()
    
    # Get current hardware data
    hw_data = get_hardware_data()
    
    # Display hardware info with icons
    tk.Label(hardware_frame, text="🖥️ CPU:", font=("Helvetica", 10, "bold"), 
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=0, column=0, sticky="w", padx=10, pady=5)
    tk.Label(hardware_frame, text=hw_data["cpu"], wraplength=250,
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=0, column=1, sticky="w", padx=10, pady=5)
    
    tk.Label(hardware_frame, text="💻 OS:", font=("Helvetica", 10, "bold"),
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=1, column=0, sticky="w", padx=10, pady=5)
    tk.Label(hardware_frame, text=hw_data["os"],
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=1, column=1, sticky="w", padx=10, pady=5)
    
    tk.Label(hardware_frame, text="🐍 Python:", font=("Helvetica", 10, "bold"),
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=2, column=0, sticky="w", padx=10, pady=5)
    tk.Label(hardware_frame, text=hw_data["python"],
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=2, column=1, sticky="w", padx=10, pady=5)
    
    tk.Label(hardware_frame, text="⚙️ Machine:", font=("Helvetica", 10, "bold"),
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=3, column=0, sticky="w", padx=10, pady=5)
    tk.Label(hardware_frame, text=hw_data["machine"],
            bg=current_theme["secondary"], fg=current_theme["text"]).grid(row=3, column=1, sticky="w", padx=10, pady=5)

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
root.title("Hardware Monitor")
root.geometry("400x500")
root.configure(bg=current_theme["bg"])
root.resizable(False, False)

# Main container with padding (similar to p-4)
main_frame = tk.Frame(root, bg=current_theme["bg"], padx=15, pady=15)
main_frame.pack(fill="both", expand=True)

# Title with custom font
title_label = tk.Label(main_frame, text="Hardware Monitor", 
                     font=("Helvetica", 18, "bold"), 
                     bg=current_theme["bg"], fg=current_theme["primary"])
title_label.pack(pady=(0, 10))

# Theme toggle button
theme_button = tk.Button(main_frame, text="☀️ Light Mode" if is_dark_mode else "🌙 Dark Mode", 
                       command=toggle_theme, bg=current_theme["secondary"], 
                       fg=current_theme["text"], relief="flat")
theme_button.pack(pady=(0, 15), anchor="e")

# Hardware info frame (like a card)
hardware_frame = tk.Frame(main_frame, bg=current_theme["secondary"], 
                        padx=10, pady=10, relief="flat", bd=1)
hardware_frame.pack(fill="x", pady=10)

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

# Initialize hardware info display
update_hardware_info()

# Start the GUI
root.mainloop()