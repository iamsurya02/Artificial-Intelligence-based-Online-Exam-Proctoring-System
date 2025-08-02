from db_helper import insert_signup, get_all_details

if __name__ == "__main__":
    # Clear existing data (optional)
    # print("Clearing existing data...")
    # cnx = get_db_connection()
    # cursor = cnx.cursor()
    # cursor.execute("TRUNCATE TABLE sign_up")
    # cnx.commit()
    # cursor.close()
    # cnx.close()

    print("Inserting initial users...")
    insert_signup('divyansh01@gmail.com', 'Divya23', 'DivyaTiwari')
    insert_signup('hemant56@gmail.com', 'Hemant329', 'Hemant123')
    insert_signup('kumar1166@gmail.com', 'kris6', 'Krishna1')
    insert_signup('parth529@gmail.com', 'Parth2839', 'Parth@456')
    insert_signup('quizo_admin@gmail.com', 'ExamPortal', 'Admin')
    print("All users inserted.")
    get_all_details()