# Описание на целта на скрипта:
# Този Python скрипт е разработен за събиране и предаване на електроенцефалографски (ЕЕГ) данни от NeuroSky MindWave Mobile 2
# към отдалечен Socket.IO сървър за анализ в реално време. 
# Той използва библиотеката pymindwave2 за установяване на връзка с устройството, 
# като извлича различни невронни параметри като мозъчни вълни, концентрация, медитация.
# Скриптът създава графичен потребителски интерфейс (GUI) с Tkinter за лесно стартиране на сесия за събиране на данни, 
# който позволява на потребителя да инициира предаване на мозъчни данни с едно натискане на бутон.
# Освен това, скриптът филтрира и обработва получените данни, премахвайки ненужни raw данни и подготвяйки ги за JSON предаване, 
# като изпраща невронната информация към сървъра през определени интервали и поддържа многонишково изпълнение за ефективна комуникация.

import socketio
from pymindwave2 import MindWaveMobile2, Session, SessionConfig
import json
import threading
import tkinter as tk
from datetime import datetime
import time

# Инициализиране на Socket.IO клиента
sio = socketio.Client()

# Обработчик на събитие при свързване
@sio.event
def connect():
    print("Connected to Socket.IO server")

# Обработчик на събитие при прекъсване на връзката
@sio.event
def disconnect():
    print("Disconnected from Socket.IO server")

# Обработчик на събитие за получаване на отговор от сървъра (по желание)
@sio.event
def hardwareDataResponse(data):
    print("Received hardware data response:", data)

# Инициализиране и свързване със слушалката
headset = MindWaveMobile2()
success = headset.start(n_tries=5, timeout=30)

# Създаване на глобална променлива за сесията
session = None

def start_session():
    global session
    # Свързване със Socket.IO сървъра (заменете URL-а с вашия сървър)
    sio.connect('ws://artcompass-api.noit.eu')

    if success:  # Ако слушалката е успешно свързана
        # Създаване на конфигурация за сесията
        sess_config = SessionConfig()

        # Инициализиране и стартиране на сесията за запис
        session = Session(headset, config=sess_config)

        # Корекция на функцията за спиране на сесията
        original_stop = session.stop
        def patched_stop():
            try:
                if hasattr(session, "_data_subscription") and session._data_subscription:
                    session._data_subscription.detach()
                if hasattr(session, "_blinks_subscription") and session._blinks_subscription:
                    session._blinks_subscription.detach()
                session.is_active = False
                session.end_time = datetime.now()
                session._stop_flag.set()
            except KeyError as e:
                print(f"Failed to detach subscriptions: {e}")
                session.is_active = False
                session.end_time = datetime.now()
                session._stop_flag.set()

        session.stop = patched_stop

        # Стартиране на сесията само ако не е активна
        if not session.is_active:
            session._data_subscription = headset.on_data(session._data_collator)
            if session.config.capture_blinks:
                session._blinks_subscription = headset.on_blink(session._data_collator)

            session.is_active = True
            session.start_time = datetime.now()
            session._stop_flag.clear()

            # Стартиране на обработката на събития в отделен нишка (thread)
            thread = threading.Thread(target=session._events_processor, daemon=True)
            thread.start()

            print(f"New session started at {session.start_time.strftime('%H:%M:%S')}")

        # Функция за изпращане на данни към сървъра в цикъл
        def send_data():
            try:
                while session.is_active:
                    if session._data:  # Проверка за нови данни
                        latest_entry = session._data[-1]  # Вземане на най-новата стойност
                        
                        # Безопасно декодиране на JSON и филтриране на данните
                        try:
                            json_entry = json.loads(json.dumps(latest_entry))  # Гарантиране на JSON формат
                            filtered_entry = {key: value for key, value in json_entry.items() if key != 'raw_data'}
                            
                            # Изпращане към сървъра
                            sio.emit('hardwareData', json.dumps(filtered_entry, indent=4))
                            print("Изпращане на данни до сървъра:", json.dumps(filtered_entry, indent=4))
                        except (UnicodeDecodeError, json.JSONDecodeError) as e:
                            print(f"Data decoding error: {e}")  # Дебъгване на невалидни данни

                    time.sleep(1)  # Регулиране на честотата на изпращане

                # Когато цикълът приключи, изпращане на сигнал за край
                sio.emit('dataDoneTransmitting', 'Data transmission complete')
                print("Data transmission complete")  # Известяване за завършване на предаването
                
            except KeyboardInterrupt:
                print("\nSession interrupted. Stopping...")
                session.is_active = False

            # # Запазване на данните от сесията в JSON файл (по подразбиране не се изпълнява)
            # if not session.is_active and len(session._data) > 0:
            #     filtered_data = [{key: value for key, value in entry.items() if key != 'raw_data'} for entry in session._data]

            #     with open("session_data.json", "w", encoding="utf-8") as file:
            #         json.dump(filtered_data, file, indent=4)

            #     print("Session data saved to session_data.json")

        # Стартиране на нишка за изпращане на данни
        data_thread = threading.Thread(target=send_data, daemon=True)
        data_thread.start()

# Създаване на основния прозорец на GUI
root = tk.Tk()
root.title("Мозъчен анализ - АртКомпас")

# Задаване на размер на прозореца
root.geometry("500x200")  
root.configure(bg="white")  # Запазване на неутрален фон

# # Задаване на икона (заменете 'icon.ico' с действителния път до вашата икона)
# root.iconbitmap("icon.ico")  

# Дефиниране на стил на бутона
button_style = {
    "font": ("Arial", 16, "bold"),  # По-голям шрифт
    "fg": "white",  # Бял текст
    "bg": "#b00404",  # Основен червен цвят
    "activebackground": "#8a0303",  # По-тъмен червен при натискане
    "activeforeground": "white",  # Запазване на белия текст
    "relief": "flat",  # Премахване на стандартния бордюр
    "borderwidth": 0,  # Без бордюр
    "padx": 20,  # Хоризонтално отстояние
    "pady": 10,  # Вертикално отстояние
    "height": 2,  # Увеличаване на височината
    "width": 25,  # По-голяма ширина
    "cursor": "hand2",  # Промяна на курсора на ръка
}

# Създаване на бутон
connect_button = tk.Button(root, text="Започнете сесия", command=start_session, **button_style)

# Центриране на бутона
connect_button.place(relx=0.5, rely=0.5, anchor="center")

# Добавяне на ефект при посочване с мишката (увеличаване на размера)
def on_enter(e):
    connect_button.config(font=("Arial", 18, "bold"), padx=25, pady=15, bg="#8a0303")  # Увеличаване и потъмняване

def on_leave(e):
    connect_button.config(font=("Arial", 16, "bold"), padx=20, pady=10, bg="#b00404")  # Възстановяване на оригиналния стил

connect_button.bind("<Enter>", on_enter)
connect_button.bind("<Leave>", on_leave)

# Стартиране на основния цикъл на Tkinter
root.mainloop()
