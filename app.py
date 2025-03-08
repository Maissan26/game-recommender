from flask import Flask, redirect, request, session, url_for, jsonify
from dotenv import load_dotenv
import requests
import re
import os

load_dotenv()


app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY').encode('utf-8', 'replace').decode()

STEAM_API_KEY = os.getenv('STEAM_API_KEY')
OPENID_URL = "https://steamcommunity.com/openid/login"

def get_steam_id(identity_url):
    """Extract Steam ID from OpenID URL"""
    match = re.search(r'\/id\/(\d+)$', identity_url)
    return match.group(1) if match else None

@app.route("/")
def home():
    return '<a href="/login">Login with Steam</a>'

@app.route("/login")
def login():
    """Redirect user to Steam OpenID for authentication"""
    params = {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": url_for("auth", _external=True),
        "openid.realm": request.host_url,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
    }
    return redirect(f"{OPENID_URL}?{'&'.join([f'{k}={v}' for k, v in params.items()])}")

@app.route("/auth")
def auth():
    """Handle Steam OpenID authentication"""
    if "openid.claimed_id" in request.args:
        steam_id = request.args["openid.claimed_id"].split("/")[-1]
        session["steam_id"] = steam_id
        return redirect(url_for("games"))

    return "Authentication failed", 401

@app.route("/games")
def games():
    """Fetch user's Steam games and playtime"""
    if "steam_id" not in session:
        return redirect(url_for("login"))

    steam_id = session["steam_id"]
    url = f"https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key={STEAM_API_KEY}&steamid={steam_id}&include_appinfo=true&include_played_free_games=true"
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json().get("response", {})
        return jsonify(data.get("games", []))  # Return list of games with playtime
    return "Failed to fetch games", 500

@app.route("/logout")
def logout():
    """Log out the user"""
    session.clear()
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)
