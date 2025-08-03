from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
STEAMCMD_PATH = "" # Set to steamcmdpath (.exe)
APP_ID = "294100"  # RimWorld

def extract_workshop_id(url):
    match = re.search(r'id=(\d+)', url)
    return match.group(1) if match else None

def download_with_steamcmd(workshop_id):
    cmd = [
        STEAMCMD_PATH,
        "+login", "anonymous",
        "+workshop_download_item", APP_ID, workshop_id,
        "+quit"
    ]
    subprocess.run(cmd)

@app.route('/download', methods=['POST', 'OPTIONS'])
def download():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight OK'})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    data = request.get_json()
    url = data.get('url')
    workshop_id = extract_workshop_id(url)

    if workshop_id:
        download_with_steamcmd(workshop_id)
        response = jsonify({"status": "success", "id": workshop_id})
        response.status_code = 200
    else:
        response = jsonify({"status": "error", "message": "Invalid URL"})
        response.status_code = 400

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(port=5005)
