from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS
from auth import auth, bcrypt, login_required, get_conn, release_conn
import math

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

CORS(app, supports_credentials=True)

# Initialize extensions
bcrypt.init_app(app)
app.register_blueprint(auth)

# API Key
API_KEY = os.getenv("OPENWEATHER_API_KEY")


# ============================================
# HELPERS
# ============================================
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def calculate_credits(distance_km):
    return max(1, int(distance_km * 2))  # 2 credits per km, min 1


# ============================================
# AQI RECOMMENDATION LOGIC
# ============================================
def get_recommendations(data):
    aqi = data.get("aqi", 1)
    pm2_5 = data.get("pm2_5", 0)
    pm10 = data.get("pm10", 0)
    no2 = data.get("no2", 0)
    o3 = data.get("o3", 0)
    co = data.get("co", 0)

    alerts = []
    actions = []
    safe_activities = []
    avoid = []
    groups_at_risk = []

    if aqi == 1:
        summary = "Air quality is good. Enjoy your day!"
        outdoor_status = "safe"
        actions.append("No precautions needed")
        safe_activities = ["Jogging", "Cycling", "Outdoor sports", "Walking"]
    elif aqi == 2:
        summary = "Air quality is fair. Generally safe for most people."
        outdoor_status = "safe"
        actions.append("Sensitive individuals should monitor symptoms")
        safe_activities = ["Walking", "Light outdoor activity"]
        groups_at_risk = ["Asthma patients", "Elderly", "Children"]
    elif aqi == 3:
        summary = "Moderate air quality. Limit prolonged outdoor exposure."
        outdoor_status = "limited"
        actions += ["Wear a mask (N95/KN95) if outdoors for long", "Limit outdoor exercise to 30 mins", "Keep windows partially closed"]
        avoid = ["Intense outdoor exercise", "Outdoor activity for kids"]
        groups_at_risk = ["Asthma patients", "Elderly", "Pregnant women", "Children"]
    elif aqi == 4:
        summary = "Poor air quality. Take precautions."
        outdoor_status = "not_recommended"
        actions += ["Wear N95/KN95 mask outdoors", "Use air purifier indoors", "Keep windows and doors closed", "Avoid outdoor exercise"]
        avoid = ["Outdoor exercise", "Opening windows", "Letting children play outside"]
        groups_at_risk = ["Everyone — especially asthma, heart, lung patients"]
        alerts.append("⚠️ Poor air quality alert — minimize outdoor time")
    elif aqi == 5:
        summary = "Very poor air quality. Stay indoors!"
        outdoor_status = "stay_indoors"
        actions += ["Stay indoors as much as possible", "Use HEPA air purifier indoors", "Wear N95/KN95 mask if you must go out", "Seal gaps in windows/doors", "Stay hydrated"]
        avoid = ["Any outdoor activity", "Opening windows", "Outdoor exercise", "Letting vulnerable people go outside"]
        groups_at_risk = ["Everyone"]
        alerts.append("🚨 Hazardous air quality — stay indoors!")

    if pm2_5 > 75:
        alerts.append(f"Very high PM2.5 ({pm2_5} µg/m³) — deep lung damage risk. Use N95 mask.")
    elif pm2_5 > 35:
        alerts.append(f"Elevated PM2.5 ({pm2_5} µg/m³) — wear a mask outdoors.")
    if pm10 > 150:
        alerts.append(f"High PM10 ({pm10} µg/m³) — dust/pollen risk. Avoid dusty areas.")
    if no2 > 200:
        alerts.append(f"High NO₂ ({no2} µg/m³) — stay away from heavy traffic areas.")
    if o3 > 180:
        alerts.append(f"High Ozone ({o3} µg/m³) — avoid outdoor activity in afternoon.")
    if co > 10000:
        alerts.append(f"High CO ({co} µg/m³) — ensure indoor ventilation, check gas appliances.")

    return {
        "summary": summary, "outdoor_status": outdoor_status,
        "alerts": alerts, "actions": actions, "avoid": avoid,
        "safe_activities": safe_activities, "groups_at_risk": groups_at_risk, "aqi": aqi
    }


# ============================================
# AIR QUALITY HELPER
# ============================================
def get_air_quality(lat, lon):
    url = "https://api.openweathermap.org/data/2.5/air_pollution"
    params = {"lat": lat, "lon": lon, "appid": API_KEY}
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    item = data["list"][0]
    components = item["components"]
    return {
        "aqi": item["main"]["aqi"],
        "pm2_5": components["pm2_5"], "pm10": components["pm10"],
        "no2": components["no2"],     "o3": components["o3"],
        "co": components["co"],       "so2": components["so2"],
        "lat": lat, "lon": lon
    }


# ============================================
# PUBLIC ROUTES
# ============================================

@app.route("/api/greet", methods=["GET"])
def greet():
    return jsonify({"message": "Hello from server", "status": "running"})


@app.route("/api/health", methods=["GET"])
def health_check():
    conn = None
    try:
        conn = get_conn()
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    finally:
        if conn:
            release_conn(conn)
    return jsonify({"status": "healthy", "database": db_status})


# ============================================
# AQI ROUTES
# ============================================

@app.route("/api/aqi", methods=["GET"])
def aqi():
    lat = request.args.get("lat", 19.076)
    lon = request.args.get("lon", 72.877)
    try:
        data = get_air_quality(float(lat), float(lon))
        recommendations = get_recommendations(data)
        return jsonify({"success": True, "data": data, "recommendations": recommendations})
    except requests.exceptions.HTTPError as e:
        return jsonify({"success": False, "error": f"Failed to fetch air quality data: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"An error occurred: {str(e)}"}), 500


# ============================================
# WEATHER ROUTE
# ============================================

@app.route("/api/weather", methods=["GET"])
def weather():
    city = request.args.get("city", "Pune")
    try:
        res = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"q": city, "appid": API_KEY, "units": "metric"}
        )
        res.raise_for_status()
        return jsonify(res.json())
    except requests.exceptions.HTTPError:
        return jsonify({"error": "City not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================
# WATER QUALITY ROUTES
# ============================================

@app.route("/api/water", methods=["GET"])
def water():
    locality_name = request.args.get("locality", None)
    conn = None
    try:
        conn = get_conn()
        cur = conn.cursor()
        if locality_name:
            cur.execute('SELECT * FROM water_quality WHERE "Locations" LIKE %s', (f"%{locality_name}%",))
        else:
            cur.execute("SELECT * FROM water_quality")
        columns = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        return jsonify({"success": True, "data": data, "source": "database"})
    except Exception as e:
        return jsonify({"success": False, "error": f"An error occurred: {str(e)}"}), 500
    finally:
        if conn:
            release_conn(conn)


# ============================================
# LEADERBOARD ROUTE
# ============================================

@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    conn = None
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT name, credits FROM users ORDER BY credits DESC")
        rows = cur.fetchall()
        result = [{"name": row[0], "credits": row[1]} for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            release_conn(conn)


# ============================================
# TICKET SUBMISSION ROUTE
# ============================================

@app.route("/api/submit_ticket", methods=["POST"])
@login_required
def submit_ticket():
    data = request.json
    print("Received:", data)
    source = data.get("source")
    destination = data.get("destination")

    if not source or not destination:
        return jsonify({"error": "source and destination required"}), 400

    conn = None
    try:
        user_id = request.user["user_id"]
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("""
            SELECT station_name, latitude, longitude
            FROM pune_metro_stations
            WHERE station_name IN (%s, %s)
        """, (source, destination))

        rows = cur.fetchall()
        if len(rows) != 2:
            return jsonify({"error": "Invalid station name(s)"}), 400

        coords = {name: (lat, lon) for name, lat, lon in rows}
        lat1, lon1 = coords[source]
        lat2, lon2 = coords[destination]

        distance = haversine(lat1, lon1, lat2, lon2)
        credits = calculate_credits(distance)

        cur.execute("""
            UPDATE users SET credits = credits + %s WHERE id = %s RETURNING credits
        """, (credits, user_id))

        total_credits = cur.fetchone()[0]
        conn.commit()

        return jsonify({
            "user_id": user_id,
            "earned_credits": credits,
            "total_credits": total_credits,
            "distance_km": round(distance, 2)
        })

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            release_conn(conn)


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "error": "Internal server error"}), 500


# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    print("🚀 Server starting...")
    print(f"📍 API Key loaded: {'Yes' if API_KEY else 'No'}")
    print("🌐 CORS enabled")
    print("🔐 Auth routes registered")
    print("\n✅ Server ready!\n")
    app.run(debug=True, host='0.0.0.0', port=5000)