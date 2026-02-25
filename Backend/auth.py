from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps
import psycopg2
import psycopg2.extras
from psycopg2 import pool
import os
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

auth = Blueprint("auth", __name__)
bcrypt = Bcrypt()
CORS(auth, supports_credentials=True)  # Enable credentials for auth

SECRET_KEY = "O3yVZDF8tPDKHBUSeb8gLWuMIeDs2uvh6dv9SgL5BeU="

# ─── NEON DB POOL ─────────────────────────────────────
db_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=5,
    dsn=os.getenv("DATABASE_CONNECTION_STRING")
)

def get_conn():
    conn = db_pool.getconn()
    return conn

def release_conn(conn):
    db_pool.putconn(conn)

# ─── SIGNUP ───────────────────────────────────────────
@auth.route("/api/signup", methods=["POST"])
def signup():
    body     = request.json
    name     = body.get("name")
    email    = body.get("email")
    password = body.get("password")

    if not email or not password or not name:
        return jsonify({"error": "All fields required"}), 400

    conn   = get_conn()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        release_conn(conn)
        return jsonify({"error": "Email already registered"}), 409

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id",
        (name, email, hashed)
    )
    user_id = cursor.fetchone()["id"]
    conn.commit()

    cursor.close()
    release_conn(conn)

    token = generate_token(user_id, email)
    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": {"id": user_id, "name": name, "email": email}
    }), 201


# ─── LOGIN ────────────────────────────────────────────
@auth.route("/api/login", methods=["POST"])
def login():
    body     = request.json
    email    = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn   = get_conn()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    release_conn(conn)

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user["id"], user["email"])
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
    })


# ─── HELPERS ──────────────────────────────────────────
def generate_token(user_id, email):
    payload = {
        "user_id": user_id,
        "email":   email,
        "exp":     datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# ─── PROTECT ROUTES ───────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Token missing"}), 401

        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        request.user = payload
        return f(*args, **kwargs)
    return decorated



# ─── ADD THIS TO auth.py, after the /api/login route ─────────────────────────

@auth.route("/api/profile", methods=["GET"])
@login_required
def get_profile():
    conn   = get_conn()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cursor.execute(
    "SELECT id, name, email, credits FROM users WHERE id = %s",
    (request.user["user_id"],)
)
    user = cursor.fetchone()

    cursor.close()
    release_conn(conn)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(dict(user))


# ─── RUN THIS SQL ON YOUR NEON DB IF COLUMNS DON'T EXIST YET ─────────────────
#
# ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;
# ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();