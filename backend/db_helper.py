import mysql.connector
import bcrypt

def get_db_connection():
    try:
        cnx = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="quizo"
        )
        print("Connected to quizo database")
        return cnx
    except mysql.connector.Error as err:
        print(f"Connection error: {err}")
        return None

def get_all_details():
    cnx = get_db_connection()
    if not cnx:
        return None
    try:
        cursor = cnx.cursor()
        query = "SELECT * FROM sign_up"
        cursor.execute(query)
        rows = cursor.fetchall()
        for row in rows:
            print(row)
        cursor.close()
        cnx.close()
        return rows
    except mysql.connector.Error as err:
        print(f"Error fetching details: {err}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def insert_signup(email, username, password):
    cnx = get_db_connection()
    if not cnx:
        return -1
    try:
        cursor = cnx.cursor()
        email = email[:45]
        username = username[:10]
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        query = "INSERT INTO sign_up (email, username, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (email, username, hashed.decode('utf-8')))
        cnx.commit()
        cursor.close()
        cnx.close()
        print(f"Sign-Up successful for {email}")
        return 1
    except mysql.connector.Error as err:
        print(f"Error inserting signup: {err}")
        cnx.rollback()
        cnx.close()
        return -1
    except Exception as e:
        print(f"An error occurred: {e}")
        cnx.rollback()
        cnx.close()
        return -1

def search_login_credentials(email, password):
    cnx = get_db_connection()
    if not cnx:
        return False
    try:
        cursor = cnx.cursor()
        query = "SELECT password FROM sign_up WHERE email=%s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        cnx.close()
        if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
            print(f"Login successful for {email}")
            return True
        else:
            print(f"No data found for {email}")
            return False
    except mysql.connector.Error as err:
        print(f"Error searching login credentials: {err}")
        cnx.close()
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        cnx.close()
        return False

if __name__ == "__main__":
    get_all_details()
    insert_signup('iamnani@gmail.com', 'iamnani', 'Nani123')
    print(search_login_credentials('iamnani@gmail.com', 'Nani123'))
    insert_signup('test21@example.com', 'test21', 'Test123')
    print(search_login_credentials('test21@example.com', 'Test123'))