import time
import psutil
import platform
import datetime
import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This allows the frontend to securely communicate with this backend

DB_FILE = "counter.db"

# Creates the database and sets the counter to 0 if it doesn't exist yet
def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS visitors (id INTEGER PRIMARY KEY, count INTEGER)")
        cursor.execute("INSERT OR IGNORE INTO visitors (id, count) VALUES (1, 0)")
        conn.commit()

# --- ROUTE 1: INUREMENT COUNTER ---
# Called ONCE when a user first loads the website
@app.route('/api/count', methods=['POST'])
def update_count():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE visitors SET count = count + 1 WHERE id = 1")
        conn.commit()
        cursor.execute("SELECT count FROM visitors WHERE id = 1")
        count = cursor.fetchone()[0]
    return jsonify({"visitor_count": count})

# --- ROUTE 2: FETCH LIVE TELEMETRY ---
# Called EVERY 5 SECONDS by the dashboard to get hardware stats (without adding to the visitor count)
@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    # 1. Calculate Server Uptime
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    uptime_string = str(datetime.timedelta(seconds=int(uptime_seconds)))

    # 2. Read the current visitor count (Do NOT increment here!)
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT count FROM visitors WHERE id = 1")
        current_count = cursor.fetchone()[0]

    # 3. Build the hardware payload
    data = {
        "status": "Online",
        "cpu_usage": f"{psutil.cpu_percent(interval=0.1)}%",
        "ram_usage": f"{psutil.virtual_memory().percent}%",
        "uptime": uptime_string,
        "os": "Ubuntu Server",
        "kernel": platform.release(),
        "visitors": current_count
    }
    
    return jsonify(data)

if __name__ == '__main__':
    init_db()
    # We run the API on port 5000 so it doesn't clash with Nginx on port 80
    app.run(host='127.0.0.1', port=5000)