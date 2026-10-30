import time
import psutil
import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_FILE = "counter.db"

# 5-second in-memory cache to prevent CPU and Database spam
TELEMETRY_CACHE = {
    "data": {},
    "last_updated": 0
}

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS visitors (id INTEGER PRIMARY KEY, count INTEGER)")
        cursor.execute("INSERT OR IGNORE INTO visitors (id, count) VALUES (1, 0)")
        conn.commit()

def get_uptime():
    """Calculates server uptime into a clean HUD format."""
    uptime_seconds = time.time() - psutil.boot_time()
    days, remainder = divmod(uptime_seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    if days > 0:
        return f"{int(days)}d {int(hours)}h"
    return f"{int(hours)}h {int(remainder // 60)}m"

@app.route('/api/count', methods=['POST'])
def update_count():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE visitors SET count = count + 1 WHERE id = 1")
        conn.commit()
    return jsonify({"status": "logged"}), 200

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    current_time = time.time()
    
    # Cache Check: Returns instantly if data is less than 5 seconds old
    if current_time - TELEMETRY_CACHE["last_updated"] < 5:
        return jsonify(TELEMETRY_CACHE["data"]), 200

    # Fetch DB count only when the cache expires
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT count FROM visitors WHERE id = 1")
        current_count = cursor.fetchone()[0]

    # Build safe payload (Omit OS/Kernel)
    fresh_data = {
        "status": "Online",
        "cpu_usage": f"{psutil.cpu_percent(interval=0.1)}%",
        "ram_usage": f"{psutil.virtual_memory().percent}%",
        "uptime": get_uptime(),
        "visitors": f"{current_count:,}"
    }
    
    TELEMETRY_CACHE["data"] = fresh_data
    TELEMETRY_CACHE["last_updated"] = current_time
    
    return jsonify(fresh_data), 200

if __name__ == '__main__':
    init_db()
    app.run(host='127.0.0.1', port=5000)