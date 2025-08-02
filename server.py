from flask import Flask, render_template, Response, request, jsonify
from flask_cors import CORS
from backend.db_helper import *
from main import *
import os
import sys
import smtplib
import hashlib
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import mysql.connector
import bcrypt

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Email configuration (replace with your Gmail and App Password)
EMAIL_ADDRESS = "g.suryareddy2004@gmail.com"  # Replace with your Gmail
EMAIL_PASSWORD = "lhgt nfgk tlvy txif"  # Generate from Google Account > Security > App Passwords

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="quizo"
    )

# Receiving the sign_up data credentials
@app.route('/signup_data', methods=['POST'])
def signup_data():
    try:
        data = request.get_json()
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        if not all([email, username, password]):
            return jsonify({"success": False, "message": "Missing required fields"}), 400
        result = insert_signup(email, username, password)
        if result == 1:
            return jsonify({"success": True, "message": "Data inserted successfully!"}), 200
        else:
            return jsonify({"success": False, "message": "Error inserting data, email or username may already exist"}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Receiving the login_data credentials
@app.route('/login_data', methods=['POST'])
def login_data():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        if not all([email, password]):
            return jsonify({"success": False, "message": "Missing required fields"}), 400
        result = search_login_credentials(email, password)
        if result:
            return jsonify(True), 200
        return jsonify(False), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Request password reset
@app.route('/request_reset', methods=['POST'])
def request_reset():
    try:
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({"success": False, "message": "Email is required"}), 400

        # Check if email exists
        cnx = get_db_connection()
        cursor = cnx.cursor()
        cursor.execute("SELECT email FROM sign_up WHERE email = %s", (email,))
        if not cursor.fetchone():
            cursor.close()
            cnx.close()
            return jsonify({"success": False, "message": "Email not found"}), 404

        # Generate token
        token = hashlib.sha256((email + str(datetime.datetime.now())).encode()).hexdigest()
        expires_at = datetime.datetime.now() + datetime.timedelta(hours=1)

        # Store token
        cursor.execute(
            "INSERT INTO reset_tokens (token, email, expires_at) VALUES (%s, %s, %s)",
            (token, email, expires_at)
        )
        cnx.commit()
        cursor.close()
        cnx.close()

        # Send email
        reset_link = f"http://127.0.0.1:5000/reset_password?token={token}"
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = email
        msg['Subject'] = "Password Reset Request"
        body = f"Click this link to reset your password: {reset_link}\nThis link expires in 1 hour."
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, email, msg.as_string())

        return jsonify({"success": True, "message": "Reset link sent to your email"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Reset password
@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'GET':
        token = request.args.get('token')
        return render_template('reset_password.html', token=token)
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('password')

        # Validate token
        cnx = get_db_connection()
        cursor = cnx.cursor()
        cursor.execute(
            "SELECT email, expires_at FROM reset_tokens WHERE token = %s",
            (token,)
        )
        result = cursor.fetchone()
        if not result or result[1] < datetime.datetime.now():
            cursor.close()
            cnx.close()
            return jsonify({"success": False, "message": "Invalid or expired token"}), 400

        email = result[0]
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        # Update password
        cursor.execute(
            "UPDATE sign_up SET password = %s WHERE email = %s",
            (hashed.decode('utf-8'), email)
        )
        cnx.commit()

        # Delete token
        cursor.execute("DELETE FROM reset_tokens WHERE token = %s", (token,))
        cnx.commit()
        cursor.close()
        cnx.close()

        return jsonify({"success": True, "message": "Password reset successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Router to render the index HTML template
@app.route('/')
def index_page():
    return render_template('index.html')

# Router to render the Main Quiz HTML template
@app.route('/quiz_html')
def quix_page():
    return render_template('quiz.html')

# Router to stream video frames
@app.route('/video_feed')
def video_feed():
    return Response(proctoringAlgo(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Router to stop the camera and flask server
@app.route('/stop_camera')
def stop_camera():
    global running
    running = False
    main_app()
    print('Camera and Server stopping.....')
    os._exit(0)
    return

# Main function
if __name__ == "__main__":
    print("Starting the Python Flask Server.....")
    app.run(port=5000, debug=True)