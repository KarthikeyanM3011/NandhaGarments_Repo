from utils.database import get_db_connection

class User:
    @staticmethod
    def create_user(email, password_hash, user_type, status='pending'):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute(
            "INSERT INTO users (email, password_hash, user_type, status) VALUES (%s, %s, %s, %s)",
            (email, password_hash, user_type, status)
        )
        user_id = cursor.lastrowid
        connection.close()
        return user_id
    
    @staticmethod
    def get_user_by_email(email):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        connection.close()
        return user
    
    @staticmethod
    def get_user_by_id(user_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        connection.close()
        return user
    
    @staticmethod
    def update_user_status(user_id, status):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("UPDATE users SET status = %s WHERE id = %s", (status, user_id))
        connection.close()
        return cursor.rowcount > 0