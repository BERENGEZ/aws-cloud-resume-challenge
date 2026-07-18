from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app) # This allows my frontend to securely communicate with this backend

DB_FILE = "counter.db"

# This function creates the database and sets the counter to 0 if it doesn't exist yet
def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS visitors (id INTEGER PRIMARY KEY, count INTEGER)")
        cursor.execute("INSERT OR IGNORE INTO visitors (id, count) VALUES (1, 0)")
        conn.commit()

# This is the actual API endpoint that my JavaScript will call
@app.route('/api/count', methods=['POST'])
def update_count():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE visitors SET count = count + 1 WHERE id = 1")
        conn.commit()
        cursor.execute("SELECT count FROM visitors WHERE id = 1")
        count = cursor.fetchone()[0]
    return jsonify({"visitor_count": count})

if __name__ == '__main__':
    init_db()
    # We run the API on port 5000 so it doesn't clash with Nginx on port 80
    app.run(host='127.0.0.1', port=5000)